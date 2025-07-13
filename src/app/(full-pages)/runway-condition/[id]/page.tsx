"use client";

import { RunwayConditionCreateRequest, RunwayConditionCreateResponse, SituationalNotification } from "@/types/runway-condition";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  Spin,
  Steps
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GetAlertTypes, GetProcedureTypes } from "../../../../services/enums";
import NewRunWay3 from "../_components/NewRunWay3";
import { useCreateRunwayCondition } from "./fetch";
import ReviewStep from "./steps/ReviewStep";
import dayjs from "dayjs";
import useLocalStorage from "use-local-storage";
import { NotificationType, ProcedureType } from "@/consts/data";
import { GetRunWayConditionById } from "@/services/runway-condition.services";
import TextArea from "antd/es/input/TextArea";
import { getAllDevices } from "@/services/device.services";
import { useUserMe } from "@/hooks/use-me";


type CheckboxData = {
  label: string;
  value: string;
  field?: NotificationType;
  suffix?: string;
  subFields?: { field: NotificationType; suffix: string; label: string }[];
  showInput?: boolean;
}

const checkboxesLeft: CheckboxData[] = [
  {
    label: "Уменьшенная длина ВПП LDA",
    value: "Уменьшенная длина ВПП LDA",
    showInput: true,
    field: NotificationType.REDUCED_RUNWAY_LENGTH,
    suffix: "м",
  },
  {
    label: "Снежная позёмка на ВПП",
    value: "Снежная позёмка на ВПП",
    showInput: false,
    field: NotificationType.SNOW_BANK_NEAR_RUNWAY,
  },
  {
    label: "Песок на ВПП",
    value: "Песок на ВПП",
    field: NotificationType.SAND_ON_RUNWAY,
    showInput: false
  },
  {
    label: "Сугробы на ВПП",
    value: "Сугробы на ВПП",
    field: NotificationType.DEBRIS_ON_RUNWAY,
    subFields: [
      { field: NotificationType.DEBRIS_ON_RUNWAY_LEFT, suffix: "м", label: "Левый от оси ВПП" },
      { field: NotificationType.DEBRIS_ON_RUNWAY_RIGHT, suffix: "м", label: "Правый от оси ВПП" },
    ],

  },
  {
    label: "Сугробы на РД",
    value: "Сугробы на РД",
    field: NotificationType.DEBRIS_ON_TAXIWAY,
    subFields: [
      { field: NotificationType.DEBRIS_ON_TAXIWAY_LEFT, suffix: "м", label: "Левый от оси РД" },
      { field: NotificationType.DEBRIS_ON_TAXIWAY_RIGHT, suffix: "м", label: "Правый от оси РД" },
    ],
  },
];



const checkboxesRight: CheckboxData[] = [
  {
    label: "Сугробы вблизи ВПП",
    value: "Сугробы вблизи ВПП",
    field: NotificationType.SNOWDRIFTS_NEAR_RUNWAY,
    showInput: false
  },
  {
    label: "РД Плохое",
    value: "РД Плохое",
    field: NotificationType.TAXIWAY_POOR_CONDITION,
    showInput: true,

  },
  {
    label: "Перрон Плохое",
    value: "Перрон Плохое",
    showInput: true,
    field: NotificationType.APRON_POOR_CONDITION,
  },
  {
    label: "Другое",
    value: "Другое",
    field: NotificationType.OTHER

  },
];


interface ImprovementProcedure {
  procedureType: ProcedureType;
  chemicalType: string | null;
}

interface Form1Values {
  runwayConditionType1: string | null;
  coveragePercentage1: string | null;
  depth1: string | null;
  surfaceCondition1: string | null;
  runwayConditionType2: string | null;
  coveragePercentage2: string | null;
  depth2: string | null;
  surfaceCondition2: string | null;
  runwayConditionType3: string | null;
  coveragePercentage3: string | null;
  depth3: string | null;
  surfaceCondition3: string | null;

  "airport": string | null;
  "datetime": string | null;
  "VPP": string | null | number;
  "temperature": number | null;
  "initials": string | null;
  "position": string | null;


}

