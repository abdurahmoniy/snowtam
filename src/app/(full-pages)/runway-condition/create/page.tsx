"use client";

import { RunwayConditionCreateRequest } from "@/types/runway-condition";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  RadioChangeEvent,
  Row,
  Select,
  Steps,
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
                              Уменьшенная длина ВПП LDA..................m
                            </Checkbox>
                          </Col>
                          <Col span={24}>
                            <Checkbox value="Снежная позёмка на ВПП">
                              Снежная позёмка на ВПП
                            </Checkbox>
                          </Col>
                          <Col span={24}>
                            <Checkbox value="Песок на ВПП">
                              Песок на ВПП
                            </Checkbox>
                          </Col>
                          <Col span={24}>
                            <Checkbox value="Сугробы на ВПП">
                              Сугробы на ВПП Л от оси ВПП....м / П от оси
                              ВПП....м
                            </Checkbox>
                          </Col>
                          <Col span={24}>
                            <Checkbox value="Сугробы на РД">
                              Сугробы на РД Л от оси ВПП....м/П от оси ВПП....м
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
                              Сугробы вблизи ВПП
                            </Checkbox>
                          </Col>
                          <Col span={24}>
                            <Checkbox value="РД Плохое">
                              РД.......Плохое
                            </Checkbox>
                          </Col>
                          <Col span={24}>
                            <Checkbox value="Перрон Плохое">
                              Перрон.....Плохое
                            </Checkbox>
                          </Col>
                          <Col span={24}>
                            <Checkbox value="Другое">Другое</Checkbox>
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
            <h2 className="mb-4">Время применения,_____</h2>
          </div>

          <Form.List name="improvementProcedures">
            {(fields, { add, remove }) => (
              <div>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item name={[0, "procedureType"]}>
                      <Checkbox.Group
                        onChange={(checkedValues) => {
                          const currentValues = form.getFieldValue(
                            "improvementProcedures",
                          ) || [{}];
                          // If "Хим. обработка" is checked and "Жидкая" isn't already checked
                          if (
                            checkedValues.includes("Хим. обработка") &&
                            !checkedValues.includes("Жидкая")
                          ) {
                            form.setFieldsValue({
                              improvementProcedures: [
                                {
                                  ...currentValues[0],
                                  procedureType: [...checkedValues, "Жидкая"],
                                },
                              ],
                            });
                          } else {
                            form.setFieldsValue({
                              improvementProcedures: [
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
                            <Checkbox value="Хим. обработка">
                              Хим. обработка
                            </Checkbox>
                          </Col>
                          <Col span={24}>
                            <Checkbox value="Жидкая">Жидкая</Checkbox>
                          </Col>
                          <Col span={24}>
                            <Checkbox value="Твердая">Твердая</Checkbox>
                          </Col>
                          <Col span={24}>
                            <Checkbox value="Песок">Песок</Checkbox>
                          </Col>
                          <Col span={24}>
                            <Checkbox value="Щеточ">Щеточ</Checkbox>
                          </Col>
                        </Row>
                      </Checkbox.Group>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={[0, "procedureType"]}>
                      <Checkbox.Group>
                        <Row gutter={[0, 8]}>
                          <Col span={24}>
                            <Checkbox value="Песок">Песок</Checkbox>
                          </Col>
                          <Col span={24}>
                            <Checkbox value="Щеточ">Щеточ</Checkbox>
                          </Col>
                          <Col span={24}>
                            <Checkbox value="Предув">Предув</Checkbox>
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
      // Validate current step before proceeding
      if (currentStep === 0) {
        // Validate Runway Condition Info step
        await form.validateFields([
          "airportCode",
          "runwayDesignation",
          "reportDateTime",
          "ambientTemperature",
          "initials",
          "rwycCode",
          "overallConditionCode",
        ]);
      } else if (currentStep === 1) {
        // Validate Runway Thirds step
        const runwayThirds = form.getFieldValue("runwayThirds") || [];
        if (runwayThirds.length === 0) {
          throw new Error("At least one runway third is required");
        }

        // Check if at least one runway third has all required fields
        let hasValidThird = false;
        for (let i = 0; i < runwayThirds.length; i++) {
          const third = runwayThirds[i];
          if (
            third &&
            third.partNumber &&
            third.contaminationCoverage &&
            third.surfaceCondition &&
            third.depthMm !== null &&
            third.depthMm !== undefined &&
            third.frictionCoefficient !== null &&
            third.frictionCoefficient !== undefined &&
            third.rwycValue !== null &&
            third.rwycValue !== undefined &&
            third.temperatureCelsius !== null &&
            third.temperatureCelsius !== undefined
          ) {
            hasValidThird = true;
            break;
          }
        }

        if (!hasValidThird) {
          throw new Error(
            "At least one runway third must have all required fields filled",
          );
        }

        // Validate all filled runway thirds
        for (let i = 0; i < runwayThirds.length; i++) {
          const third = runwayThirds[i];
          if (third && third.partNumber) {
            // Only validate if third exists and has partNumber
            await form.validateFields([
              ["runwayThirds", i, "partNumber"],
              ["runwayThirds", i, "contaminationCoverage"],
              ["runwayThirds", i, "surfaceCondition"],
              ["runwayThirds", i, "depthMm"],
              ["runwayThirds", i, "frictionCoefficient"],
              ["runwayThirds", i, "rwycValue"],
              ["runwayThirds", i, "temperatureCelsius"],
            ]);
          }
        }
      } else if (currentStep === 2) {
        // Validate Situational Notifications step
        const notifications =
          form.getFieldValue("situationalNotifications") || [];
        for (let i = 0; i < notifications.length; i++) {
          await form.validateFields([
            ["situationalNotifications", i, "notificationType"],
            ["situationalNotifications", i, "runwayLengthReductionM"],
          ]);
        }
      } else if (currentStep === 3) {
        // Validate Improvement Procedures step
        const procedures = form.getFieldValue("improvementProcedures") || [];
        for (let i = 0; i < procedures.length; i++) {
          await form.validateFields([
            ["improvementProcedures", i, "procedureType"],
            ["improvementProcedures", i, "applicationTime"],
            ["improvementProcedures", i, "effectivenessRating"],
          ]);
        }
      }

      // If validation passes, proceed to next step
      if (currentStep === steps.length - 2) {
        setFormValues(form.getFieldsValue(true));
      }
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
    console.log("handleFinish called with values:", values);

    try {
      // Get all form values including nested arrays
      const allFormValues = form.getFieldsValue(true);
      console.log(
        "All form values from form.getFieldsValue(true):",
        allFormValues,
      );

      // Use the complete form values instead of just the passed values
      const formData = allFormValues || values;
      console.log("Form data to process:", formData);

      // Process dates and convert to ISO strings
      const processedValues = {
        ...formData,
        reportDateTime:
          formData.reportDateTime?.toISOString?.() || new Date().toISOString(),
        ambientTemperature: Number(formData.ambientTemperature) || 0,
        overallConditionCode: Number(formData.overallConditionCode) || 0,
        runwayThirds: (formData.runwayThirds || []).map((third: any) => ({
          ...third,
          partNumber: Number(third.partNumber) || 0,
          depthMm: Number(third.depthMm) || 0,
          frictionCoefficient: Number(third.frictionCoefficient) || 0,
          rwycValue: Number(third.rwycValue) || 0,
          temperatureCelsius: Number(third.temperatureCelsius) || 0,
        })),
        situationalNotifications: (formData.situationalNotifications || []).map(
          (notification: any) => ({
            ...notification,
            runwayLengthReductionM:
              Number(notification.runwayLengthReductionM) || 0,
          }),
        ),
        improvementProcedures: (formData.improvementProcedures || []).map(
          (procedure: any) => ({
            ...procedure,
            applicationTime:
              procedure.applicationTime?.toISOString?.() ||
              new Date().toISOString(),
            effectivenessRating: Number(procedure.effectivenessRating) || 0,
          }),
        ),
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
          airportCode: "",
          runwayDesignation: "",
          reportDateTime: "",
          ambientTemperature: null,
          initials: "",
          rwycCode: "",
          overallConditionCode: null,
          remarks: "",
          runwayThirds: [
            {
              partNumber: 1,
              contaminationCoverage: "LESS_THAN_10_PERCENT",
              surfaceCondition: "DRY",
              depthMm: 0,
              frictionCoefficient: 1,
              rwycValue: 6,
              temperatureCelsius: 0,
            },
          ],
          situationalNotifications: [
            {
              notificationType: null,
              runwayLengthReductionM: 0,
              additionalDetails: "",
            },
          ],
          improvementProcedures: [
            {
              procedureType: null,
              applicationTime: "",
              effectivenessRating: 0,
            },
          ],
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
