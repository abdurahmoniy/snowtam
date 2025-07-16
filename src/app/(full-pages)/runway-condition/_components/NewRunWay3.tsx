"use client";

import { useUserMe } from "@/hooks/use-me";
import { GetSurfaceCondition } from "@/services/enums";
import { useQuery } from "@tanstack/react-query";
import { Col, Divider, Form, FormInstance, Input, InputNumber, Row, Select } from "antd";
import dayjs from "dayjs";
import { CircleDot } from "lucide-react";
import { useEffect, useState } from "react";

type RunwayConditionType = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type CoveragePercentage = 25 | 50 | 75 | 100;
type SurfaceConditionType = "DRY" | "WET" | "ICE" | "SNOW";

interface RunwayThirdProps {
  orderIndex: number;
  title: string;
  value: RunwayConditionType | null;
  coverage: CoveragePercentage | null;
  onValueChange: (value: RunwayConditionType) => void;
  onCoverageChange: (value: CoveragePercentage) => void;
  surfaceConditions: string[];
  onSurfaceConditionChange: (val: SurfaceConditionType) => void;
  depth: string;
  onDepthChange: (val: string) => void;
  formInstance: FormInstance;
}

const sostoyanie = [
  { label: "Dry / Quruq / Сухой", value: "DRY" },
  { label: "Wet / Ho'l / Мокрый", value: "WET" },
  { label: "Ice / Muz / Лед", value: "ICE" },
  // { label: "Snow / Qor / Снег", value: "SNOW" },
  { label: "Dry Snow / Quruq qor / Сухой снег", value: "DRY_SNOW" },
  { label: "Wet Snow / Nam qor / Мокрый снег", value: "MOISTURIZE_SNOW" },
  { label: "Frost / Iney / Иней", value: "HOARFROST" },
]