interface Form2Values {
  notificationType: (NotificationType)[];
  runwayLengthReductionM: number | null | string;
  additionalDetails: string | null;
  notification_details: { [key: string]: string | number | null } | null;

  [key: (NotificationType | string)]: string | string[] | number | null | {};
}

interface Form3Values {
  "device-of-implementation": number | null;
  "improvementProcedure": ProcedureType | null;
  "details": {
    "coefficient1": number | undefined,
    "coefficient2": number | undefined,
    "coefficient3": number | undefined,
    "chemicalType": ("HARD" | "LIQUID") | undefined
  }
  RCR?: string | null;
  RCRru?: string | null;
  applicationTime: string | null
  VPP?: number
}

export interface FormValuesState {
  form1: Form1Values;
  form2: Form2Values;
  form3: Form3Values;
}




const numberInputFields: NotificationType[] = [
  NotificationType.REDUCED_RUNWAY_LENGTH,
  NotificationType.DEBRIS_ON_RUNWAY_LEFT,
  NotificationType.DEBRIS_ON_RUNWAY_RIGHT,
  NotificationType.DEBRIS_ON_TAXIWAY_LEFT,
  NotificationType.DEBRIS_ON_TAXIWAY_RIGHT,
];

const textInputFields: NotificationType[] = [
  NotificationType.TAXIWAY_POOR_CONDITION,
  NotificationType.APRON_POOR_CONDITION,
  NotificationType.OTHER,
];



