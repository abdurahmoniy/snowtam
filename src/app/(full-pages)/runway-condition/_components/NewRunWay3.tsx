import { Col, Divider, Input, InputNumber, Row, Select } from "antd"
import { CircleDot } from "lucide-react"
import { useState } from "react"

export type type = 0 | 1 | 2 | 3 | 4 | 5 | 6

const NewRunWay3 = () => {
    const [value, setValue] = useState(1);
    const [val1, setVal1] = useState<type | null>(null)
    const [val2, setVal2] = useState<type | null>(null)
    const [val3, setVal3] = useState<type | null>(null)

    const [sel1, setSel1] = useState<number | null>(null)
    const [sel2, setSel2] = useState<number | null>(null)
    const [sel3, setSel3] = useState<number | null>(null)

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col gap-4 mb-4 items-center">
                <div>Оцените % покрытия загрязнения ВПП для каждой трети ВПП</div>
                <div className="flex gap-2">
                    <div
                        onClick={() => setValue(0)}
                        className={`border rounded-md ${value === 0 && "border-[#3C50E0]"} p-2 flex flex-col gap-2 max-w-[400px] cursor-pointer`}
                    >
                        <div className="flex items-center gap-2">
                            <CircleDot color={value === 0 ? `#3C50E0` : "#fff"} />
                            <div className="text-green-500">{"< 10% покрытие"}</div>
                        </div>
                        <div>RWYCC – 6 для данной трети не сообщается о загрязнении</div>
                    </div>
                    <div
                        onClick={() => setValue(1)}
                        className={`border rounded-md ${value === 1 && "border-[#3C50E0]"} p-2 flex flex-col max-w-[400px] cursor-pointer`}
                    >
                        <div className="flex items-center gap-2">
                            <CircleDot color={value === 1 ? `#3C50E0` : "#fff"} />
                            <div className="text-red-500">{"≥ 10% - ≤ 25% покрытие"}</div>
                        </div>
                        <div>RWYCC – 6 для данной трети Сообщите о загрязнении с 25% зоной покрытия</div>
                    </div>
                    <div
                        onClick={() => setValue(2)}
                        className={`border rounded-md ${value === 2 && "border-[#3C50E0]"} p-2 flex flex-col max-w-[400px] cursor-pointer`}
                    >
                        <div className="flex items-center gap-2">
                            <CircleDot color={value === 2 ? `#3C50E0` : "#fff"} />
                            <div className="text-green-500">{"> 25% покрытие"}</div>
                        </div>
                        <div>Присвоить RWYCC на основе присутствия загрязняющих веществ и температуры</div>
                    </div>
                </div>
                <div>
                    <span className="text-red-500">Прим: </span>
                    Отчет RCR не требуется, когда зона покрытия трети ВПП {"<10%"} (за исключением, когда выпускается донесение о чистой ВПП)
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <div className="border border-primary p-2 rounded-md">
                    <div className="flex items-center flex-col justify-center pt-2">
                        <div className="text-lg font-semibold">1 треть ВПП</div>
                        <div className="text-sm">Для зоны покрытия 25 % или меньше записывайте код 6</div>
                    </div>
                    <Divider />
                    <div className="">
                        <p>- Определите превышает ли загрязнение 25% покрытий трети ВПП</p>
                        <p>- Определите % покрытия</p>
                        <p>- Определите глубину (если применимо)</p>
                        <p>- Определите код состояния ВПП RWYCC</p>
                        <p>- Впишите в квадрат справа код состояния ВПП</p>
                    </div>
                    <Divider />
                    <div className="flex gap-2">
                        <div className="flex flex-col items-center">
                            <Input
                                value={val1 ?? ""}
                                size="large"
                                onChange={(e) => {
                                    const v = Number(e.target.value);
                                    if ([0, 1, 2, 3, 4, 5, 6].includes(v)) setVal1(v as type);
                                }}
                                className="w-[80px]"
                            />
                            <div className="">RWYCC</div>
                        </div>
                        <Select
                            size="large"
                            value={val1 === 6 ? 100 : null}
                            placeholder="Choose"
                            onSelect={(val) => setSel1(val as number)}
                            options={[
                                { value: 25, label: "25%" },
                                { value: 50, label: "50%" },
                                { value: 75, label: "75%" },
                                { value: 100, label: "100%" },
                            ]}
                        />
                        <div className="">
                            <InputNumber
                                size="large"
                                placeholder="Глубина"
                            />
                        </div>
                    </div>
                    <Divider />
                    <Row gutter={16}>
                        <Col md={14} className="border-r">
                            <div className="flex justify-around w-full">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="">Сухая</div>
                                    <div
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal1(6)}
                                    >6</div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="">Мокрая</div>
                                    <div
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal1(5)}
                                    >5</div>
                                    <div className="text-xs text-gray-6">25/50/75/100</div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="">Иней</div>
                                    <div
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal1(5)}
                                    >5</div>
                                    <div className="text-xs text-gray-6">25/50/75/100</div>
                                </div>
                            </div>
                        </Col>
                        <Col md={10}>
                            <div className="flex">
                                <div className="">
                                    Иней
                                    <div className="text-xs text-gray-6">{"(ниже установленного минимального уровня сцепления)"}</div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal1(3)}
                                    >3</div>
                                    <div className="text-xs text-gray-6">25/50/75/100</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={16}>
                        <Col md={8} className="border-r">
                            <div className="text-lg font-semibold">
                                Стоячая вода
                            </div>
                            <div className="flex">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="">Слякоть</div>
                                    <div
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal1(2)}
                                    >2</div>
                                    <div className="">{" > 3 мм"}</div>
                                    <div className="text-xs text-gray-6">25/50/75/100</div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="">Слякоть</div>
                                    <div
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal1(5)}
                                    >5</div>
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
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal1(3)}
                                    >3</div>
                                    <div className="">{" > 3 мм"}</div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="">Слякоть</div>
                                    <div
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal1(5)}
                                    >5</div>
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
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal1(3)}
                                    >3</div>
                                    <div className="text-xs text-gray-6">25/50/75/100</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <div className="flex gap-2 mt-2">
                        <div className="text-lg font-semibold">
                            Глубина:
                        </div>
                        <div className="border cursor-pointer px-2">
                            3 мм или менеее
                        </div>
                        <div className="border cursor-pointer px-2">
                            Оцененная глубина {"(мм)"}
                        </div>
                    </div>
                    <div className="text-xs text-gray-6">Отмечайте глубину только для: Стоячей воды, Слякоти, Мокрого или Сухого снега, любого снега на поверхности утрамбованного снега</div>
                    <Divider />
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col gap-2">
                            <div className="">-15°C или ниже</div>
                            <div className="flex items-center gap-2">
                                <div className="text-gray-6">25/50/75/100</div>
                                <div
                                    className="border px-4 py-2 cursor-pointer"
                                    onClick={() => setVal1(4)}
                                >4</div>
                            </div>
                        </div>
                        <div className="font-semibold">Уплетненный снег</div>
                        <div className="flex flex-col gap-2">
                            <div className="">Выше -15°C</div>
                            <div className="flex items-center gap-2">
                                <div
                                    className="border px-4 py-2 cursor-pointer"
                                    onClick={() => setVal1(3)}
                                >3</div>
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
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal1(1)}
                                    >1</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="">
                                Мокрый лед/
                                Вода на поверхности утрамбованного снега/
                                Сухой снег или
                                Мокрый снег на поверхности льда
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex flex-col items-center">
                                    <div
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal1(0)}
                                    >0</div>
                                </div>
                                <div className="text-gray-6">25/50/75/100</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border border-primary p-2 rounded-md">
                    <div className="flex items-center flex-col justify-center pt-2">
                        <div className="text-lg font-semibold">2 треть ВПП</div>
                        <div className="text-sm">Для зоны покрытия 25 % или меньше записывайте код 6</div>
                    </div>
                    <Divider />
                    <div className="">
                        <p>- Определите превышает ли загрязнение 25% покрытий трети ВПП</p>
                        <p>- Определите % покрытия</p>
                        <p>- Определите глубину (если применимо)</p>
                        <p>- Определите код состояния ВПП RWYCC</p>
                        <p>- Впишите в квадрат справа код состояния ВПП</p>
                    </div>
                    <Divider />
                    <div className="flex gap-2">
                        <div className="flex flex-col items-center">
                            <Input
                                value={val2 ?? ""}
                                onChange={(e) => {
                                    const v = Number(e.target.value);
                                    if ([0, 1, 2, 3, 4, 5, 6].includes(v)) setVal2(v as type);
                                }}
                                size="large"
                                className="w-[80px]"
                            />
                            <div className="">RWYCC</div>
                        </div>
                        <Select
                            size="large"
                            value={val2 === 6 ? 100 : null}
                            placeholder="Choose"
                            onSelect={(val) => setSel2(val as number)}
                            options={[
                                { value: 25, label: "25%" },
                                { value: 50, label: "50%" },
                                { value: 75, label: "75%" },
                                { value: 100, label: "100%" },
                            ]}
                        />
                        <div className="">
                            <InputNumber
                                size="large"
                                placeholder="Глубина"
                            />
                        </div>
                    </div>
                    <Divider />
                    <Row gutter={16}>
                        <Col md={14} className="border-r">
                            <div className="flex justify-around w-full">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="">Сухая</div>
                                    <div
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal2(6)}
                                    >6</div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="">Мокрая</div>
                                    <div
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal2(5)}
                                    >5</div>
                                    <div className="text-xs text-gray-6">25/50/75/100</div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="">Иней</div>
                                    <div
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal2(5)}
                                    >5</div>
                                    <div className="text-xs text-gray-6">25/50/75/100</div>
                                </div>
                            </div>
                        </Col>
                        <Col md={10}>
                            <div className="flex">
                                <div className="">
                                    Иней
                                    <div className="text-xs text-gray-6">{"(ниже установленного минимального уровня сцепления)"}</div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal2(3)}
                                    >3</div>
                                    <div className="text-xs text-gray-6">25/50/75/100</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={16}>
                        <Col md={8} className="border-r">
                            <div className="text-lg font-semibold">
                                Стоячая вода
                            </div>
                            <div className="flex">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="">Слякоть</div>
                                    <div
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal2(2)}
                                    >2</div>
                                    <div className="">{" > 3 мм"}</div>
                                    <div className="text-xs text-gray-6">25/50/75/100</div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="">Слякоть</div>
                                    <div
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal2(5)}
                                    >5</div>
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
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal2(3)}
                                    >3</div>
                                    <div className="">{" > 3 мм"}</div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="">Слякоть</div>
                                    <div
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal2(5)}
                                    >5</div>
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
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal2(3)}
                                    >3</div>
                                    <div className="text-xs text-gray-6">25/50/75/100</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <div className="flex gap-2 mt-2">
                        <div className="text-lg font-semibold">
                            Глубина:
                        </div>
                        <div className="border cursor-pointer px-2">
                            3 мм или менеее
                        </div>
                        <div className="border cursor-pointer px-2">
                            Оцененная глубина {"(мм)"}
                        </div>
                    </div>
                    <div className="text-xs text-gray-6">Отмечайте глубину только для: Стоячей воды, Слякоти, Мокрого или Сухого снега, любого снега на поверхности утрамбованного снега</div>
                    <Divider />
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col gap-2">
                            <div className="">-15°C или ниже</div>
                            <div className="flex items-center gap-2">
                                <div className="text-gray-6">25/50/75/100</div>
                                <div
                                    className="border px-4 py-2 cursor-pointer"
                                    onClick={() => setVal2(4)}
                                >4</div>
                            </div>
                        </div>
                        <div className="font-semibold">Уплетненный снег</div>
                        <div className="flex flex-col gap-2">
                            <div className="">Выше -15°C</div>
                            <div className="flex items-center gap-2">
                                <div
                                    className="border px-4 py-2 cursor-pointer"
                                    onClick={() => setVal2(3)}
                                >3</div>
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
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal2(1)}
                                    >1</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="">
                                Мокрый лед/
                                Вода на поверхности утрамбованного снега/
                                Сухой снег или
                                Мокрый снег на поверхности льда
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex flex-col items-center">
                                    <div
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal2(0)}
                                    >0</div>
                                </div>
                                <div className="text-gray-6">25/50/75/100</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border border-primary p-2 rounded-md">
                    <div className="flex items-center flex-col justify-center pt-2">
                        <div className="text-lg font-semibold">3 треть ВПП</div>
                        <div className="text-sm">Для зоны покрытия 25 % или меньше записывайте код 6</div>
                    </div>
                    <Divider />
                    <div className="">
                        <p>- Определите превышает ли загрязнение 25% покрытий трети ВПП</p>
                        <p>- Определите % покрытия</p>
                        <p>- Определите глубину (если применимо)</p>
                        <p>- Определите код состояния ВПП RWYCC</p>
                        <p>- Впишите в квадрат справа код состояния ВПП</p>
                    </div>
                    <Divider />
                    <div className="flex gap-2">
                        <div className="flex flex-col items-center">
                            <Input
                                value={val3 ?? ""}
                                onChange={(e) => {
                                    const v = Number(e.target.value);
                                    if ([0, 1, 2, 3, 4, 5, 6].includes(v)) setVal3(v as type);
                                }}
                                size="large"
                                className="w-[80px]"
                            />
                            <div className="">RWYCC</div>
                        </div>
                        <Select
                            size="large"
                            value={val3 === 6 ? 100 : null}
                            placeholder="Choose"
                            onSelect={(val) => setSel3(val as number)}
                            options={[
                                { value: 25, label: "25%" },
                                { value: 50, label: "50%" },
                                { value: 75, label: "75%" },
                                { value: 100, label: "100%" },
                            ]}
                        />
                        <div className="">
                            <InputNumber
                                size="large"
                                placeholder="Глубина"
                            />
                        </div>
                    </div>
                    <Divider />
                    <Row gutter={16}>
                        <Col md={14} className="border-r">
                            <div className="flex justify-around w-full">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="">Сухая</div>
                                    <div
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal3(6)}
                                    >6</div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="">Мокрая</div>
                                    <div
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal3(5)}
                                    >5</div>
                                    <div className="text-xs text-gray-6">25/50/75/100</div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="">Иней</div>
                                    <div
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal3(5)}
                                    >5</div>
                                    <div className="text-xs text-gray-6">25/50/75/100</div>
                                </div>
                            </div>
                        </Col>
                        <Col md={10}>
                            <div className="flex">
                                <div className="">
                                    Иней
                                    <div className="text-xs text-gray-6">{"(ниже установленного минимального уровня сцепления)"}</div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal3(3)}
                                    >3</div>
                                    <div className="text-xs text-gray-6">25/50/75/100</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={16}>
                        <Col md={8} className="border-r">
                            <div className="text-lg font-semibold">
                                Стоячая вода
                            </div>
                            <div className="flex">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="">Слякоть</div>
                                    <div
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal3(2)}
                                    >2</div>
                                    <div className="">{" > 3 мм"}</div>
                                    <div className="text-xs text-gray-6">25/50/75/100</div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="">Слякоть</div>
                                    <div
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal3(5)}
                                    >5</div>
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
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal3(3)}
                                    >3</div>
                                    <div className="">{" > 3 мм"}</div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="">Слякоть</div>
                                    <div
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal3(5)}
                                    >5</div>
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
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal3(3)}
                                    >3</div>
                                    <div className="text-xs text-gray-6">25/50/75/100</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <div className="flex gap-2 mt-2">
                        <div className="text-lg font-semibold">
                            Глубина:
                        </div>
                        <div className="border cursor-pointer px-2">
                            3 мм или менеее
                        </div>
                        <div className="border cursor-pointer px-2">
                            Оцененная глубина {"(мм)"}
                        </div>
                    </div>
                    <div className="text-xs text-gray-6">Отмечайте глубину только для: Стоячей воды, Слякоти, Мокрого или Сухого снега, любого снега на поверхности утрамбованного снега</div>
                    <Divider />
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col gap-2">
                            <div className="">-15°C или ниже</div>
                            <div className="flex items-center gap-2">
                                <div className="text-gray-6">25/50/75/100</div>
                                <div
                                    className="border px-4 py-2 cursor-pointer"
                                    onClick={() => setVal3(4)}
                                >4</div>
                            </div>
                        </div>
                        <div className="font-semibold">Уплетненный снег</div>
                        <div className="flex flex-col gap-2">
                            <div className="">Выше -15°C</div>
                            <div className="flex items-center gap-2">
                                <div
                                    className="border px-4 py-2 cursor-pointer"
                                    onClick={() => setVal3(3)}
                                >3</div>
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
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal3(1)}
                                    >1</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="">
                                Мокрый лед/
                                Вода на поверхности утрамбованного снега/
                                Сухой снег или
                                Мокрый снег на поверхности льда
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex flex-col items-center">
                                    <div
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => setVal3(0)}
                                    >0</div>
                                </div>
                                <div className="text-gray-6">25/50/75/100</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default NewRunWay3