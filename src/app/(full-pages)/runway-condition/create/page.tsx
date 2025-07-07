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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GetAlertTypes, GetProcedureTypes } from "../../../../services/enums";
import NewRunWay3 from "../_components/NewRunWay3";
import { useCreateRunwayCondition } from "./fetch";
import ReviewStep from "./steps/ReviewStep";


const checkboxesLeft: {
  label: string;
  value: string;
  field?: keyof SituationalNotification;
  suffix?: string;
  subFields?: any[]
}[] = [
    {
      label: "Уменьшенная длина ВПП LDA",
      value: "Уменьшенная длина ВПП LDA",
      field: "runwayLengthReduction",
      suffix: "м",
    },
    {
      label: "Снежная позёмка на ВПП",
      value: "Снежная позёмка на ВПП",
    },
    {
      label: "Песок на ВПП",
      value: "Песок на ВПП",
    },
    {
      label: "Сугробы на ВПП",
      value: "Сугробы на ВПП",
      subFields: [
        { field: "snowdriftLeftDistance", suffix: "м", label: "Л от оси ВПП" },
        { field: "snowdriftRightDistance", suffix: "м", label: "П от оси ВПП" },
      ],
    },
    {
      label: "Сугробы на РД",
      value: "Сугробы на РД",
      subFields: [
        { field: "taxiwaySnowdriftLeftDistance", suffix: "м", label: "Л от оси ВПП" },
        { field: "taxiwaySnowdriftRightDistance", suffix: "м", label: "П от оси ВПП" },
      ],
    },
  ];



