"use client";

import Loading from "@/components/Loading";
import { NotificationType, ProcedureType } from "@/consts/data";
import { useUserMe } from "@/hooks/use-me";
import { getAllDevices } from "@/services/device.services";
import { GetRunWayConditionById } from "@/services/runway-condition.services";
import {
  RunwayConditionCreateRequest,
  RunwayConditionCreateResponse
} from "@/types/runway-condition";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Steps
} from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useLocalStorage from "use-local-storage";
import NewRunWay3 from "../_components/NewRunWay3";
import { useCreateRunwayCondition } from "./fetch";
import ReviewStep from "./steps/ReviewStep";

type CheckboxData = {
  label: string;
  value: string;
  field?: NotificationType;
  suffix?: string;
  subFields?: { field: NotificationType; suffix: string; label: string }[];
  showInput?: boolean;
};

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
    showInput: false,
  },
  {
    label: "Сугробы на ВПП",
    value: "Сугробы на ВПП",
    field: NotificationType.DEBRIS_ON_RUNWAY,
    subFields: [
      {
        field: NotificationType.DEBRIS_ON_RUNWAY_LEFT,
        suffix: "м",
        label: "Левый от оси ВПП",
      },
      {
        field: NotificationType.DEBRIS_ON_RUNWAY_RIGHT,
        suffix: "м",
        label: "Правый от оси ВПП",
      },
    ],
  },
  {
    label: "Сугробы на РД",
    value: "Сугробы на РД",
    field: NotificationType.DEBRIS_ON_TAXIWAY,
    subFields: [
      {
        field: NotificationType.DEBRIS_ON_TAXIWAY_LEFT,
        suffix: "м",
        label: "Левый от оси РД",
      },
      {
        field: NotificationType.DEBRIS_ON_TAXIWAY_RIGHT,
        suffix: "м",
        label: "Правый от оси РД",
      },
    ],
  },
];

const twoDigitFields = new Set([
  NotificationType.DEBRIS_ON_RUNWAY,
  NotificationType.DEBRIS_ON_TAXIWAY,
  NotificationType.DEBRIS_ON_RUNWAY_LEFT,
  NotificationType.DEBRIS_ON_RUNWAY_RIGHT,
  NotificationType.DEBRIS_ON_TAXIWAY_LEFT,
  NotificationType.DEBRIS_ON_TAXIWAY_RIGHT,
]);

const getMaxLength = (field: string) => {
  if (
    field === NotificationType.DEBRIS_ON_RUNWAY_LEFT ||
    field === NotificationType.DEBRIS_ON_RUNWAY_RIGHT ||
    field === NotificationType.DEBRIS_ON_TAXIWAY_LEFT ||
    field === NotificationType.DEBRIS_ON_TAXIWAY_RIGHT
  ) {
    return 2;
  }
  if (field === NotificationType.REDUCED_RUNWAY_LENGTH) {
    return 4;
  } else {
    return 2
  }
};


