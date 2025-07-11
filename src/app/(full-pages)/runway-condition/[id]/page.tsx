"use client";

import { RunwayConditionCreateRequest, SituationalNotification } from "@/types/runway-condition";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
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
  "VPP": string | null;
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
  "improvementProcedure": ProcedureType | null,
  "details": {
    "coefficient1": number | undefined,
    "coefficient2": number | undefined,
    "coefficient3": number | undefined,
    "chemicalType": ("HARD" | "LIQUID") | undefined
  }
  RCR?: string | null;
  applicationTime: string | null
}

export interface FormValuesState {
  form1: Form1Values;
  form2: Form2Values;
  form3: Form3Values;
}





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

  console.log(checkedFields, "checkedFields");

  const [notificationFieldValues, setNotificationFieldValues] = useState<Partial<Record<NotificationType, string>>>({});

  const { id } = useParams();
  const isCreateMode = id === "create";
  console.log(isCreateMode, "isCreateMode");


  console.log(notificationFieldValues, "notificationFieldValues");




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
        coefficient1: undefined,
        chemicalType: undefined,
        coefficient2: undefined,
        coefficient3: undefined
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

  const [currentTime, setCurrentTime] = useState(dayjs().format("YYYY-MM-DD HH:mm:ss"));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs().format("YYYY-MM-DD HH:mm:ss"));
    }, 1000); // обновляем каждую секунду


    return () => clearInterval(interval); // очищаем при размонтировании
  }, []);

  const steps = [
    {
      title: "Состояние ВПП",
      content: <NewRunWay3 form={form} />,
    },
    {
      title: "Ситуационные уведомления",
      content: (
        <div>
          <h1 className="mb-4 text-lg font-semibold">
            Ситуационной осведомленности.
          </h1>
          {/* <Form.List name="situationalNotifications">
            {(fields, { add, remove }) => ( */}
          <div>
            <Form.Item name={"notificationType"}>
              <Checkbox.Group<string> value={checkedFields} onChange={(value) => {
                setCheckedFields((value));
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
                                    { validator: customNumberValidator },
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
                                        { validator: customNumberValidator },
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
                                    { validator: customNumberValidator },
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
                                      { validator: customNumberValidator },
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
            <h2 className="mb-4 flex  gap-2 text-lg">Время сервера:{" "}
              {/* <Form.Item className="mb-0" name={"date-of-implementation"} rules={[{ required: true, message: "Обязательное поле" }]}>
                <DatePicker placeholder="Выберите дату" showTime />\
                </Form.Item> */}
              <span>{currentTime}</span>
            </h2>
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
          </div>

          {/* <Form.List name="improvementProcedure">
            {(fields, { add, remove }) => (
              <div>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item name={[0, "procedureType"]}>
                      <Radio.Group
                        // onChange={(checkedValues) => {
                        //   const last = checkedValues.slice(-1); // оставляем только последний выбранный
                        //   form.setFieldsValue({
                        //     improvementProcedures: [{ procedureType: last } as any],
                        //   });
                        //   setChemicalTreatmentChecked(last[0] === "Хим. обработка");

                        //   return;

                        //   const currentValues = form.getFieldValue(
                        //     "improvementProcedures",
                        //   ) || [{}];

                        //   // Update state for chemical treatment
                        //   setChemicalTreatmentChecked(checkedValues.includes("Хим. обработка"));

                        //   // If "Хим. обработка" is checked and "Жидкая" isn't already checked
                        //   if (
                        //     checkedValues.includes("Хим. обработка") &&
                        //     !checkedValues.includes("Жидкая")
                        //   ) {
                        //     form.setFieldsValue({
                        //       improvementProcedures: [
                        //         {
                        //           ...currentValues[0],
                        //           procedureType: [...checkedValues, "Жидкая"],
                        //         },
                        //       ],
                        //     });
                        //   } else {
                        //     form.setFieldsValue({
                        //       improvementProcedures: [
                        //         {
                        //           ...currentValues[0],
                        //           procedureType: checkedValues,
                        //         },
                        //       ],
                        //     });
                        //   }
                        // }}
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
                        <Row gutter={[0, 8]}>
                          <Col span={24}>
                            <Checkbox value="Хим. обработка" className=" text-lg">
                              Хим. обработка
                            </Checkbox>
                          </Col>
                          {chemicalTreatmentChecked && (
                            <>
                              <Col span={24}>
                                <div className="ml-6">
                                  <Form.Item name={[0, "chemicalType"]}>
                                    <Radio.Group className="flex flex-col text-lg" defaultValue={ProcedureType.CHEMICAL_TREATMENT}>
                                      <Radio value="Жидкая" className=" text-lg">Жидкая</Radio>
                                      <Radio value="Твердая" className=" text-lg">Твердая</Radio>
                                    </Radio.Group>
                                  </Form.Item>
                                </div>
                              </Col>
                            </>
                          )}
                          <Col span={24}>
                            <Checkbox value={ProcedureType.SAND_APPLICATION} className=" text-lg">Песок</Checkbox>
                          </Col>
                          <Col span={24}>
                            <Checkbox value={ProcedureType.BRUSHING} className=" text-lg">Щеточ</Checkbox>
                          </Col>
                          <Col span={24}>
                            <Checkbox value={ProcedureType.PLOWING} className=" text-lg">Предув</Checkbox>
                          </Col>
                        </Row>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            )}
          </Form.List> */}
          <div className="flex justify-between max-w-[900px] text-lg">
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
                <Row gutter={[0, 8]}>
                  <Col span={24}>
                    <Radio value={ProcedureType.CHEMICAL_TREATMENT} className="text-lg">
                      Хим. обработка
                    </Radio>
                  </Col>
                  {chemicalTreatmentChecked && (
                    <Col span={24}>
                      <div className="ml-6">
                        <Form.Item name={["details", "chemicalType"]}>
                          <Radio.Group className="flex flex-col !text-lg">
                            <Radio value="HARD">Жидкая</Radio>
                            <Radio value="LIQUID">Твердая</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </div>
                    </Col>
                  )}
                  <Col span={24}>
                    <Radio value={ProcedureType.SAND_APPLICATION} className="text-lg">
                      Песок
                    </Radio>
                  </Col>
                  <Col span={24}>
                    <Radio value={ProcedureType.BRUSHING} className="text-lg">
                      Щеточ
                    </Radio>
                  </Col>
                  <Col span={24}>
                    <Radio value={ProcedureType.PLOWING} className="text-lg">
                      Предув
                    </Radio>
                  </Col>
                </Row>
              </Radio.Group>
            </Form.Item>

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

        </div>
      ),
    },
    {
      title: "Общие сведения",
      content: <ReviewStep values={FormValuesState as any} />,
    },
  ];

  const next = async () => {
    form.validateFields().then((value) => {
      console.log(value, "next-value");

      // if (currentStep == 2) {
      //   setFormValuesState({
      //     ...FormValuesState,
      //     [`form${currentStep + 1}`]: 
      //     },
      //   });
      // }
      // else {

      // }

      setFormValuesState({
        ...FormValuesState,
        [`form${currentStep + 1}`]: value,
      });

      // if ((currentStep + 1) == 2) {
      //   return
      // }

      try {
        setCurrentStep(currentStep + 1);
      } catch (error) {
        console.error("Validation failed:", error);
        // Form validation errors will be displayed automatically by Ant Design
      }

    });
  };
  const prev = () => {
    setCurrentStep(currentStep - 1);
  };
  // console.log(FormValuesState.form3["improvementProcedure"][0].procedureType, "procedureType-procedureType");

  const handleFinish = async (values: any) => {

    const RequestMock: RunwayConditionCreateRequest = {
      // reportDateTime: dayjs(FormValuesState.form3["date-of-implementation"]).format('YYYY-MM-DD HH:mm:ss'),
      deviceForImprovement: FormValuesState.form3["device-of-implementation"] as any,
      // improvementProcedures: [FormValuesState.form3].map((i, index: number) => ({
      //   applicationTime: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
      //   procedureType: i["improvementProcedure"] == ProcedureType.CHEMICAL_TREATMENT ? i["details"].chemicalType : i["improvementProcedure"],
      // })),
      improvementProcedures: [{
        applicationTime: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
        procedureType: FormValuesState.form3["improvementProcedure"],
      }],
      runwayDesignation: String(UserData.data?.data.airportDto.runwayDtos.find(i => String(i.id) == FormValuesState.form1.VPP)?.runwayDesignation),
      runwayThirds: [{
        depthMm: Number(FormValuesState.form1.depth1),
        partNumber: 1,
        surfaceCondition: FormValuesState.form1.surfaceCondition1 as any,
        rwycValue: Number(FormValuesState.form1.runwayConditionType1),
        frictionCoefficient: Number(FormValuesState.form3.details.coefficient1),
        temperatureCelsius: 0
      }, {
        depthMm: Number(FormValuesState.form1.depth2),
        partNumber: 1,
        surfaceCondition: FormValuesState.form1.surfaceCondition2 as any,
        rwycValue: Number(FormValuesState.form1.runwayConditionType2),
        frictionCoefficient: Number(FormValuesState.form3.details.coefficient1),
        temperatureCelsius: 0
      }, {
        depthMm: Number(FormValuesState.form1.depth3),
        partNumber: 1,
        surfaceCondition: FormValuesState.form1.surfaceCondition3 as any,
        rwycValue: Number(FormValuesState.form1.runwayConditionType3),
        frictionCoefficient: Number(FormValuesState.form3.details.coefficient1),
        temperatureCelsius: 0
      }],
      situationalNotifications: FormValuesState.form2.notificationType.map((item) => ({
        additionalDetails: item == NotificationType.OTHER ? String(FormValuesState.form2[`${item}`]) : "",
        notificationType: item,
        runwayConditionId: 0,
        runwayLengthReductionM: Number(FormValuesState.form2[`${item}`])
      })),
      runwayId: 1
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
      mutate(RequestMock);
    } catch (error) {
      console.error("Error processing form values:", error);
    }
  };

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Runway condition created successfully!");
      router.push("/");
    }
  }, [isSuccess]);



  useEffect(() => {
    if (!isCreateMode && RunwayConditionDataById.data) {
      const data = RunwayConditionDataById.data;

      // Подставляем в form'у если нужно
      form.setFieldsValue({
        // если будешь показывать в inputs (не обязательно)
      });

      // Переводим runwayThirds -> form1
      const thirds = data.data.runwayThirds || [];
      const getThird = (index: number) => thirds.find(t => t.partNumber === index);

      const form1 = {
        runwayConditionType1: String(getThird(1)?.rwycValue ?? ""),
        surfaceCondition1: String(getThird(1)?.surfaceCondition ?? ""),
        depth1: String(getThird(1)?.depthMm ?? ""),
        coveragePercentage1: "",

        runwayConditionType2: String(getThird(2)?.rwycValue ?? ""),
        surfaceCondition2: String(getThird(2)?.surfaceCondition ?? ""),
        depth2: String(getThird(2)?.depthMm ?? ""),
        coveragePercentage2: "",

        runwayConditionType3: String(getThird(3)?.rwycValue ?? ""),
        surfaceCondition3: String(getThird(3)?.surfaceCondition ?? ""),
        depth3: String(getThird(3)?.depthMm ?? ""),
        coveragePercentage3: "",

        "airport": data.data.airportCode,
        "datetime": data.data.reportDateTime,
        "VPP": data.data.runwayDesignation,
        "temperature": data.data.ambientTemperature,
        "initials": data.data.initials,
        "position": null
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
        "device-of-implementation": Number(data.data.deviceForImprovement) ?? null,
        improvementProcedure: firstProc
          ? firstProc.procedureType
          : null,
        details: {
          chemicalType: firstProc?.procedureType as any,
          coefficient1: undefined,
          coefficient2: undefined,
          coefficient3: undefined,
        },
        RCR: data.data.finalRCR,
        applicationTime: ""
      };

      console.log(form3, "form3");


      setFormValuesState({
        form1,
        form2,
        form3,
      });

      // Перейти сразу на последний шаг (4)
      setCurrentStep(3);
    }
  }, [RunwayConditionDataById.data]);



  return (
    <div>

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
            {currentStep > 0 && (
              <Button disabled={!isCreateMode} onClick={prev} size="large">
                Назад
              </Button>
            )}
            <div className="ml-auto flex gap-2">
              {/* Only show submit on last step */}
              {currentStep === steps.length - 1 && (
                <Button
                  type="primary"
                  loading={isPending}
                  htmlType="submit"
                  size="large"
                  disabled={!isCreateMode}
                >
                  {isPending ? "Создание..." : "Создать"}
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
