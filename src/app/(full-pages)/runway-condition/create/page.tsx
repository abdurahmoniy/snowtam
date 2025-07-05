"use client";

import { RunwayConditionCreateRequest } from "@/types/runway-condition";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  RadioChangeEvent,
  Row,
  Select,
  Space,
  Steps,
} from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  GetAlertTypes,
  GetProcedureTypes,
  GetSurfaceCondition,
} from "../../../../services/enums";
import { CircleDot } from "lucide-react";
import ReviewStep from "./steps/ReviewStep";
import { useCreateRunwayCondition } from "./fetch";

type RunwayConditionType = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type CoveragePercentage = 25 | 50 | 75 | 100;

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
  const [coverageType, setCoverageType] = useState(1);
  const [thirds, setThirds] = useState<{
    values: (RunwayConditionType | null)[];
    coverages: (CoveragePercentage | null)[];
  }>({
    values: [null, null, null],
    coverages: [null, null, null],
  });

  const { data: surfaceConditionsData } = useQuery({
    queryFn: () => GetSurfaceCondition(),
    queryKey: ["surface-conditions"],
  });

  const handleThirdValueChange = (
    index: number,
    value: RunwayConditionType,
  ) => {
    setThirds((prev) => ({
      ...prev,
      values: prev.values.map((v, i) => (i === index ? value : v)),
    }));

    // Update form values
    const runwayThirds = form.getFieldValue("runwayThirds") || [];
    if (runwayThirds[index]) {
      runwayThirds[index].rwycValue = value;
      form.setFieldsValue({ runwayThirds });
    }
  };

  const handleThirdCoverageChange = (
    index: number,
    coverage: CoveragePercentage,
  ) => {
    setThirds((prev) => ({
      ...prev,
      coverages: prev.coverages.map((c, i) => (i === index ? coverage : c)),
    }));

    // Update form values
    const runwayThirds = form.getFieldValue("runwayThirds") || [];
    if (runwayThirds[index]) {
      runwayThirds[index].contaminationCoverage = coverage;
      form.setFieldsValue({ runwayThirds });
    }
  };

  const RunwayThirdSection = () => (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex flex-col items-center gap-4">
        <div>Оцените % покрытия загрязнения ВПП для каждой трети ВПП</div>
        <div className="flex gap-2">
          {[
            {
              value: 0,
              label: "< 10% покрытие",
              color: "text-green-500",
              description:
                "RWYCC – 6 для данной трети не сообщается о загрязнении",
            },
            {
              value: 1,
              label: "≥ 10% - ≤ 25% покрытие",
              color: "text-red-500",
              description:
                "RWYCC – 6 для данной трети Сообщите о загрязнении с 25% зоной покрытия",
            },
            {
              value: 2,
              label: "> 25% покрытие",
              color: "text-green-500",
              description:
                "Присвоить RWYCC на основе присутствия загрязняющих веществ и температуры",
            },
          ].map((option) => (
            <div
              key={option.value}
              onClick={() => setCoverageType(option.value)}
              className={`rounded-md border ${coverageType === option.value && "border-[#3C50E0]"} flex max-w-[400px] cursor-pointer flex-col gap-2 p-2`}
            >
              <div className="flex items-center gap-2">
                <CircleDot
                  color={coverageType === option.value ? `#3C50E0` : "#fff"}
                />
                <div className={option.color}>{option.label}</div>
              </div>
              <div>{option.description}</div>
            </div>
          ))}
        </div>
        <div>
          <span className="text-red-500">Прим: </span>
          Отчет RCR не требуется, когда зона покрытия трети ВПП {"<10%"} (за
          исключением, когда выпускается донесение о чистой ВПП)
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map((thirdNumber, index) => (
          <div
            key={thirdNumber}
            className="rounded-md border border-primary p-2"
          >
            <div className="flex flex-col items-center justify-center pt-2">
              <div className="text-lg font-semibold">{`${thirdNumber} треть ВПП`}</div>
              <div className="text-sm">
                Для зоны покрытия 25 % или меньше записывайте код 6
              </div>
            </div>

            <Divider />

            <div className="">
              <p>
                - Определите превышает ли загрязнение 25% покрытий трети ВПП
              </p>
              <p>- Определите % покрытия</p>
              <p>- Определите глубину (если применимо)</p>
              <p>- Определите код состояния ВПП RWYCC</p>
              <p>- Впишите в квадрат справа код состояния ВПП</p>
            </div>

            <Divider />

            <div className="flex gap-2">
              <div className="flex flex-col items-center">
                <Input
                  value={thirds.values[index] ?? ""}
                  size="large"
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if ([0, 1, 2, 3, 4, 5, 6].includes(v)) {
                      handleThirdValueChange(index, v as RunwayConditionType);
                    }
                  }}
                  className="w-[80px]"
                />
                <div className="">RWYCC</div>
              </div>

              <Select
                size="large"
                value={
                  thirds.values[index] === 6 ? 100 : thirds.coverages[index]
                }
                placeholder="Процент"
                disabled={thirds.values[index] === 6}
                onSelect={(val) =>
                  handleThirdCoverageChange(index, val as CoveragePercentage)
                }
                options={[
                  { value: 25, label: "25%" },
                  { value: 50, label: "50%" },
                  { value: 75, label: "75%" },
                  { value: 100, label: "100%" },
                ]}
              />

              <div className="">
                {thirds.values[index] !== 6 && (
                  <InputNumber size="large" placeholder="Глубина" />
                )}
              </div>

              {thirds.values[index] !== 6 && (
                <Select
                  size="large"
                  placeholder="Состояние"
                  onSelect={(val) =>
                    handleThirdCoverageChange(index, val as CoveragePercentage)
                  }
                  options={surfaceConditionsData?.data.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                />
              )}
            </div>

            <Divider />

            <Row gutter={16}>
              <Col md={14} className="border-r">
                <div className="flex w-full justify-around">
                  <div className="flex flex-col items-center gap-2">
                    <div className="">Сухая</div>
                    <div
                      className="cursor-pointer border px-4 py-2"
                      onClick={() => handleThirdValueChange(index, 6)}
                    >
                      6
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="">Мокрая</div>
                    <div
                      className="cursor-pointer border px-4 py-2"
                      onClick={() => handleThirdValueChange(index, 5)}
                    >
                      5
                    </div>
                    <div className="text-xs text-gray-6">25/50/75/100</div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="">Иней</div>
                    <div
                      className="cursor-pointer border px-4 py-2"
                      onClick={() => handleThirdValueChange(index, 5)}
                    >
                      5
                    </div>
                    <div className="text-xs text-gray-6">25/50/75/100</div>
                  </div>
                </div>
              </Col>
              <Col md={10}>
                <div className="flex">
                  <div className="">
                    Иней
                    <div className="text-xs text-gray-6">
                      {"(ниже установленного минимального уровня сцепления)"}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="cursor-pointer border px-4 py-2"
                      onClick={() => handleThirdValueChange(index, 3)}
                    >
                      3
                    </div>
                    <div className="text-xs text-gray-6">25/50/75/100</div>
                  </div>
                </div>
              </Col>
            </Row>

            <Divider />

            <Row gutter={16}>
              <Col md={8} className="border-r">
                <div className="text-lg font-semibold">Стоячая вода</div>
                <div className="flex">
                  <div className="flex flex-col items-center gap-2">
                    <div className="">Слякоть</div>
                    <div
                      className="cursor-pointer border px-4 py-2"
                      onClick={() => handleThirdValueChange(index, 2)}
                    >
                      2
                    </div>
                    <div className="">{" > 3 мм"}</div>
                    <div className="text-xs text-gray-6">25/50/75/100</div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="">Слякоть</div>
                    <div
                      className="cursor-pointer border px-4 py-2"
                      onClick={() => handleThirdValueChange(index, 5)}
                    >
                      5
                    </div>
                    <div className="">{" 3мм или < "}</div>
                    <div className="text-xs text-gray-6">25/50/75/100</div>
                  </div>
                </div>
              </Col>
              <Col md={8} className="border-r">
                <div className="text-lg font-semibold">
                  Мокрий снег или Сухой снег
                </div>
                <div className="flex">
                  <div className="flex flex-col items-center gap-2">
                    <div className="">Слякоть</div>
                    <div
                      className="cursor-pointer border px-4 py-2"
                      onClick={() => handleThirdValueChange(index, 3)}
                    >
                      3
                    </div>
                    <div className="">{" > 3 мм"}</div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="">Слякоть</div>
                    <div
                      className="cursor-pointer border px-4 py-2"
                      onClick={() => handleThirdValueChange(index, 5)}
                    >
                      5
                    </div>
                    <div className="">{" 3мм или < "}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-6">25/50/75/100</div>
              </Col>
              <Col md={8}>
                <div className="text-lg font-semibold">
                  Сухой/мокрий снег на уплот. снегу
                </div>
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="cursor-pointer border px-4 py-2"
                      onClick={() => handleThirdValueChange(index, 3)}
                    >
                      3
                    </div>
                    <div className="text-xs text-gray-6">25/50/75/100</div>
                  </div>
                </div>
              </Col>
            </Row>

            <div className="mt-2 flex gap-2">
              <div className="text-lg font-semibold">Глубина:</div>
              <div className="cursor-pointer border px-2">3 мм или менеее</div>
              <div className="cursor-pointer border px-2">
                Оцененная глубина {"(мм)"}
              </div>
            </div>
            <div className="text-xs text-gray-6">
              Отмечайте глубину только для: Стоячей воды, Слякоти, Мокрого или
              Сухого снега, любого снега на поверхности утрамбованного снега
            </div>

            <Divider />

            <div className="flex items-end justify-between">
              <div className="flex flex-col gap-2">
                <div className="">-15°C или ниже</div>
                <div className="flex items-center gap-2">
                  <div className="text-gray-6">25/50/75/100</div>
                  <div
                    className="cursor-pointer border px-4 py-2"
                    onClick={() => handleThirdValueChange(index, 4)}
                  >
                    4
                  </div>
                </div>
              </div>
              <div className="font-semibold">Уплетненный снег</div>
              <div className="flex flex-col gap-2">
                <div className="">Выше -15°C</div>
                <div className="flex items-center gap-2">
                  <div
                    className="cursor-pointer border px-4 py-2"
                    onClick={() => handleThirdValueChange(index, 3)}
                  >
                    3
                  </div>
                  <div className="text-gray-6">25/50/75/100</div>
                </div>
              </div>
            </div>

            <Divider />

            <div className="flex gap-2">
              <div className="border-r pr-2">
                <div className="flex items-center gap-2">
                  <div className="text-gray-6">25/50/75/100</div>
                  <div className="flex flex-col items-center">
                    <div className="">Лед</div>
                    <div
                      className="cursor-pointer border px-4 py-2"
                      onClick={() => handleThirdValueChange(index, 1)}
                    >
                      1
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex">
                <div className="">
                  Мокрый лед/ Вода на поверхности утрамбованного снега/ Сухой
                  снег или Мокрый снег на поверхности льда
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div
                      className="cursor-pointer border px-4 py-2"
                      onClick={() => handleThirdValueChange(index, 0)}
                    >
                      0
                    </div>
                  </div>
                  <div className="text-gray-6">25/50/75/100</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SituationalNotificationsStep = () => (
    <div>
      <h1 className="mb-6 text-xl font-bold">Ситуационной осведомленности</h1>
      <Form.Item name="situationalNotifications">
        <Checkbox.Group className="w-full grid grid-cols-2 gap-4">
          {[
            {
              value: "Уменьшенная длина ВПП LDA",
              label: "Уменьшенная длина ВПП LDA..................m",
            },
            {
              value: "Снежная позёмка на ВПП",
              label: "Снежная позёмка на ВПП",
            },
            {
              value: "Песок на ВПП",
              label: "Песок на ВПП",
            },
            {
              value: "Сугробы на ВПП",
              label: "Сугробы на ВПП Л от оси ВПП....м / П от оси ВПП....м",
            },
            {
              value: "Сугробы на РД",
              label: "Сугробы на РД Л от оси ВПП....м/П от оси ВПП....м",
            },
            {
              value: "Сугробы вблизи ВПП",
              label: "Сугробы вблизи ВПП",
            },
            {
              value: "РД Плохое",
              label: "РД.......Плохое",
            },
            {
              value: "Перрон Плохое",
              label: "Перрон.....Плохое",
            },
            {
              value: "Другое",
              label: "Другое",
            },
          ].map((item) => (
            <Checkbox
              key={item.value}
              value={item.value}
              className="text-lg h-10 flex items-center"
            >
              <span className="text-lg">{item.label}</span>
            </Checkbox>
          ))}
        </Checkbox.Group>
      </Form.Item>
    </div>
  );

  const ImprovementProceduresStep = () => (
    <div>
      <div className="mb-6 flex items-center gap-20">
        <h1 className="text-xl font-bold">
          Какие процедуры по улучшению состояния ВПП были применены
        </h1>
        <h2 className="text-lg">Время применения,_____</h2>
      </div>

      <Form.Item name="improvementProcedures">
        <Checkbox.Group
          className="w-full grid grid-cols-2 gap-4"
          onChange={(checkedValues) => {
            // "Хим. обработка" tanlansa, "Жидкая" ni avtomatik qo'shish
            if (
              checkedValues.includes("Хим. обработка") &&
              !checkedValues.includes("Жидкая")
            ) {
              form.setFieldsValue({
                improvementProcedures: [...checkedValues, "Жидкая"],
              });
            } else {
              form.setFieldsValue({
                improvementProcedures: checkedValues,
              });
            }
          }}
        >
          {[
            {
              value: "Хим. обработка",
              label: "Хим. обработка",
            },
            {
              value: "Жидкая",
              label: "Жидкая",
            },
            {
              value: "Твердая",
              label: "Твердая",
            },
            {
              value: "Песок",
              label: "Песок",
            },
            {
              value: "Щеточ",
              label: "Щеточ",
            },
            {
              value: "Предув",
              label: "Предув",
            },
          ].map((item) => (
            <Checkbox
              key={item.value}
              value={item.value}
              className="text-lg h-10 flex items-center"
            >
              <span className="text-lg">{item.label}</span>
            </Checkbox>
          ))}
        </Checkbox.Group>
      </Form.Item>
    </div>
  );



  const steps = [
    {
      title: "Runway Thirds",
      content: <RunwayThirdSection />,
    },
    {
      title: "Situational Notifications",
      content: <SituationalNotificationsStep />,
    },
    {
      title: "Improvement Procedures",
      content: <ImprovementProceduresStep />,
    },
    {
      title: "Review",
      content: <ReviewStep values={formValues} />,
    }
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