const checkboxesRight = [
  {
    label: "Сугробы вблизи ВПП",
    value: "Сугробы вблизи ВПП",
  },
  {
    label: "РД Плохое",
    value: "РД Плохое",
    field: "taxiwayNumber",
  },
  {
    label: "Перрон Плохое",
    value: "Перрон Плохое",
    field: "apronNumber",

  },
  {
    label: "Другое",
    value: "Другое",
    field: "other",
  },
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


  const [FormValuesState, setFormValuesState] = useState({
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
      "surfaceCondition3": null
    },
    form2: {
      "notificationType": [
        // "Другое",
        // "Уменьшенная длина ВПП LDA",
        // "Снежная позёмка на ВПП",
        // "Песок на ВПП",
        // "Сугробы на ВПП",
        // "Сугробы на РД",
        // "Перрон Плохое",
        // "РД Плохое",
        // "Сугробы вблизи ВПП"
      ],
      "snowdriftLeftDistance": null,
      "snowdriftRightDistance": null,
      "taxiwaySnowdriftLeftDistance": null,
      "taxiwaySnowdriftRightDistance": null,
      "runwayLengthReduction": null,
      "other": null,
      "apronNumber": null,
      "taxiwayNumber": null
    },
    form3: {
      "date-of-implementation": null,
      "device-of-implementation": null,
      "improvementProcedure": [
        {
          "procedureType": [
            // "Хим. обработка",
            // "Песок",
            // "Щеточ",
            // "Предув",
            // "Жидкая"
          ],
          "chemicalType": null, // "Твердая"
        }
      ]
    }
  });

  console.log(form.getFieldsValue(), "getFieldsValue");


  const AlertTypesData = useQuery({
    queryFn: () => GetAlertTypes(),
    queryKey: ["alert-types"],
  });

  const ProcedureTypesData = useQuery({
    queryFn: () => GetProcedureTypes(),
    queryKey: ["procedure-types"],
  });


  console.log(FormValuesState, "FormValuesState");
  

  const customNumberValidator = (_: any, value: any) => {
    if (value === undefined || value > 0) return Promise.resolve();
    return Promise.reject("Значение должно быть больше 0");
  };

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
          <Form.List name="situationalNotifications">
            {(fields, { add, remove }) => (
              <div>
                <Form.Item name={[0, "notificationType"]}>
                  <Checkbox.Group<string> value={checkedFields} onChange={(value) => setCheckedFields((value))} style={{ width: "100%" }}>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Row gutter={[0, 8]}>
                          {checkboxesLeft.map((item, idx) => (
                            <Col span={24} key={idx}>
                              <Checkbox checked={checkedFields.includes(item.value)} value={item.value}>
                                <div className="flex items-center text-lg">
                                  {item.label}
                                  {item.field && item.field != undefined && (
                                    <Form.Item
                                      name={[0, item.field]}
                                      className="inline-block ml-2 mb-0"
                                      rules={checkedFields.includes(item.value) ? [
                                        { required: true, message: "Обязательное поле" },
                                        { validator: customNumberValidator },
                                      ] : []}
                                    >
                                      <Input

                                        // onChange={(e) => {
                                        //   setCheckedFields([...checkedFields, item.value]);
                                        //   form.setFieldValue(["situationalNotification", item.field, "runwayLengthReduction"], e.target.value);
                                        // }} 

                                        // onChange={(e) => {
                                        //   if (e.target.value.trim() != "") {
                                        //     setCheckedFields([...checkedFields, item.value]);
                                        //   }
                                        // }} 

                                        size="small" style={{ width: 80 }} suffix={item.suffix || ""} />
                                    </Form.Item>
                                  )}
                                  {item.subFields &&

                                    item.subFields.map((sf, subIdx) => (
                                      <span key={subIdx} className="ml-2">
                                        {sf.label}
                                        <Form.Item
                                          name={[0, sf.field]}
                                          className="inline-block ml-1 mb-0"
                                          rules={checkedFields.includes(item.value) ? [
                                            { required: true, message: "Обязательное поле" },
                                            { validator: customNumberValidator },
                                          ] : []}
                                        >
                                          <Input
                                            //  onChange={(e) => {
                                            //   if (e.target.value.trim() != "") {
                                            //     setCheckedFields([...checkedFields, item.value]);
                                            //   }
                                            // }} 
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
                        {/* <Checkbox.Group<string> value={checkedFields} onChange={setCheckedFields} style={{ width: "100%" }}> */}
                        <Row gutter={[0, 8]}>
                          {checkboxesRight.map((item, idx) => (
                            <Col span={24} key={idx}>
                              <Checkbox value={item.value}>
                                {/* <div className="flex items-center text-lg">
                                  {item.label}
                                  {item.field && checkedFields.includes(item.value) && (
                                    <Form.Item
                                      name={[0, item.field]}
                                      className="inline-block ml-2 mb-0"
                                      rules={[
                                        { required: true, message: "Обязательное поле" },
                                        { validator: customNumberValidator },
                                      ]}
                                    >
                                      <Input onChange={(e) => {
                                        if (e.target.value.trim() != "") {
                                          setCheckedFields([...checkedFields, item.value]);
                                        }
                                      }} size="small" style={{ width: 80 }} />
                                    </Form.Item>
                                  )}
                                  
                                </div> */}
                                <div className="flex items-center text-lg gap-1">
                                  {/* До инпута — часть до пробела */}
                                  <span>{item.label.split(" ")[0]}</span>

                                  {item.field && checkedFields.includes(item.value) && (
                                    <Form.Item
                                      name={[0, item.field]}
                                      className="inline-block mb-0"
                                      rules={[
                                        { required: true, message: "Обязательное поле" },
                                        { validator: customNumberValidator },
                                      ]}
                                    >
                                      <Input
                                        size="small"
                                        style={{ width: 80 }}
                                        onChange={(e) => {
                                          if (e.target.value.trim() !== "") {
                                            setCheckedFields((prev) =>
                                              prev.includes(item.value) ? prev : [...prev, item.value]
                                            );
                                          }
                                        }}
                                      />
                                    </Form.Item>
                                  )}

                                  {/* После инпута — всё, кроме первой части */}
                                  <span>{item.label.split(" ").slice(1).join(" ")}</span>
                                </div>
                              </Checkbox>
                            </Col>
                          ))}
                        </Row>
                        {/* </Checkbox.Group> */}
                      </Col>
                    </Row>
                  </Checkbox.Group>

                </Form.Item>

              </div>
            )}
          </Form.List>
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
            <h2 className="mb-4 flex  gap-2 text-lg">Время применения: <Form.Item className="mb-0" name={"date-of-implementation"} rules={[{ required: true, message: "Обязательное поле" }]}><DatePicker placeholder="Выберите дату" showTime /></Form.Item></h2>
            <h2 className="mb-4 flex  gap-2">
              <Form.Item name={"device-of-implementation"} className="mb-0" rules={[{ required: true, message: "Обязательное поле" }]}>
                <Select
                  className=""
                  placeholder="Выберите устройство"
                  options={[
                    { label: 'A. SNOWBANK ON APRON', value: "A" },
                    { label: 'B.', value: "B" },
                    { label: 'C.', value: "C" },
                    { label: 'D.', value: "D" },
                  ]}
                />

              </Form.Item>
            </h2>
          </div>

          <Form.List name="improvementProcedure">
            {(fields, { add, remove }) => (
              <div>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item name={[0, "procedureType"]}>
                      <Checkbox.Group
                        onChange={(checkedValues) => {
                          const currentValues = form.getFieldValue(
                            "improvementProcedure",
                          ) || [{}];

                          // Update state for chemical treatment
                          setChemicalTreatmentChecked(checkedValues.includes("Хим. обработка"));

                          // If "Хим. обработка" is checked and "Жидкая" isn't already checked
                          if (
                            checkedValues.includes("Хим. обработка") &&
                            !checkedValues.includes("Жидкая")
                          ) {
                            form.setFieldsValue({
                              improvementProcedure: [
                                {
                                  ...currentValues[0],
                                  procedureType: [...checkedValues, "Жидкая"],
                                },
                              ],
                            });
                          } else {
                            form.setFieldsValue({
                              improvementProcedure: [
                                {
                                  ...currentValues[0],
                                  procedureType: checkedValues,
                                },
                              ],
                            });
                          }
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
                                    <Radio.Group className="flex flex-col text-lg">
                                      <Radio value="Жидкая" className=" text-lg">Жидкая</Radio>
                                      <Radio value="Твердая" className=" text-lg">Твердая</Radio>
                                    </Radio.Group>
                                  </Form.Item>
                                </div>
                              </Col>
                            </>
                          )}
                          <Col span={24}>
                            <Checkbox value="Песок" className=" text-lg">Песок</Checkbox>
                          </Col>
                          <Col span={24}>
                            <Checkbox value="Щеточ" className=" text-lg">Щеточ</Checkbox>
                          </Col>
                          <Col span={24}>
                            <Checkbox value="Предув" className=" text-lg">Предув</Checkbox>
                          </Col>
                        </Row>
                      </Checkbox.Group>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            )}
          </Form.List>
        </div>
      ),
    },
    {
      title: "Общие сведения",
      content: <ReviewStep values={formValues} />,
    },
  ];

  const next = async () => {
    form.validateFields().then((value) => {
      console.log(value, "next-value");
      setFormValuesState({
        ...FormValuesState,
        [`form${currentStep+1}`]: value,
      });

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

  const handleFinish = async (values: any) => {
    try {
      const allFormValues = form.getFieldsValue(true);
      const formData = allFormValues || values;
      const processedValues = {
        ...formData,

      };

      console.log("Final processed payload:", processedValues);
      mutate(processedValues);
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



  return (
    <div>
      {/* <div className="text-2xl mb-4">Create new runway condition</div> */}
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
              <Button onClick={prev} size="large">
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
                >
                  {isPending ? "Submitting..." : "Create"}
                </Button>
              )}
              {/* For future steps, show Next button */}
              {currentStep < steps.length - 1 && (
                <Button type="primary" onClick={next} size="large">
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