const checkboxesRight: CheckboxData[] = [
  {
    label: "Сугробы вблизи ВПП",
    value: "Сугробы вблизи ВПП",
    field: NotificationType.SNOWDRIFTS_NEAR_RUNWAY,
    showInput: false,
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
    field: NotificationType.OTHER,
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

  airport: string | null;
  datetime: string | null;
  VPP: string | null | number;
  temperature: number | null;
  initials: string | null;
  position: string | null;
}

interface Form2Values {
  notificationType: NotificationType[];
  runwayLengthReductionM: number | null | string;
  additionalDetails: string | null;
  notification_details: { [key: string]: string | number | null } | null;

  [key: NotificationType | string]: string | string[] | number | null | {};
}

interface Form3Values {
  "device-of-implementation": number | null;
  improvementProcedure: ProcedureType[] | null;
  details: {
    coefficient1: number | undefined | string;
    coefficient2: number | undefined | string;
    coefficient3: number | undefined | string;
    chemicalType: ("HARD" | "LIQUID") | undefined;
  };
  RCR?: string | null;
  RCRru?: string | null;
  applicationTime: string | null;
  VPP?: number;
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
  const [chemicalTreatmentChecked, setChemicalTreatmentChecked] =
    useState(false);

  const [checkedFields, setCheckedFields] = useState<string[]>([]);

  const [CreateResponse, setCreateResponse] =
    useState<RunwayConditionCreateResponse | null>(null);

  console.log(checkedFields, "checkedFields");

  const [notificationFieldValues, setNotificationFieldValues] = useState<
    Partial<Record<NotificationType, string>>
  >({});

  const [FinalRCRModalOpen, setFinalRCRModalOpen] = useState(false);
  const [finalRCRModalIsEnglish, setFinalRCRModalIsEnglish] = useState(false);

  const [frictionEnabled, setFrictionEnabled] = useState<boolean>(false);

  const { id } = useParams();
  const isCreateMode = id === "create";
  console.log(isCreateMode, "isCreateMode");

  console.log(notificationFieldValues, "notificationFieldValues");

  console.log(CreateResponse, "CreateResponse");

  const [FormValuesState, setFormValuesState] = useState<FormValuesState>({
    form1: {
      runwayConditionType1: null,
      coveragePercentage1: null,
      depth1: null,
      surfaceCondition1: null,
      runwayConditionType2: null,
      coveragePercentage2: null,
      depth2: null,
      surfaceCondition2: null,
      runwayConditionType3: null,
      coveragePercentage3: null,
      depth3: null,
      surfaceCondition3: null,
      airport: null,
      datetime: null,
      initials: null,
      position: null,
      temperature: null,
      VPP: null,
    },
    form2: {
      notificationType: [],
      notification_details: null,
      additionalDetails: null,
      runwayLengthReductionM: null,
    },
    form3: {
      "device-of-implementation": null,
      details: {
        chemicalType: undefined,
        coefficient1: "N/R",
        coefficient2: "N/R",
        coefficient3: "N/R",
      },
      improvementProcedure: null,
      applicationTime: null,
    },
  });

  const [RunWayData, setRunWayData] = useLocalStorage(
    "runway-condition-draft",
    "",
  );

  console.log(form.getFieldsValue(), "getFieldsValue");

  const RunwayConditionDataById = useQuery({
    queryFn: () =>
      GetRunWayConditionById({
        id: String(id),
      }),
    queryKey: ["runway-condition", id],
  });

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
              <Checkbox.Group<string>
                value={checkedFields}
                onChange={(value: string[]) => {
                  setCheckedFields(value);
                }}
                style={{ width: "100%" }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Row gutter={[0, 8]}>
                      {checkboxesLeft.map((item, idx) => (
                        <Col span={24} key={idx}>
                          <Checkbox
                            checked={
                              !!item.field &&
                              checkedFields.includes(String(item.field))
                            }
                            value={String(item.field)}
                          >
                            <div className="flex items-center text-lg">
                              {item.label}
                              {item.field && item.showInput === true ? (
                                <Form.Item
                                  name={["notification_details", item.field]}
                                  className="mb-0 ml-2 inline-block"
                                  rules={
                                    checkedFields.includes(String(item.field))
                                      ? [
                                        {
                                          required: true,
                                          message: "Обязательное поле",
                                        },
                                        ...(numberInputFields.includes(
                                          item.field,
                                        )
                                          ? [
                                            {
                                              validator:
                                                customNumberValidator,
                                            },
                                          ]
                                          : []),
                                      ]
                                      : []
                                  }
                                  normalize={(value) => {
                                    return value.replace(/\D/g, ""); // Удаляет все НЕ цифры
                                  }}
                                >
                                  <Input
                                    value={notificationFieldValues[item.field] || ""}
                                    maxLength={getMaxLength(item.field)}
                                    onChange={(e) => {
                                      const raw = e.target.value.replace(/\D/g, ""); // Only digits
                                      const maxLen = 4;
                                      const trimmed = maxLen ? raw.slice(0, maxLen) : raw;

                                      setNotificationFieldValues((prev) => ({
                                        ...prev,
                                        [item.field!]: trimmed,
                                      }));

                                      if (!checkedFields.includes(String(item.field))) {
                                        setCheckedFields((prev) => [...prev, String(item.field)]);
                                      }

                                      if (item.field !== undefined) {
                                        form.setFieldsValue({
                                          notification_details: {
                                            ...form.getFieldValue("notification_details"),
                                            [item.field]: trimmed,
                                          },
                                        });
                                      }
                                    }}
                                    size="small"
                                    style={{ width: 80 }}
                                    suffix={item.suffix || ""}
                                  />
                                </Form.Item>
                              ) : (
                                ""
                              )}
                              {item.subFields &&
                                item.subFields.map((sf, subIdx) => (
                                  <span key={subIdx} className="ml-2">
                                    {sf.label}
                                    <Form.Item
                                      name={["notification_details", sf.field]}
                                      className="mb-0 ml-1 inline-block"
                                      rules={
                                        checkedFields.includes(
                                          String(item.field),
                                        )
                                          ? [
                                            {
                                              required: true,
                                              message: "Обязательное поле",
                                            },
                                            ...(numberInputFields.includes(
                                              item.field as any,
                                            )
                                              ? [
                                                {
                                                  validator:
                                                    customNumberValidator,
                                                },
                                              ]
                                              : []),
                                          ]
                                          : []
                                      }
                                      normalize={(value) => {
                                        return value.replace(/\D/g, ""); // Удаляет все НЕ цифры
                                      }}
                                    >
                                      <Input
                                        size="small"
                                        style={{ width: 60 }}
                                        value={notificationFieldValues[sf.field] || ""}
                                        maxLength={2}
                                        onChange={(e) => {
                                          const raw = e.target.value.replace(/\D/g, ""); // Remove non-digits
                                          const trimmed = raw.slice(0, 2); // Keep max 2 digits
                                          setNotificationFieldValues((prev) => ({
                                            ...prev,
                                            [sf.field]: trimmed,
                                          }));

                                          if (!checkedFields.includes(String(sf.field))) {
                                            setCheckedFields((prev) => [...prev, String(sf.field)]);
                                          }

                                          form.setFieldsValue({
                                            notification_details: {
                                              ...form.getFieldValue("notification_details"),
                                              [sf.field]: trimmed,
                                            },
                                          });
                                        }}
                                        suffix={sf.suffix || ""}
                                      />

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
                          <Checkbox
                            className="flex !items-start"
                            value={String(item.field)}
                          >
                            <div
                              className={`flex !flex-wrap items-center gap-1 text-lg ${item.field == NotificationType.OTHER && "!flex-col !items-start !justify-start"}`}
                            >
                              {/* До инпута — часть до пробела */}
                              <span>{item.label.split(" ")[0]}</span>

                              {item.field &&
                                item.field == NotificationType.OTHER ? (
                                <>
                                  <Form.Item
                                    name={["notification_details", item.field]}
                                    className="mb-0 inline-block"
                                    rules={
                                      checkedFields.includes(String(item.field))
                                        ? [
                                          {
                                            required: true,
                                            message: "Обязательное поле",
                                          },
                                          ...(numberInputFields.includes(
                                            item.field,
                                          )
                                            ? [
                                              {
                                                validator:
                                                  customNumberValidator,
                                              },
                                            ]
                                            : []),
                                        ]
                                        : []
                                    }
                                  >
                                    <TextArea
                                      style={{
                                        width: "100%",
                                        resize: "both",
                                        minHeight: "60px",
                                      }}
                                      size="small"
                                      onChange={(e) => {
                                        if (e.target.value.trim() !== "") {
                                          setCheckedFields((prev) =>
                                            prev.includes(String(item.field))
                                              ? prev
                                              : [...prev, String(item.field)],
                                          );
                                        }
                                      }}
                                    ></TextArea>
                                  </Form.Item>
                                </>
                              ) : (
                                item.showInput === true && (
                                  <Form.Item
                                    name={[
                                      "notification_details",
                                      item.field as any,
                                    ]}
                                    className="mb-0 inline-block"
                                    rules={
                                      checkedFields.includes(String(item.field))
                                        ? [
                                          {
                                            required: true,
                                            message: "Обязательное поле",
                                          },
                                          ...(numberInputFields.includes(
                                            item.field as any,
                                          )
                                            ? [
                                              {
                                                validator:
                                                  customNumberValidator,
                                              },
                                            ]
                                            : []),
                                        ]
                                        : []
                                    }
                                  // normalize={(value) => value.replace(/\d/g, "")}
                                  >
                                    <Input
                                      size="small"
                                      style={{ width: 80 }}
                                      onChange={(e) => {
                                        if (e.target.value.trim() !== "") {
                                          setCheckedFields((prev) =>
                                            prev.includes(String(item.field))
                                              ? prev
                                              : [...prev, String(item.field)],
                                          );
                                        }
                                      }}
                                    />
                                  </Form.Item>
                                )
                              )}

                              <span>
                                {item.label.split(" ").slice(1).join(" ")}
                              </span>
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
            <h2 className="mb-4 flex gap-2 text-lg">
              Время применения (UTC):{" "}
              <Form.Item
                className="mb-0"
                name={"applicationTime"}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const selectedProcedures =
                        getFieldValue("improvementProcedure") || [];
                      if (
                        selectedProcedures.includes(
                          ProcedureType.CHEMICAL_TREATMENT,
                        ) &&
                        !value
                      ) {
                        return Promise.reject(
                          new Error(
                            "Обязательное поле при выборе хим. обработки",
                          ),
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <DatePicker
                  placeholder="Выберите дату"
                  showTime
                  format={"MM-DD HH:mm"}
                />
              </Form.Item>
              {/* <Form.Item className="mb-0" name={"applicationTime"} rules={[{ required: true, message: "Обязательное поле" }]}>
                <DatePicker placeholder="Выберите дату" showTime format={"MM-DD HH:mm"} />
              </Form.Item> */}
              {/* <span>{currentTime}</span> */}
            </h2>
          </div>
          <div className="flex max-w-[1000px] justify-between gap-20 text-lg">
            <div className="flex flex-col">
              <h2 className="mb-4 flex gap-2">
                <Form.Item
                  name={"device-of-implementation"}
                  className="mb-0"
                // rules={[{ required: true, message: "Обязательное поле" }]}
                >
                  <Select
                    className="min-w-[130px]"
                    size="large"
                    placeholder="Выберите устройство"
                    options={AllDevicesData.data?.data.map((d: any) => ({
                      label: d.name,
                      value: d.id,
                    }))}
                    allowClear
                    onClear={() => {

                    }}
                  />
                </Form.Item>
              </h2>
              <div>
                <h3>Измеренный коэффициент сцепления</h3>
                <Form.Item name={"coefficient"}>
                  <Checkbox
                    checked={frictionEnabled}
                    onChange={(e) => {
                      setFrictionEnabled(e.target.checked);
                      if (!e.target.checked) {
                        form.setFieldsValue({
                          details: {
                            coefficient1: null,
                            coefficient2: null,
                            coefficient3: null,
                          },
                        });
                      }
                    }}
                    className="mb-2"
                  >
                    Ввод вручную
                  </Checkbox>
                </Form.Item>
                <div className="flex gap-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item}>
                      <Form.Item
                        rules={
                          frictionEnabled
                            ? [
                              {
                                required: true,
                                message: "Обязательное поле",
                              },
                            ]
                            : []
                        }
                        name={["details", `coefficient${item}`]}
                        className="flex items-center justify-center"
                      >
                        <InputNumber
                          min={0}
                          max={100}
                          step={1}
                          disabled={!frictionEnabled}
                          placeholder={!frictionEnabled ? "N/R" : undefined}
                          className="flex h-16 w-16 items-center justify-center text-center text-lg"
                          maxLength={2}
                          type="number"
                        />
                      </Form.Item>
                    </div>
                  ))}
                </div>
                <p>
                  Коэффициент сцепления включает в ситуационный раздел
                  представлении (RCR) в SNOWTAM
                </p>
              </div>
            </div>
            <Form.Item name={["improvementProcedure"]}>
              {/* <Radio.Group
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
              </Radio.Group> */}

              <Checkbox.Group
                onChange={(checkedValues: ProcedureType[]) => {
                  setChemicalTreatmentChecked(
                    checkedValues.includes(ProcedureType.CHEMICAL_TREATMENT),
                  );
                }}
              >
                <Row className="flex flex-col gap-2 text-lg">
                  <Checkbox value={ProcedureType.CHEMICAL_TREATMENT}>
                    Хим. обработка
                  </Checkbox>
                  {chemicalTreatmentChecked && (
                    <div className="ml-6">
                      <Form.Item
                        className="w-full"
                        name={["details", "chemicalType"]}
                        rules={[
                          { required: true, message: "Обязательное поле" },
                        ]}
                      >
                        <Radio.Group className="flex flex-col">
                          <Radio value="HARD">Твердая</Radio>
                          <Radio value="LIQUID">Жидкая</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </div>
                  )}
                  <Checkbox value={ProcedureType.BRUSHING}>Щеточ</Checkbox>
                  <Checkbox value={ProcedureType.PLOWING}>Продув</Checkbox>
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </div>
        </div>
      ),
    },
    {
      title: "Общие сведения",
      content: (
        <ReviewStep formInstance={form} values={FormValuesState as any} />
      ),
    },
  ];

  console.log(
    form.getFieldsValue([["improvementProcedures"]]),
    "improvementProcedures",
  );

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

    if (!!FormValuesState.form2.notificationType) {
      FormValuesState.form2.notificationType.forEach((type) => {
        if (type === NotificationType.DEBRIS_ON_RUNWAY) {
          processedNotificationTypes.push(
            NotificationType.DEBRIS_ON_RUNWAY_LEFT,
            NotificationType.DEBRIS_ON_RUNWAY_RIGHT,
          );
        } else if (type === NotificationType.DEBRIS_ON_TAXIWAY) {
          processedNotificationTypes.push(
            NotificationType.DEBRIS_ON_TAXIWAY_LEFT,
            NotificationType.DEBRIS_ON_TAXIWAY_RIGHT,
          );
        } else {
          processedNotificationTypes.push(type);
        }
      });
    }

    // asasasas

    console.log(processedNotificationTypes, "processedNotificationTypes");

    const RequestMock: RunwayConditionCreateRequest = {
      // reportDateTime: dayjs(FormValuesState.form3["date-of-implementation"]).format('YYYY-MM-DD HH:mm:ss'),
      deviceForImprovement: FormValuesState.form3[
        "device-of-implementation"
      ] as any,
      // improvementProcedures: [FormValuesState.form3].map((i, index: number) => ({
      //   applicationTime: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
      //   procedureType: i["improvementProcedure"] == ProcedureType.CHEMICAL_TREATMENT ? i["details"].chemicalType : i["improvementProcedure"],
      // })),
      improvementProcedures: FormValuesState.form3.improvementProcedure
        ? (!!FormValuesState.form3.improvementProcedure.find(
          (i) => i == ProcedureType.CHEMICAL_TREATMENT,
        )
          ? [
            FormValuesState.form3.details.chemicalType as any,
            ...FormValuesState.form3.improvementProcedure,
          ]
          : FormValuesState.form3.improvementProcedure
        )?.map((i) => ({
          applicationTime: dayjs(
            FormValuesState.form3.applicationTime,
          ).format("YYYY-MM-DDTHH:mm:ss"),
          procedureType: i,
        })).filter((i) => i.procedureType != "CHEMICAL_TREATMENT")
        : [],
      deviceId: Number(FormValuesState.form3["device-of-implementation"]),
      runwayDesignation: String(
        UserData.data?.data.airportDto.runwayDtos.find(
          (i) => String(i.id) == FormValuesState.form1.VPP,
        )?.runwayDesignation,
      ),
      runwayThirds: [
        {
          depthMm: Number(FormValuesState.form1.depth1),
          partNumber: 1,
          surfaceCondition: FormValuesState.form1.surfaceCondition1 as any,
          rwycValue: Number(FormValuesState.form1.runwayConditionType1),
          frictionCoefficient: Number(
            FormValuesState.form3.details.coefficient1,
          ),
          temperatureCelsius: 0,
          coveragePercentage: Number(FormValuesState.form1.coveragePercentage1),
        },
        {
          depthMm: Number(FormValuesState.form1.depth2),
          partNumber: 2,
          surfaceCondition: FormValuesState.form1.surfaceCondition2 as any,
          rwycValue: Number(FormValuesState.form1.runwayConditionType2),
          frictionCoefficient: Number(
            FormValuesState.form3.details.coefficient2,
          ),
          temperatureCelsius: 0,
          coveragePercentage: Number(FormValuesState.form1.coveragePercentage2),
        },
        {
          depthMm: Number(FormValuesState.form1.depth3),
          partNumber: 3,
          surfaceCondition: FormValuesState.form1.surfaceCondition3 as any,
          rwycValue: Number(FormValuesState.form1.runwayConditionType3),
          frictionCoefficient: Number(
            FormValuesState.form3.details.coefficient3,
          ),
          temperatureCelsius: 0,
          coveragePercentage: Number(FormValuesState.form1.coveragePercentage3),
        },
      ],
      situationalNotifications: processedNotificationTypes.map((item) => ({
        additionalDetails:
          item == NotificationType.OTHER
            ? String(FormValuesState.form2.notification_details?.[`${item}`]) ||
            ""
            : !!FormValuesState.form2.notification_details?.[`${item}`]
              ? String(FormValuesState.form2.notification_details?.[`${item}`])
              : "",
        notificationType: item,
        runwayConditionId: 0,
        runwayLengthReductionM:
          Number(FormValuesState.form2.notification_details?.[`${item}`]) ?? null,

      })),
      runwayId: Number(FormValuesState.form1.VPP),
      initialName: String(FormValuesState.form1.initials),
      position: String(FormValuesState.form1.position),
      temperature: Number(FormValuesState.form1.temperature),
    };

    console.log(RequestMock, "RequestMock");

    // return;

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
            setCreateResponse(data);
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
          coefficient1: "N/R",
          coefficient2: "N/R",
          coefficient3: "N/R",
        },
      });
    }
    if (!isCreateMode && RunwayConditionDataById.data) {
      const data = RunwayConditionDataById.data;

      form.setFieldsValue({});

      form.setFieldsValue({
        airport: data.data.runwayDto.airportDto.name,
        datetime: dayjs(
          data.data.createdAt,
        ).format("DD-MM HH:mm"),
        VPP: data.data.runwayDto.runwayDesignation,
        temperature: Number(data.data.ambientTemperature),
        initials: data.data.initialName,
        position: data.data.position,
      });

      const thirds = data.data.runwayThirds || [];
      const getThird = (index: number) =>
        thirds.find((t) => t.partNumber === index);

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

        airport: data.data.airportCode,
        datetime: data.data.reportDateTime,
        VPP: data.data.runwayDto.runwayDesignation,
        temperature: data.data.ambientTemperature,
        initials: data.data.initialName,
        position: data.data.position,
      };

      // situationalNotifications -> form2
      const notifs = data.data.situationalNotifications || [];

      const form2: Form2Values = {
        notificationType: notifs.map((n) => n.notificationType),
        additionalDetails: "",
        notification_details: {},
        runwayLengthReductionM:
          data.data.situationalNotifications.find(
            (i) => i.notificationType == NotificationType.REDUCED_RUNWAY_LENGTH,
          )?.runwayLengthReductionM ?? "Нет данных",
      };

      if (!form2.notification_details) {
        return;
      }
      for (const notif of notifs) {
        form2.notification_details[notif.notificationType] = String(
          notif.runwayLengthReductionM ?? notif.additionalDetails ?? "",
        );
      }

      // procedures -> form3
      const firstProc = data.data.improvementProcedures;

      const form3: Form3Values = {
        "device-of-implementation": Number(data.data?.deviceDto?.id) ?? null,
        improvementProcedure: data.data.improvementProcedures
          .filter((i) => i.procedureType != ProcedureType.CHEMICAL_TREATMENT)
          .map((i) => i.procedureType),
        details: {
          chemicalType: "HARD",
          coefficient1: data.data.runwayThirds[0]?.frictionCoefficient,
          coefficient2: data.data.runwayThirds[1]?.frictionCoefficient,
          coefficient3: data.data.runwayThirds[2]?.frictionCoefficient,
        },
        RCR: data.data.finalRCR,
        RCRru: data.data.finalRCRru,
        applicationTime:
          data.data.improvementProcedures?.[0]?.applicationTime ?? null,
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
        },
      });

      // Перейти сразу на последний шаг (4)
      setCurrentStep(3);
    }
  }, [RunwayConditionDataById.data, isCreateMode]);

  const isLoadingData = !isCreateMode && RunwayConditionDataById.isLoading;

  if (isLoadingData) {
    return (
      <div className="flex min-h-[500px] min-w-[1000px] flex-col items-center justify-center gap-5 p-8">
        {/* <Spin size="large" /> */}
        <Loading></Loading>
        <p className="text-lg">Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div>
      <Modal
        centered
        width={1000}
        closeIcon={null}
        title={
          <div className="flex min-w-52 items-center justify-between pr-2">
            <p>RCR успешно создан</p>{" "}
            <Radio.Group
              buttonStyle="solid"
              value={finalRCRModalIsEnglish == true ? "ENG" : "RU"}
              onChange={(e) => {
                setFinalRCRModalIsEnglish(e.target.value === "ENG");
              }}
            >
              <Radio.Button value={"RU"}>RU</Radio.Button>
              <Radio.Button value={"ENG"}>ENG</Radio.Button>
            </Radio.Group>
          </div>
        }
        maskClosable={false}
        footer={null}
        open={FinalRCRModalOpen}
        onOk={() => { }}
        onCancel={() => {
          setFinalRCRModalOpen(false);
          toast.success("Runway condition created successfully!");
          router.push("/");
        }}
      >
        <div className="flex justify-center">
          <div className="flex flex-col gap-6 py-6 text-2xl">
            {finalRCRModalIsEnglish ? (
              <div>
                <p style={{ whiteSpace: "pre-line" }}>{CreateResponse?.data.finalRCR}</p>
              </div>
            ) : (
              <div>
                <p style={{ whiteSpace: "pre-line" }}>{CreateResponse?.data.finalRCRru}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full items-center justify-start gap-4">
          <Button
            onClick={() => {
              setFinalRCRModalOpen(false);
            }}
          >
            Назад
          </Button>
          <Button type="primary">Отправить</Button>
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
        initialValues={{}}
        className=""
      >
        {steps[currentStep].content}
        <Form.Item>
          <div className="mt-4 flex justify-between">
            {!isCreateMode ||
              (currentStep > 0 && (
                <Button disabled={!isCreateMode} onClick={prev} size="large">
                  Назад
                </Button>
              ))}
            <div className="ml-auto flex gap-2">
              {!isCreateMode ||
                (currentStep === steps.length - 1 && (
                  <Button
                    type="primary"
                    loading={isPending}
                    htmlType="submit"
                    size="large"
                    disabled={!isCreateMode}
                  >
                    {isPending ? "Создание..." : "Создать RCR"}
                  </Button>
                ))}
              {/* For future steps, show Next button */}
              {currentStep < steps.length - 1 && (
                <Button
                  type="primary"
                  disabled={!isCreateMode}
                  onClick={next}
                  size="large"
                >
                  Далее
                </Button>
              )}
            </div>
          </div>
          {/* {isSuccess && (
            <div className="mt-2 text-green-600">
              Runway condition created successfully!
            </div>
          )} */}
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