const RunwayThird = ({
  title,
  value,
  coverage,
  onValueChange,
  onCoverageChange,
  surfaceConditions,
  onSurfaceConditionChange,
  depth,
  onDepthChange,
  orderIndex,
  formInstance,

}: RunwayThirdProps) => {





  return (
    <div className="rounded-md border border-primary p-2 md:max-w-[650px] lg:max-w-full">
      <div className="flex justify-end ">
        <div className="border-[1px] border-[#000] h-[50px] w-[50px] justify-center items-center flex text-lg">
          {formInstance.getFieldValue(`runwayConditionType${orderIndex}`)}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center pt-2">
        <div className="text-lg font-semibold text-center">{title}</div>
        <div className="text-sm text-center">
          Для зоны покрытия 25 % или меньше записывайте код 6
        </div>
      </div>

      <Divider />

      <div className="text-base">
        <p>- Определите превышает ли загрязнение 25% покрытий трети ВПП</p>
        <p>- Определите % покрытия</p>
        <p>- Определите глубину (если применимо)</p>
        <p>- Определите код состояния ВПП RWYCC</p>
        <p>- Впишите в квадрат справа код состояния ВПП</p>
      </div>

      <Divider />

      <div className="flex flex-col gap-2 sm:flex-row flex-wrap">
        <div className="flex flex-col items-center">
          <Form.Item name={`runwayConditionType${orderIndex}`} rules={[{ required: true, message: 'Обязательное поле' }]} className="mb-0">
            <Select
              value={value}
              size="large"
              placeholder="1-6"
              onChange={(value) => {
                if (value && typeof value === 'number' && [0, 1, 2, 3, 4, 5, 6].includes(value)) {
                  onValueChange(value as RunwayConditionType);
                  if (value == 6) {
                    formInstance.setFieldsValue({
                      [`coveragePercentage${orderIndex}`]: 100,
                      [`depth${orderIndex}`]: 'N/R',
                      [`surfaceCondition${orderIndex}`]: 'DRY',
                    });

                  }
                }
              }}
              className="w-[80px]"
              options={[
                { value: 0, label: "0" },
                { value: 1, label: "1" },
                { value: 2, label: "2" },
                { value: 3, label: "3" },
                { value: 4, label: "4" },
                { value: 5, label: "5" },
                { value: 6, label: "6" },
              ]}
            />
          </Form.Item>
          <div className="">RWYCC</div>
        </div>

        <Form.Item name={`coveragePercentage${orderIndex}`} rules={[{ required: true, message: 'Обязательное поле' }]} className="min-w-[120px] mb-0" >
          <Select
            size="large"
            value={value === 6 ? 100 : coverage}
            placeholder="Процент"
            disabled={value === 6}
            onSelect={(val) => {
              onCoverageChange(val as CoveragePercentage);

            }}
            options={[
              { value: 25, label: "25%" },
              { value: 50, label: "50%" },
              { value: 75, label: "75%" },
              { value: 100, label: "100%" },
            ]}
          />
        </Form.Item>

        <div className="">
          {<Form.Item name={`depth${orderIndex}`} rules={[{ required: true, message: 'Обязательное поле' }]} className="mb-0">
            <InputNumber size="large"
              disabled={value === 6}
              value={depth === "N/R" ? undefined : Number(depth)}
              placeholder="Глубина"
              // onChange={(e) => {
              //   if (e && Number(e) >= 0) {
              //     onDepthChange(e.toString());
              //   }
              // }}
              // onBlur={(e) => {
              //   if (!e.target.value.trim()) {
              //     onDepthChange("N/R");
              //     formInstance.setFieldsValue({ [`depth${orderIndex}`]: "N/R" });
              //   }
              // }}

              min={3}
              // onChange={(e) => {
              //   if (e === null || e === undefined || Number(e) < Number("3")) {
              //     // Устанавливаем N/R если меньше 3 или пусто
              //     onDepthChange("N/R");
              //     formInstance.setFieldsValue({ [`depth${orderIndex}`]: "N/R" });
              //   } else {
              //     onDepthChange(e.toString());
              //     formInstance.setFieldsValue({ [`depth${orderIndex}`]: e });
              //   }
              // }}

              // onBlur={(e) => {
              //   const val = e.target.value.trim();
              //   const numeric = Number(val);
              //   if (!val || isNaN(numeric) || numeric < 3) {
              //     onDepthChange("N/R");
              //     formInstance.setFieldsValue({ [`depth${orderIndex}`]: "N/R" });
              //   }
              // }}

              onChange={(value) => {
                if (value === null || value === undefined || Number(value) <= 3) {
                  onDepthChange("N/R");
                  formInstance.setFieldsValue({ [`depth${orderIndex}`]: "N/R" });
                } else {
                  onDepthChange(value.toString());
                  formInstance.setFieldsValue({ [`depth${orderIndex}`]: value });
                }
              }}
              onBlur={(e) => {
                const val = Number(e.target.value);
                if (isNaN(val) || val <= 3) {
                  onDepthChange("N/R");
                  formInstance.setFieldsValue({ [`depth${orderIndex}`]: "N/R" });
                }
              }}


              className="text-center" /></Form.Item>}
        </div>

        {(
          <Form.Item name={`surfaceCondition${orderIndex}`} rules={[{ required: true, message: 'Обязательное поле' }]} className="mb-0">
            <Select
              disabled={value === 6}
              size="large"
              placeholder="Состояние"
              onSelect={(val) => onSurfaceConditionChange(val as SurfaceConditionType)}
              options={sostoyanie}
              className="!w-[200px] sm:w-[200px] "
            />
          </Form.Item>
        )}
      </div>

      <Divider />

      <Row gutter={16}>
        <Col xs={24} md={14} className="border-r">
          <div className="flex w-full flex-col justify-around gap-4 sm:flex-row">
            <div className="flex flex-col items-center gap-2">
              <div className="">Сухая</div>
              <div
                className="cursor-pointer border px-4 py-2 border-[#0000007e]"
                onClick={() => {
                  onValueChange(6);
                  onCoverageChange(100);
                  formInstance.setFieldsValue({
                   [`coveragePercentage${orderIndex}`]: 100,
                      [`depth${orderIndex}`]: 'N/R',
                      [`surfaceCondition${orderIndex}`]: 'DRY',
                      [`runwayConditionType${orderIndex}`]: 6
                  });
                }}
              >
                6
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="">Мокрая</div>
              <div
                className="cursor-pointer border px-4 py-2 border-[#0000007e]"
                onClick={() => {
                  onValueChange(5);
                  formInstance.setFieldsValue({ [`runwayConditionType${orderIndex}`]: 5 });
                }}
              >
                5
              </div>
              <div className="text-xs text-gray-6">25/50/75/100</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="">Иней</div>
              <div
                className="cursor-pointer border px-4 py-2 border-[#0000007e]"
                onClick={() => {
                  onValueChange(5);
                  formInstance.setFieldsValue({ [`runwayConditionType${orderIndex}`]: 5 });
                }}
              >
                5
              </div>
              <div className="text-xs text-gray-6">25/50/75/100</div>
            </div>
          </div>
        </Col>
        <Col xs={24} md={10}>
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <div className="text-center sm:text-left">
              Иней
              <div className="text-xs text-gray-6">
                {"(ниже установленного минимального уровня сцепления)"}
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div
                className="cursor-pointer border px-4 py-2 border-[#0000007e]"
                onClick={() => {
                  onValueChange(3);
                  formInstance.setFieldsValue({ [`runwayConditionType${orderIndex}`]: 3 });
                }}
              >
                3
              </div>
              <div className="text-xs text-gray-6">25/50/75/100</div>
            </div>
          </div>
        </Col>
      </Row>

      <Divider />

      <Row gutter={16} className="!flex md:flex-wrap">
        <Col xs={24} md={8} className="border-r flex flex-col md:w-[45%] ">
          <div className="text-lg font-semibold text-center sm:text-left">Стоячая вода</div>
          <div className="flex flex-col gap-4 sm:flex-row flex-wrap">
            <div className="flex flex-col items-center gap-2 flex-wrap">
              <div className="">Слякоть</div>
              <div
                className="cursor-pointer border px-4 py-2 border-[#0000007e]"
                onClick={() => {
                  onValueChange(2);
                  formInstance.setFieldsValue({ [`runwayConditionType${orderIndex}`]: 2 });
                }}
              >
                2
              </div>
              <div className="">{" > 3 мм"}</div>
              <div className="text-xs text-gray-6">25/50/75/100</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="">Слякоть</div>
              <div
                className="cursor-pointer border px-4 py-2 border-[#0000007e]"
                onClick={() => {
                  onValueChange(5);
                  formInstance.setFieldsValue({ [`runwayConditionType${orderIndex}`]: 5 });
                }}
              >
                5
              </div>
              <div className="">{" 3мм или < "}</div>
              <div className="text-xs text-gray-6">25/50/75/100</div>
            </div>
          </div>
        </Col>
        <Col xs={24} md={8} className="border-r flex flex-col md:w-[45%] ">
          <div className="text-lg font-semibold text-center sm:text-left">
            Мокрый снег или Сухой снег
          </div>
          <div className="flex flex-col gap-4 sm:flex-row flex-wrap">
            <div className="flex flex-col items-center gap-2 w-[65%]">
              <div className="">Слякоть</div>
              <div
                className="cursor-pointer border px-4 py-2 border-[#0000007e]"
                onClick={() => {
                  onValueChange(3);
                  formInstance.setFieldsValue({ [`runwayConditionType${orderIndex}`]: 3 });
                }}
              >
                3
              </div>
              <div className="">{" > 3 мм"}</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="">Слякоть</div>
              <div
                className="cursor-pointer border px-4 py-2 border-[#0000007e]"
                onClick={() => {
                  onValueChange(5);
                  formInstance.setFieldsValue({ [`runwayConditionType${orderIndex}`]: 5 });
                }}
              >
                5
              </div>
              <div className="">{" 3мм или < "}</div>
            </div>
          </div>
          <div className="text-xs text-gray-6 text-center sm:text-left">25/50/75/100</div>
        </Col>
        <Col xs={24} md={8} className="flex flex-col md:w-[45%] ">
          <div className="text-lg font-semibold text-center sm:text-left">
            Сухой/мокрый снег на уплот. снегу
          </div>
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className="cursor-pointer border px-4 py-2 border-[#0000007e]"
                onClick={() => {
                  onValueChange(3);
                  formInstance.setFieldsValue({ [`runwayConditionType${orderIndex}`]: 3 });
                }}
              >
                3
              </div>
              <div className="text-xs text-gray-6">25/50/75/100</div>
            </div>
          </div>
        </Col>
      </Row>

      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <div className="text-lg font-semibold">Глубина:</div>
        <div className="cursor-pointer border px-2 text-center sm:text-left">3 мм или менеее</div>
        <div className="cursor-pointer border px-2 text-center sm:text-left">
          Оцененная глубина {"(мм)"}
        </div>
      </div>
      <div className="text-xs text-gray-6 text-center sm:text-left">
        Отмечайте глубину только для: Стоячей воды, Слякоти, Мокрого или
        Сухого снега, любого снега на поверхности утрамбованного снега
      </div>

      <Divider className="" />

      <div className="flex flex-row lg:flex-col gap-4 ">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row /sm:items-end !md:flex-row !lg:flex-row">
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <div className="">-15°C или ниже</div>
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <div className="text-gray-6">25/50/75/100</div>
              <div
                className="cursor-pointer border px-4 py-2 border-[#0000007e]"
                onClick={() => {
                  onValueChange(4);
                  formInstance.setFieldsValue({ [`runwayConditionType${orderIndex}`]: 4 });
                }}
              >
                4
              </div>
            </div>
          </div>
          <div className="font-semibold text-center sm:text-left">Уплотненный снег</div>
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <div className="">Выше -15°C</div>
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <div
                className="cursor-pointer border px-4 py-2 border-[#0000007e]"
                onClick={() => {
                  onValueChange(3);
                  formInstance.setFieldsValue({ [`runwayConditionType${orderIndex}`]: 3 });
                }}
              >
                3
              </div>
              <div className="text-gray-6">25/50/75/100</div>
            </div>
          </div>
        </div>

        <Divider className="!md:w-0 !md:h-0 !lg:w-0 !lg:h-0 !md:min-w-0" />

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="border-r pr-2">
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <div className="text-gray-6">25/50/75/100</div>
              <div className="flex flex-col items-center">
                <div className="">Лед</div>
                <div
                  className="cursor-pointer border px-4 py-2 border-[#0000007e]"
                  onClick={() => {
                    onValueChange(1);
                    formInstance.setFieldsValue({ [`runwayConditionType${orderIndex}`]: 1 });
                  }}
                >
                  1
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <div className="text-center sm:text-left">
              Мокрый лед/ Вода на поверхности утрамбованного снега/ Сухой снег
              или Мокрый снег на поверхности льда
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center">
                <div
                  className="cursor-pointer border px-4 py-2 border-[#0000007e]"
                  onClick={() => {
                    onValueChange(0);
                    formInstance.setFieldsValue({ [`runwayConditionType${orderIndex}`]: 0 });
                  }}
                >
                  0
                </div>
              </div>
              <div className="text-gray-6">25/50/75/100</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewRunWay3 = ({ form, isCreateMode }: { form: FormInstance, isCreateMode: boolean }) => {
  const [currentTime, setCurrentTime] = useState(dayjs().format("DD-MM HH:mm"));

  const [coverageType, setCoverageType] = useState(1);
  const [thirds, setThirds] = useState<{
    values: (RunwayConditionType | null)[];
    coverages: (CoveragePercentage | null)[];
    surfaceConditions: (SurfaceConditionType | null)[];
    depths: (string)[];
  }>({
    values: [null, null, null],
    coverages: [null, null, null],
    surfaceConditions: [null, null, null],
    depths: ["", "", ""]
  });

  const UserData = useUserMe();

  const { data: surfaceConditionsData } = useQuery({
    queryFn: () => GetSurfaceCondition(),
    queryKey: ["surface-conditions"],
  });

  const handleThirdValueChange = (index: number, value: RunwayConditionType) => {
    setThirds(prev => ({
      ...prev,
      values: prev.values.map((v, i) => i === index ? value : v)
    }));
  };

  const handleThirdCoverageChange = (index: number, coverage: CoveragePercentage) => {
    setThirds(prev => ({
      ...prev,
      coverages: prev.coverages.map((c, i) => i === index ? coverage : c)
    }));
  };


  const handleThirdSurfaceConditionChange = (index: number, val: SurfaceConditionType) => {
    setThirds(prev => ({
      ...prev,
      surfaceConditions: prev.surfaceConditions.map((s, i) => i === index ? val : s)
    }));
  };

  const handleThirdDepthChange = (index: number, val: string) => {
    setThirds(prev => ({
      ...prev,
      depths: prev.depths.map((d, i) => i === index ? val : d)
    }));
  };


  useEffect(() => {
    const values = form.getFieldsValue();
    setThirds({
      values: [
        values.runwayConditionType1 ?? null,
        values.runwayConditionType2 ?? null,
        values.runwayConditionType3 ?? null
      ],
      coverages: [
        values.coveragePercentage1 ?? null,
        values.coveragePercentage2 ?? null,
        values.coveragePercentage3 ?? null
      ],
      surfaceConditions: [
        values.surfaceCondition1 ?? null,
        values.surfaceCondition2 ?? null,
        values.surfaceCondition3 ?? null
      ],
      depths: [
        values.depth1 ?? "",
        values.depth2 ?? "",
        values.depth3 ?? ""
      ]
    });
    if (isCreateMode) {
      form.setFieldsValue({
        airport: UserData.data?.data?.airportDto.name,
        datetime: dayjs().format("DD-MM HH:mm"),
        VPP: UserData.data?.data.airportDto.runwayDtos[0].id,
        temperature: UserData.data?.data.airportDto.temperature,
        initials: UserData.data?.data.fullname,
        position: UserData.data?.data.position
      });
    }
    else {

    }

  }, [UserData.data?.data.airportDto, isCreateMode]);



  console.log(UserData.data?.data, "UserData");


  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs().format("DD-MM HH:mm");
      setCurrentTime(now);
      form.setFieldsValue({ datetime: now }); // ⬅️ добавлено!
    }, 1000);

    return () => clearInterval(interval); // очищаем при размонтировании
  }, []);


  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between flex-col  items-center lg:flex-row">
        <div className="flex flex-col gap-2 mb-4 max-w-[400px]">
          <div className="flex items-center justify-between">
            <div className="flex w-[150px]">Аэродром:</div>
            <Form.Item layout="horizontal" label="" initialValue={UserData.data?.data?.airportDto.name} name={"airport"} className="mb-0 w-[250px]">
              <Input readOnly></Input>
            </Form.Item >

          </div>
          <div className="flex items-center justify-between">
            <div className="flex w-[150px]">Дата/Время: <br />(ДД-ММ ЧЧ:ММ)</div>
            <Form.Item layout="horizontal" label="" name={"datetime"} className="mb-0 w-[250px]">
              <Input readOnly value={currentTime}></Input>
            </Form.Item>

          </div>
          <div className="flex items-center justify-between">
            <div className="flex w-[150px]">ВПП:</div>
            <Form.Item layout="horizontal" label="" name={"VPP"} className="mb-0 w-[250px]">
              <Select options={UserData.data?.data.airportDto.runwayDtos.map(i => ({
                label: i.runwayDesignation,
                value: i.id
              }))}></Select>
            </Form.Item>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex w-[150px]">Температура окр. среды:</div>
            <Form.Item layout="horizontal" label="" name={"temperature"} className="mb-0 w-[250px]" >
              <Input readOnly suffix="°C"></Input>
            </Form.Item>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex w-[150px]">Инициалы:</div>
            <Form.Item layout="horizontal" label="" name={"initials"} className="mb-0 w-[250px]">
              <Input readOnly ></Input>
            </Form.Item>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex w-[150px]">Должность:</div>
            <Form.Item layout="horizontal" label="" name={"position"} className="mb-0 w-[250px]">
              <Input readOnly ></Input>
            </Form.Item>
          </div>
        </div>
        <div className="mb-4 flex flex-col items-center gap-4 px-4">
          <div className="text-center">Оцените % покрытия загрязнения ВПП для каждой трети ВПП</div>
          <div className="flex flex-col gap-2 lg:flex-row">
            {[
              {
                value: 0,
                label: "< 10% покрытие",
                color: "text-green-500",
                description: "RWYCC – 6 для данной трети не сообщается о загрязнении"
              },
              {
                value: 1,
                label: "≥ 10% - ≤ 25% покрытие",
                color: "text-red-500",
                description: "RWYCC – 6 для данной трети Сообщите о загрязнении с 25% зоной покрытия"
              },
              {
                value: 2,
                label: "> 25% покрытие",
                color: "text-green-500",
                description: "Присвоить RWYCC на основе присутствия загрязняющих веществ и температуры"
              }
            ].map((option) => (
              <div
                key={option.value}
                className={`rounded-md border-[#272727] dark:border-white border-[1px] flex max-w-[300px]  cursor-pointer flex-col gap-2 p-2`}
              >
                <div className="flex items-center gap-2">
                  <CircleDot className="dark:text-white text-#272727" />
                  <div className={option.color}>{option.label}</div>
                </div>
                <div className="text-sm">{option.description}</div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-red-500">Прим: </span>
            Отчет RCR не требуется, когда зона покрытия трети ВПП {"<10%"} (за
            исключением, когда выпускается донесение о чистой ВПП)
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 md:grid-cols-1">
        {[1, 2, 3].map((thirdNumber, index) => (
          <RunwayThird
            formInstance={form}
            orderIndex={thirdNumber}
            key={thirdNumber}
            title={`${thirdNumber} треть ВПП`}
            value={thirds.values[index]}
            coverage={thirds.coverages[index]}
            onValueChange={(value) => handleThirdValueChange(index, value)}
            onCoverageChange={(coverage) => handleThirdCoverageChange(index, coverage)}
            surfaceConditions={surfaceConditionsData?.data || []}
            onSurfaceConditionChange={(val) => handleThirdSurfaceConditionChange(index, val)}
            depth={thirds.depths[index]}
            onDepthChange={(val) => handleThirdDepthChange(index, val)}
          />
        ))}
      </div>
    </div>
  );
};

export default NewRunWay3;