export default function RunwayConditionCreate() {
  const [form] = Form.useForm<RunwayConditionCreateRequest>();
  const { mutate, isPending, isSuccess, isError, error } =
    useCreateRunwayCondition();
  const router = useRouter();
  const [value, setValue] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState(form.getFieldsValue());
  const [coverageSelections, setCoverageSelections] = useState<{
    [key: number]: string;
  }>({});
  const [chemicalTreatmentChecked, setChemicalTreatmentChecked] = useState(false);

  const [checkedFields, setCheckedFields] = useState<string[]>([]);

  const [CreateResponse, setCreateResponse] = useState<RunwayConditionCreateResponse | null>(null);

  console.log(checkedFields, "checkedFields");

  const [notificationFieldValues, setNotificationFieldValues] = useState<Partial<Record<NotificationType, string>>>({});

  const [FinalRCRModalOpen, setFinalRCRModalOpen] = useState(false);
  const [finalRCRModalIsEnglish, setFinalRCRModalIsEnglish] = useState(false);

  const { id } = useParams();
  const isCreateMode = id === "create";
  console.log(isCreateMode, "isCreateMode");


  console.log(notificationFieldValues, "notificationFieldValues");


  console.log(CreateResponse, "CreateResponse");



  const [FormValuesState, setFormValuesState] = useState<FormValuesState>({
    form1: {
      "runwayConditionType1": null,
      "coveragePercentage1": null,
      "depth1": null,
      "surfaceCondition1": null,
      "runwayConditionType2": null,
      "coveragePercentage2": null,
      "depth2": null,
      "surfaceCondition2": null,
      "runwayConditionType3": null,
      "coveragePercentage3": null,
      "depth3": null,
      "surfaceCondition3": null,
      airport: null,
      datetime: null,
      initials: null,
      position: null,
      temperature: null,
      VPP: null
    },
    form2: {
      "notificationType": [],
      notification_details: null,
      additionalDetails: null,
      runwayLengthReductionM: null
    },
    form3: {
      "device-of-implementation": null,
      details: {
        chemicalType: undefined,
        coefficient1: 50,
        coefficient2: 50,
        coefficient3: 50
      },
      improvementProcedure: null,
      applicationTime: null
    }
  });

  const [RunWayData, setRunWayData] = useLocalStorage("runway-condition-draft", "");


  console.log(form.getFieldsValue(), "getFieldsValue");

  const RunwayConditionDataById = useQuery({
    queryFn: () => GetRunWayConditionById({
      id: String(id)
    }),
    queryKey: ["runway-condition", id],
  })

  const AllDevicesData = useQuery({
    queryFn: () => getAllDevices(),
    queryKey: ["devices-list"],
  });

  console.log(AllDevicesData, "AllDevicesData");


  console.log(RunwayConditionDataById.data, "RunwayConditionDataById");
  console.log(FormValuesState, "FormValuesState");

  const UserData = useUserMe();

  const customNumberValidator = (_: any, value: any) => {
    if (value === undefined || value > 0) return Promise.resolve();
    return Promise.reject("Значение должно быть больше 0");
  };



  useEffect(() => {
    if (isSuccess) {
      toast.success("Runway condition created successfully!");
      // router.push("/");
    }
  }, [isSuccess]);




  const steps = [
    {
      title: "Состояние ВПП",
      content: <NewRunWay3 form={form} isCreateMode={isCreateMode} />,
    },
    {
      title: "Ситуационные уведомления",
      content: (
        <div>
          <h1 className="mb-4 text-lg font-semibold">
            Ситуационной осведомленности.
          </h1>
          <div>
            <Form.Item name={"notificationType"}>
              <Checkbox.Group<string> value={checkedFields} onChange={(value: string[]) => {
                setCheckedFields(value);
              }} style={{ width: "100%" }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Row gutter={[0, 8]}>
                      {checkboxesLeft.map((item, idx) => (
                        <Col span={24} key={idx}>
                          <Checkbox checked={!!item.field && checkedFields.includes(String(item.field))} value={String(item.field)}>
                            <div className="flex items-center text-lg">
                              {item.label}
                              {item.field && item.showInput === true ? (
                                <Form.Item
                                  name={["notification_details", item.field]}
                                  className="inline-block ml-2 mb-0"
                                  rules={checkedFields.includes(String(item.field)) ? [
                                    { required: true, message: "Обязательное поле" },
                                    ...(numberInputFields.includes(item.field)
                                      ? [{ validator: customNumberValidator }]
                                      : []),
                                  ] : []}
                                >
                                  <Input
                                    value={notificationFieldValues[item.field] || ""}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      setNotificationFieldValues((prev) => ({
                                        ...prev,
                                        [item.field!]: value,
                                      }));

                                      // Обязательно отмечаем чекбокс, если пользователь что-то ввёл
                                      if (!checkedFields.includes(String(item.field))) {
                                        setCheckedFields((prev) => [...prev, String(item.field)]);
                                      }

                                      if (item.field !== undefined) {
                                        form.setFieldsValue({ [item.field]: value });
                                      }

                                      // Обновляем значение в form тоже
                                    }}
                                    size="small" style={{ width: 80 }} suffix={item.suffix || ""} />
                                </Form.Item>
                              ) : ""}
                              {item.subFields &&

                                item.subFields.map((sf, subIdx) => (
                                  <span key={subIdx} className="ml-2">
                                    {sf.label}
                                    <Form.Item
                                      name={["notification_details", sf.field]}
                                      className="inline-block ml-1 mb-0"
                                      rules={checkedFields.includes(String(item.field)) ? [
                                        { required: true, message: "Обязательное поле" },
                                        ...(numberInputFields.includes(item.field as any)
                                          ? [{ validator: customNumberValidator }]
                                          : []),
                                      ] : []}
                                    >
                                      <Input
                                        size="small" style={{ width: 60 }} suffix={sf.suffix || ""} />
                                    </Form.Item>
                                  </span>
                                ))}
                            </div>
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>

                  </Col>
                  <Col span={12}>
                    <Row gutter={[0, 8]}>
                      {checkboxesRight.map((item, idx) => (
                        <Col span={24} key={idx}>
                          <Checkbox className="flex !items-start" value={String(item.field)}>
                            <div className={`flex items-center text-lg gap-1 !flex-wrap  ${item.field == NotificationType.OTHER && "!flex-col !items-start !justify-start"}`}>
                              {/* До инпута — часть до пробела */}
                              <span>{item.label.split(" ")[0]}</span>


                              {item.field && item.field == NotificationType.OTHER ? <>

                                <Form.Item
                                  name={["notification_details", item.field]}
                                  className="inline-block mb-0"
                                  rules={checkedFields.includes(String(item.field)) ? [
                                    { required: true, message: "Обязательное поле" },
                                    ...(numberInputFields.includes(item.field)
                                      ? [{ validator: customNumberValidator }]
                                      : []),
                                  ] : []}
                                >
                                  <TextArea style={{ width: "100%", resize: "both", minHeight: "60px" }} size="small"
                                    onChange={(e) => {
                                      if (e.target.value.trim() !== "") {
                                        setCheckedFields((prev) =>
                                          prev.includes(String(item.field)) ? prev : [...prev, String(item.field)]
                                        );
                                      }
                                    }}></TextArea>
                                </Form.Item>
                              </>
                                : item.showInput === true && (
                                  <Form.Item
                                    name={["notification_details", item.field as any]}
                                    className="inline-block mb-0"
                                    rules={checkedFields.includes(String(item.field)) ? [
                                      { required: true, message: "Обязательное поле" },
                                      ...(numberInputFields.includes(item.field as any)
                                        ? [{ validator: customNumberValidator }]
                                        : []),
                                    ] : []}
                                  >
                                    <Input
                                      size="small"
                                      style={{ width: 80 }}
                                      onChange={(e) => {
                                        if (e.target.value.trim() !== "") {
                                          setCheckedFields((prev) =>
                                            prev.includes(String(item.field)) ? prev : [...prev, String(item.field)]
                                          );
                                        }
                                      }}
                                    />
                                  </Form.Item>
                                )}

                              <span>{item.label.split(" ").slice(1).join(" ")}</span>
                            </div>
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Col>
                </Row>
              </Checkbox.Group>

            </Form.Item>

          </div>
          {/* )}
          </Form.List> */}
        </div>
      ),
    },
    {
      title: "Процедуры улучшения",
      content: (
        <div>
          <div className="mb-4 flex gap-20">
            <h1 className="mb-4 text-lg font-semibold">
              Какие процедуры по улучшению состояния ВПП были применены{" "}
            </h1>
            <h2 className="mb-4 flex  gap-2 text-lg">Время применения:{" "}
              <Form.Item className="mb-0" name={"applicationTime"} rules={[{ required: true, message: "Обязательное поле" }]}>
                <DatePicker placeholder="Выберите дату" showTime format={"MM-DD HH:mm"} />
              </Form.Item>
              {/* <span>{currentTime}</span> */}
            </h2>

          </div>
          <div className="flex justify-between max-w-[1000px] text-lg gap-20">
            <div className="flex flex-col">
              <h2 className="mb-4 flex  gap-2">
                <Form.Item name={"device-of-implementation"} className="mb-0" rules={[{ required: true, message: "Обязательное поле" }]}>
                  <Select
                    className="min-w-[130px]"
                    size="large"

                    placeholder="Выберите устройство"
                    options={AllDevicesData.data?.data.map((d: any) => ({ label: d.name, value: d.id }))}
                  />

                </Form.Item>
              </h2>
              <div>
                <h3>Измеренный коэффициент сцепления</h3>
                <div className="flex gap-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item}>
                      <Form.Item rules={[{
                        required: true,
                        message: "Обязательное поле"
                      }]} name={["details", `coefficient${item}`]}>
                        <Input min={0} max={"99"} maxLength={2} type="number" className="w-16 h-16 text-center flex justify-center text-lg" />
                      </Form.Item>
                    </div>
                  ))}
                </div>
                <p>Коэффициент сцепления включает в ситуационный раздел представлении (RCR) в SNOWTAM</p>
              </div>
            </div>
            <Form.Item name={["improvementProcedure"]}>
              <Radio.Group
                onChange={(e) => {
                  const selected = e.target.value;
                  form.setFieldsValue({
                    improvementProcedures: [{
                      procedureType: selected
                    }]
                  });
                  setChemicalTreatmentChecked(selected === ProcedureType.CHEMICAL_TREATMENT);
                }}
              >
                <Row gutter={[0, 8]} className="flex flex-col !w-[340px] !max-w-[340px] !min-w-[340px] overflow-hidden">
                  <Col span={24} className="">
                    <Radio value={ProcedureType.CHEMICAL_TREATMENT} className="text-lg">
                      Хим. обработка
                    </Radio>
                  </Col>
                  {chemicalTreatmentChecked && (
                    <Col span={24}>
                      <div className="ml-6">
                        <Form.Item className="w-full" rules={[{ required: true, message: "Обязательное поле" }]} name={["details", "chemicalType"]}>
                          <Radio.Group
                            className="flex flex-col !text-lg">
                            <Radio value="HARD">Жидкая</Radio>
                            <Radio value="LIQUID">Твердая</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </div>
                    </Col>
                  )}

                  <Col span={24}>
                    <Radio value={ProcedureType.BRUSHING} className="text-lg">
                      Щеточ
                    </Radio>
                  </Col>
                  <Col span={24}>
                    <Radio value={ProcedureType.PLOWING} className="text-lg">
                      Продув
                    </Radio>
                  </Col>
                </Row>
              </Radio.Group>
            </Form.Item>
          </div>

        </div>
      ),
    },
    {
      title: "Общие сведения",
      content: <ReviewStep formInstance={form} values={FormValuesState as any} />,
    },
  ];

  console.log(form.getFieldsValue([["improvementProcedures"]]), "improvementProcedures");


  const next = async () => {
    form.validateFields().then((value) => {
      console.log(value, "next-value");

      setFormValuesState({
        ...FormValuesState,
        [`form${currentStep + 1}`]: value,
      });
      try {
        setCurrentStep(currentStep + 1);
      } catch (error) {
        console.error("Validation failed:", error);
      }

    });
  };
  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = async (values: any) => {


    const processedNotificationTypes: NotificationType[] = [];

    FormValuesState.form2.notificationType.forEach((type) => {
      if (type === NotificationType.DEBRIS_ON_RUNWAY) {
        processedNotificationTypes.push(
          NotificationType.DEBRIS_ON_RUNWAY_LEFT,
          NotificationType.DEBRIS_ON_RUNWAY_RIGHT
        );
      } else if (type === NotificationType.DEBRIS_ON_TAXIWAY) {
        processedNotificationTypes.push(
          NotificationType.DEBRIS_ON_TAXIWAY_LEFT,
          NotificationType.DEBRIS_ON_TAXIWAY_RIGHT
        );
      } else {
        processedNotificationTypes.push(type);
      }
    });


    const RequestMock: RunwayConditionCreateRequest = {
      // reportDateTime: dayjs(FormValuesState.form3["date-of-implementation"]).format('YYYY-MM-DD HH:mm:ss'),
      deviceForImprovement: FormValuesState.form3["device-of-implementation"] as any,
      // improvementProcedures: [FormValuesState.form3].map((i, index: number) => ({
      //   applicationTime: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
      //   procedureType: i["improvementProcedure"] == ProcedureType.CHEMICAL_TREATMENT ? i["details"].chemicalType : i["improvementProcedure"],
      // })),
      improvementProcedures: [{
        applicationTime: dayjs(FormValuesState.form3.applicationTime).format('YYYY-MM-DDTHH:mm:ss'),
        // applicationTime: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
        procedureType: FormValuesState.form3.improvementProcedure,
      }],
      deviceId: Number(FormValuesState.form3["device-of-implementation"]),
      runwayDesignation: String(UserData.data?.data.airportDto.runwayDtos.find(i => String(i.id) == FormValuesState.form1.VPP)?.runwayDesignation),
      runwayThirds: [{
        depthMm: Number(FormValuesState.form1.depth1),
        partNumber: 1,
        surfaceCondition: FormValuesState.form1.surfaceCondition1 as any,
        rwycValue: Number(FormValuesState.form1.runwayConditionType1),
        frictionCoefficient: Number(FormValuesState.form3.details.coefficient1),
        temperatureCelsius: 0,
        coveragePercentage: Number(FormValuesState.form1.coveragePercentage1)
      }, {
        depthMm: Number(FormValuesState.form1.depth2),
        partNumber: 2,
        surfaceCondition: FormValuesState.form1.surfaceCondition2 as any,
        rwycValue: Number(FormValuesState.form1.runwayConditionType2),
        frictionCoefficient: Number(FormValuesState.form3.details.coefficient2),
        temperatureCelsius: 0,
        coveragePercentage: Number(FormValuesState.form1.coveragePercentage2)

      }, {
        depthMm: Number(FormValuesState.form1.depth3),
        partNumber: 3,
        surfaceCondition: FormValuesState.form1.surfaceCondition3 as any,
        rwycValue: Number(FormValuesState.form1.runwayConditionType3),
        frictionCoefficient: Number(FormValuesState.form3.details.coefficient3),
        temperatureCelsius: 0,
        coveragePercentage: Number(FormValuesState.form1.coveragePercentage3)

      }],
      situationalNotifications: processedNotificationTypes.map((item) => ({
        additionalDetails: item == NotificationType.OTHER ? String(FormValuesState.form2.notification_details?.[`${item}`]) || "" : String(FormValuesState.form2.notification_details?.[`${item}`]) || "",
        notificationType: item,
        runwayConditionId: 0,
        runwayLengthReductionM: Number(FormValuesState.form2.notification_details?.[`${item}`]),
      })),
      runwayId: Number(FormValuesState.form1.VPP),
      initialName: String(FormValuesState.form1.initials),
      position: String(FormValuesState.form1.position),
      temperature: Number(FormValuesState.form1.temperature),
    };

    setRunWayData(JSON.stringify([RequestMock]));

    try {
      const allFormValues = form.getFieldsValue(true);
      const formData = allFormValues || values;
      // localStorage.setItem("runway-condition-draft", JSON.stringify(FormValuesState));
      const processedValues = {
        ...formData,

      };

      console.log("Final processed payload:", processedValues);
      mutate(RequestMock, {
        onSuccess(data, variables, context) {
          if (data) {
            setCreateResponse(data)
            setFinalRCRModalOpen(true);

          }
        },
      });
    } catch (error) {
      console.error("Error processing form values:", error);
    }
  };


  useEffect(() => {
    if (isCreateMode) {
      form.setFieldsValue({
        details: {
          coefficient1: 50,
          coefficient2: 50,
          coefficient3: 50,
        },
      });
    }
    if (!isCreateMode && RunwayConditionDataById.data) {
      const data = RunwayConditionDataById.data;

      form.setFieldsValue({
      });

      form.setFieldsValue({
        "airport": data.data.runwayDto.airportDto.name,
        "datetime": dayjs(data.data.improvementProcedures[0].applicationTime).format('DD-MM HH:mm'),
        "VPP": data.data.runwayDto.runwayDesignation,
        "temperature": Number(data.data.ambientTemperature),
        "initials": data.data.initialName,
        "position": data.data.position
      });

      const thirds = data.data.runwayThirds || [];
      const getThird = (index: number) => thirds.find(t => t.partNumber === index);


      const form1 = {
        runwayConditionType1: String(getThird(1)?.rwycValue ?? ""),
        surfaceCondition1: String(getThird(1)?.surfaceCondition ?? ""),
        depth1: String(getThird(1)?.depthMm ?? ""),
        coveragePercentage1: thirds[0]?.coveragePercentage ?? "",

        runwayConditionType2: String(getThird(2)?.rwycValue ?? ""),
        surfaceCondition2: String(getThird(2)?.surfaceCondition ?? ""),
        depth2: String(getThird(2)?.depthMm ?? ""),
        coveragePercentage2: thirds[1]?.coveragePercentage ?? "",

        runwayConditionType3: String(getThird(3)?.rwycValue ?? ""),
        surfaceCondition3: String(getThird(3)?.surfaceCondition ?? ""),
        depth3: String(getThird(3)?.depthMm ?? ""),
        coveragePercentage3: thirds[2]?.coveragePercentage ?? "",

        "airport": data.data.airportCode,
        "datetime": data.data.reportDateTime,
        "VPP": data.data.runwayDto.runwayDesignation,
        "temperature": data.data.ambientTemperature,
        "initials": data.data.initialName,
        "position": data.data.position
      };

      // situationalNotifications -> form2
      const notifs = data.data.situationalNotifications || [];

      const form2: Form2Values = {
        notificationType: notifs.map(n => n.notificationType),
        additionalDetails: "",
        notification_details: {},
        runwayLengthReductionM: data.data.situationalNotifications.find(i => i.notificationType == NotificationType.REDUCED_RUNWAY_LENGTH)?.runwayLengthReductionM ?? "Нет данных"
      };

      if (!form2.notification_details) {
        return
      }
      for (const notif of notifs) {
        form2.notification_details[notif.notificationType] = String(notif.runwayLengthReductionM ?? notif.additionalDetails ?? "");
      }

      // procedures -> form3
      const firstProc = data.data.improvementProcedures?.[0];

      const form3: Form3Values = {
        "device-of-implementation": Number(data.data.deviceDto.id) ?? null,
        improvementProcedure: firstProc
          ? firstProc.procedureType
          : null,
        details: {
          chemicalType: firstProc?.procedureType as any,
          coefficient1: data.data.runwayThirds[0]?.frictionCoefficient,
          coefficient2: data.data.runwayThirds[1]?.frictionCoefficient,
          coefficient3: data.data.runwayThirds[2]?.frictionCoefficient,
        },
        RCR: data.data.finalRCR,
        RCRru: data.data.finalRCRru,
        applicationTime: data.data.improvementProcedures?.[0]?.applicationTime ?? null,

      };

      console.log(data.data.runwayThirds, "data.data.runwayThirds[0]");


      setFormValuesState({
        form1,
        form2,
        form3,
      });

      form.setFieldsValue({
        details: {
          coefficient1: form3.details.coefficient1,
          coefficient2: form3.details.coefficient2,
          coefficient3: form3.details.coefficient3,
        }
      });

      // Перейти сразу на последний шаг (4)
      setCurrentStep(3);
    }
  }, [RunwayConditionDataById.data, isCreateMode]);

  const isLoadingData = !isCreateMode && RunwayConditionDataById.isLoading;


  if (isLoadingData) {
    return <div className="flex justify-center flex-col items-center p-8 min-w-[1000px] min-h-[500px] gap-5">
      <Spin size="large" />
      <p className="text-lg">Загрузка данных...</p></div>;
  }

  return (
    <div>

      <Modal centered width={600} title={<div className="flex items-center min-w-52 justify-between pr-8"><p>RCR успешно создан</p> <Radio.Group buttonStyle="solid" value={finalRCRModalIsEnglish == true ? "ENG" : "RU"} onChange={(e) => {
        setFinalRCRModalIsEnglish(e.target.value === "ENG");
      }}>
        <Radio.Button value={"RU"}>RU</Radio.Button>
        <Radio.Button value={"ENG"}>ENG</Radio.Button>
      </Radio.Group></div>} maskClosable={false} footer={null} open={FinalRCRModalOpen} onOk={() => { }} onCancel={() => {
        setFinalRCRModalOpen(false);
        toast.success("Runway condition created successfully!");
        router.push("/");
      }}>

        <div className="flex justify-center">
          <div className="flex gap-6 flex-col py-6">
            {
              finalRCRModalIsEnglish ? <div>
                <p>{CreateResponse?.data.finalRCR}</p>
              </div> : <div>
                <p>{CreateResponse?.data.finalRCRru}</p>
              </div>
            }
          </div>
        </div>
      </Modal>
      <Steps
        progressDot
        current={currentStep}
        className="mb-8"
        items={steps.map((s) => ({ title: s.title }))}
      />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
        }}
        className=""
      >
        {steps[currentStep].content}
        <Form.Item>
          <div className="mt-4 flex justify-between">
            {!isCreateMode || currentStep > 0 && (
              <Button disabled={!isCreateMode} onClick={prev} size="large">
                Назад
              </Button>
            )}
            <div className="ml-auto flex gap-2">
              {!isCreateMode || currentStep === steps.length - 1 && (
                <Button
                  type="primary"
                  loading={isPending}
                  htmlType="submit"
                  size="large"
                  disabled={!isCreateMode}
                >
                  {isPending ? "Создание..." : "Создать RCR"}
                </Button>
              )}
              {/* For future steps, show Next button */}
              {currentStep < steps.length - 1 && (
                <Button type="primary" disabled={!isCreateMode} onClick={next} size="large">
                  Далее
                </Button>
              )}
            </div>
          </div>
          {isSuccess && (
            <div className="mt-2 text-green-600">
              Runway condition created successfully!
            </div>
          )}
          {isError && (
            <div className="mt-2 text-red-600">
              {error?.message || "Error creating runway condition."}
            </div>
          )}
        </Form.Item>
      </Form>
    </div>
  );
}
