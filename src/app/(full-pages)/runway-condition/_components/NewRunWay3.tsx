"use client";

import { GetSurfaceCondition } from "@/services/enums";
import { useQuery } from "@tanstack/react-query";
import { Col, Divider, InputNumber, Row, Select } from "antd";
import { CircleDot } from "lucide-react";
import { useState } from "react";

type RunwayConditionType = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type CoveragePercentage = 25 | 50 | 75 | 100;

interface RunwayThirdProps {
  title: string;
  value: RunwayConditionType | null;
  coverage: CoveragePercentage | null;
  onValueChange: (value: RunwayConditionType) => void;
  onCoverageChange: (value: CoveragePercentage) => void;
  surfaceConditions: string[];
}

const sostoyanie = [
  { label: "Dry - quruq - сухой", value: "DRY" },
  { label: "Wet - ho'l - мокрый", value: "WET" },
  { label: "Ice - muz - лед", value: "ICE" },
  { label: "Snow - qor - снег", value: "SNOW" },
]

const RunwayThird = ({
  title,
  value,
  coverage,
  onValueChange,
  onCoverageChange,
  surfaceConditions
}: RunwayThirdProps) => {
  return (
    <div className="rounded-md border border-primary p-2">
      <div className="flex flex-col items-center justify-center pt-2">
        <div className="text-lg font-semibold text-center">{title}</div>
        <div className="text-sm text-center">
          Для зоны покрытия 25 % или меньше записывайте код 6
        </div>
      </div>

      <Divider />

      <div className="text-sm">
        <p>- Определите превышает ли загрязнение 25% покрытий трети ВПП</p>
        <p>- Определите % покрытия</p>
        <p>- Определите глубину (если применимо)</p>
        <p>- Определите код состояния ВПП RWYCC</p>
        <p>- Впишите в квадрат справа код состояния ВПП</p>
      </div>

      <Divider />

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex flex-col items-center">
          <Select
            value={value}
            size="large"
            placeholder="1-6"
            onChange={(value) => {
              if (value && typeof value === 'number' && [0, 1, 2, 3, 4, 5, 6].includes(value)) {
                onValueChange(value as RunwayConditionType);
              }
            }}
            className="w-[80px]"
            options={[
              { value: 1, label: "1" },
              { value: 2, label: "2" },
              { value: 3, label: "3" },
              { value: 4, label: "4" },
              { value: 5, label: "5" },
              { value: 6, label: "6" },
            ]}
          />
          <div className="">RWYCC</div>
        </div>

        <Select
          size="large"
          value={value === 6 ? 100 : coverage}
          placeholder="Процент"
          disabled={value === 6}
          onSelect={(val) => onCoverageChange(val as CoveragePercentage)}
          options={[
            { value: 25, label: "25%" },
            { value: 50, label: "50%" },
            { value: 75, label: "75%" },
            { value: 100, label: "100%" },
          ]}
        />

        <div className="">
          {value !== 6 && <InputNumber size="large" placeholder="Глубина" />}
        </div>

        {value !== 6 && (
          <Select
            size="large"
            placeholder="Состояние"
            onSelect={(val) => onCoverageChange(val as CoveragePercentage)}
            options={sostoyanie}
            className="w-full sm:w-[200px]"
          />
        )}
      </div>

      <Divider />

      <Row gutter={16}>
        <Col xs={24} md={14} className="border-r">
          <div className="flex w-full flex-col justify-around gap-4 sm:flex-row">
            <div className="flex flex-col items-center gap-2">
              <div className="">Сухая</div>
              <div
                className="cursor-pointer border px-4 py-2"
                onClick={() => onValueChange(6)}
              >
                6
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="">Мокрая</div>
              <div
                className="cursor-pointer border px-4 py-2"
                onClick={() => onValueChange(5)}
              >
                5
              </div>
              <div className="text-xs text-gray-6">25/50/75/100</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="">Иней</div>
              <div
                className="cursor-pointer border px-4 py-2"
                onClick={() => onValueChange(5)}
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
                className="cursor-pointer border px-4 py-2"
                onClick={() => onValueChange(3)}
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
        <Col xs={24} md={8} className="border-r">
          <div className="text-lg font-semibold text-center sm:text-left">Стоячая вода</div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-col items-center gap-2">
              <div className="">Слякоть</div>
              <div
                className="cursor-pointer border px-4 py-2"
                onClick={() => onValueChange(2)}
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
                onClick={() => onValueChange(5)}
              >
                5
              </div>
              <div className="">{" 3мм или < "}</div>
              <div className="text-xs text-gray-6">25/50/75/100</div>
            </div>
          </div>
        </Col>
        <Col xs={24} md={8} className="border-r">
          <div className="text-lg font-semibold text-center sm:text-left">
            Мокрий снег или Сухой снег
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-col items-center gap-2">
              <div className="">Слякоть</div>
              <div
                className="cursor-pointer border px-4 py-2"
                onClick={() => onValueChange(3)}
              >
                3
              </div>
              <div className="">{" > 3 мм"}</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="">Слякоть</div>
              <div
                className="cursor-pointer border px-4 py-2"
                onClick={() => onValueChange(5)}
              >
                5
              </div>
              <div className="">{" 3мм или < "}</div>
            </div>
          </div>
          <div className="text-xs text-gray-6 text-center sm:text-left">25/50/75/100</div>
        </Col>
        <Col xs={24} md={8}>
          <div className="text-lg font-semibold text-center sm:text-left">
            Сухой/мокрий снег на уплот. снегу
          </div>
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className="cursor-pointer border px-4 py-2"
                onClick={() => onValueChange(3)}
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

      <Divider />

      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <div className="">-15°C или ниже</div>
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <div className="text-gray-6">25/50/75/100</div>
            <div
              className="cursor-pointer border px-4 py-2"
              onClick={() => onValueChange(4)}
            >
              4
            </div>
          </div>
        </div>
        <div className="font-semibold text-center sm:text-left">Уплетненный снег</div>
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <div className="">Выше -15°C</div>
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <div
              className="cursor-pointer border px-4 py-2"
              onClick={() => onValueChange(3)}
            >
              3
            </div>
            <div className="text-gray-6">25/50/75/100</div>
          </div>
        </div>
      </div>

      <Divider />

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="border-r pr-2">
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <div className="text-gray-6">25/50/75/100</div>
            <div className="flex flex-col items-center">
              <div className="">Лед</div>
              <div
                className="cursor-pointer border px-4 py-2"
                onClick={() => onValueChange(1)}
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
                className="cursor-pointer border px-4 py-2"
                onClick={() => onValueChange(0)}
              >
                0
              </div>
            </div>
            <div className="text-gray-6">25/50/75/100</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewRunWay3 = () => {
  const [coverageType, setCoverageType] = useState(1);
  const [thirds, setThirds] = useState<{
    values: (RunwayConditionType | null)[];
    coverages: (CoveragePercentage | null)[];
  }>({
    values: [null, null, null],
    coverages: [null, null, null]
  });

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

  return (
    <div className="flex flex-col items-center">
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
              onClick={() => setCoverageType(option.value)}
              className={`rounded-md border ${coverageType === option.value && "border-[#3C50E0]"} flex max-w-[400px] cursor-pointer flex-col gap-2 p-2`}
            >
              <div className="flex items-center gap-2">
                <CircleDot color={coverageType === option.value ? `#3C50E0` : "#fff"} />
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

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3">
        {[1, 2, 3].map((thirdNumber, index) => (
          <RunwayThird
            key={thirdNumber}
            title={`${thirdNumber} треть ВПП`}
            value={thirds.values[index]}
            coverage={thirds.coverages[index]}
            onValueChange={(value) => handleThirdValueChange(index, value)}
            onCoverageChange={(coverage) => handleThirdCoverageChange(index, coverage)}
            surfaceConditions={surfaceConditionsData?.data || []}
          />
        ))}
      </div>
    </div>
  );
};

export default NewRunWay3;