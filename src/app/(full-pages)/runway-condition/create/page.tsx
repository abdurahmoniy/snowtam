"use client";

import { RunwayConditionCreateRequest } from "@/types/runway-condition";
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

  const AlertTypesData = useQuery({
    queryFn: () => GetAlertTypes(),
    queryKey: ["alert-types"],
  });

  const ProcedureTypesData = useQuery({
    queryFn: () => GetProcedureTypes(),
    queryKey: ["procedure-types"],
  });

  const steps = [
    {
      title: "Runway Thirds",
      content: <NewRunWay3 />,
    },
    {
      title: "Situational Notifications",
      content: (
        <div>
          <h1 className="mb-4 text-lg font-semibold">
            Ситуационной осведомленности.
          </h1>
          <Form.List name="situationalNotifications">
            {(fields, { add, remove }) => (
              <div>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item name={[0, "notificationType"]}>
                      <Checkbox.Group>
                        <Row gutter={[0, 8]}>
                          <Col span={24}>
                            <Checkbox value="Уменьшенная длина ВПП LDA">
                              <div className="flex items-center text-lg">
                                Уменьшенная длина ВПП LDA
                                <Form.Item name={[0, "runwayLengthReductionM"]} className="inline-block ml-2 mb-0">
                                  <Input size="small" style={{ width: 80 }} suffix="m" />
                                </Form.Item>
                              </div>
                            </Checkbox>
                          </Col>
                          <Col span={24}>
                            <Checkbox value="Снежная позёмка на ВПП">
                              <div className="flex items-center text-lg">
                                Снежная позёмка на ВПП
                              </div>
                            </Checkbox>
                          </Col>
                          <Col span={24}>
                            <Checkbox value="Песок на ВПП">
                              <div className="flex items-center text-lg">
                                Песок на ВПП
                              </div>
                            </Checkbox>
                          </Col>
                          <Col span={24}>
                            <Checkbox value="Сугробы на ВПП">
                              <div className="flex items-center text-lg">
                                Сугробы на ВПП Л от оси ВПП
                                <Form.Item name={[0, "snowdriftLeftDistance"]} className="inline-block ml-1 mb-0">
                                  <Input size="small" style={{ width: 60 }} suffix="м" />
                                </Form.Item>
                                / П от оси ВПП
                                <Form.Item name={[0, "snowdriftRightDistance"]} className="inline-block ml-1 mb-0">
                                  <Input size="small" style={{ width: 60 }} suffix="м" />
                                </Form.Item>
                              </div>
                            </Checkbox>
                          </Col>
                          <Col span={24}>
                            <Checkbox value="Сугробы на РД">
                              <div className="flex items-center text-lg">
                                Сугробы на РД Л от оси ВПП
                                <Form.Item name={[0, "taxiwaySnowdriftLeftDistance"]} className="inline-block ml-1 mb-0">
                                  <Input size="small" style={{ width: 60 }} suffix="м" />
                                </Form.Item>
                                /П от оси ВПП
                                <Form.Item name={[0, "taxiwaySnowdriftRightDistance"]} className="inline-block ml-1 mb-0">
                                  <Input size="small" style={{ width: 60 }} suffix="м" />
                                </Form.Item>
                              </div>
                            </Checkbox>
                          </Col>
                        </Row>
                      </Checkbox.Group>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={[0, "notificationType"]}>
                      <Checkbox.Group>
                        <Row gutter={[0, 8]}>
                          <Col span={24}>
                            <Checkbox value="Сугробы вблизи ВПП">
                              <div className="flex items-center  text-lg">
                                Сугробы вблизи ВПП
                              </div>
                            </Checkbox>
                          </Col>
                          <Col span={24}>
                            <Checkbox value="РД Плохое">
                              <div className="flex items-center text-lg">
                                РД
                                <Form.Item name={[0, "taxiwayNumber"]} className="inline-block ml-1 mb-0">
                                  <Input size="small" style={{ width: 60 }} />
                                </Form.Item>
                                Плохое
                              </div>
                            </Checkbox>
                          </Col>
                          <Col span={24}>
                            <Checkbox value="Перрон Плохое">
                              <div className="flex items-center text-lg">
                                Перрон
                                <Form.Item name={[0, "apronNumber"]} className="inline-block ml-1 mb-0">
                                  <Input size="small" style={{ width: 60 }} />
                                </Form.Item>
                                Плохое
                              </div>
                            </Checkbox>
                          </Col>
                          <Col span={24}>
                            <Checkbox value="Другое">
                              <div className="flex items-center text-lg">
                                Другое
                              </div>
                            </Checkbox>
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
      title: "Improvement Procedures",
      content: (
        <div>
          <div className="mb-4 flex items-center gap-20">
            <h1 className="mb-4 text-lg font-semibold">
              Какие процедуры по улучшению состояния ВПП были применены{" "}
            </h1>
            <h2 className="mb-4 flex items-center gap-2 text-lg">Время применения,<DatePicker placeholder="Выберите дату" showTime /></h2>
            <h2 className="mb-4 flex items-center gap-2">
              <Select
                className=""
                placeholder="Выберите устройство"
                options={[
                  { label: 'A. SNOWBANK ON APRON' },
                  { label: 'B.' },
                  { label: 'C.' },
                  { label: 'D.' },
                ]}
              />
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
      title: "Review",
      content: <ReviewStep values={formValues} />,
    },
  ];

  const next = async () => {
    try {
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error("Validation failed:", error);
      // Form validation errors will be displayed automatically by Ant Design
    }
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
                Previous
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
                  Next
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
