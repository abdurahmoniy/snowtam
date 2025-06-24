import { Divider, Input, Radio, Select } from "antd";
import { CircleDot } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface RunwayTypeStepProps {
    type: 1 | 2 | 3;
    value: number;
    setValue: Dispatch<SetStateAction<number>>;
}

export default function RunwayTypeStep({ type, value, setValue }: RunwayTypeStepProps) {
    return (
        <div className="flex gap-2 p-8 bg-white dark:bg-dark-2 rounded shadow">
            <div className="w-1/2">
                <div className="flex justify-between">
                    <div className="">
                        <div className="text-xl font-semibold mb-2">{type}/3 of Runway</div>
                        <div>For coverage zones of 25% or less, enter code 6</div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Input size="large" className="w-[50px]" />
                        <div className="">RWYCC</div>
                    </div>
                </div>
                <Divider size="small" />
                <ul>
                    <li>Determine whether contamination exceeds 25% of the runway third</li>
                    <li>Determine % coverage</li>
                    <li>Determine depth (if applicable)</li>
                    <li>Determine RWYCC code</li>
                    <li>Enter the RWYCC code in the right square of the runway third</li>
                </ul>
                <Divider size="small" />
                <div className="flex">
                    <div className="w-1/2 block">
                        <div className="text-lg">Surface condition</div>
                        <Radio.Group defaultValue="DRY">
                            <Radio value="DRY">DRY</Radio>
                            <Radio value="WET">WET</Radio>
                            <Radio value="ICE">ICE</Radio>
                            <Radio value="SNOW">SNOW</Radio>
                        </Radio.Group>
                    </div>
                    <div className="w-1/2 block">
                        <div className="text-lg">Temperature (°C)</div>
                        <Input size="large" className="w-[50px]" />
                    </div>
                </div>
                <Divider size="small" />
                <div className="flex">
                    <div className="w-1/2 block">
                        <div className="text-lg">Friction coefficient</div>
                        <Select
                            size="large"
                            defaultValue={1}
                            options={[
                                { label: '1', value: 1 },
                                { label: '2', value: 2 },
                                { label: '3', value: 3 },
                            ]}
                        />
                    </div>
                    <div className="w-1/2 block">
                        <div className="text-lg">Depth (mm)</div>
                        <Select
                            size="large"
                            defaultValue={1}
                            options={[
                                { label: '1', value: 1 },
                                { label: '2', value: 2 },
                                { label: '3', value: 3 },
                            ]}
                        />
                    </div>
                </div>
            </div>
            <div className="bg-white w-1/2 dark:bg-dark-2 px-6 rounded shadow flex flex-col gap-4">
                <div>Evaluate the % coverage of runway contamination for each third of the runway</div>
                <div className="flex flex-col gap-2">
                    <div
                        onClick={() => setValue(1)}
                        className={`border rounded-md ${value === 1 && "border-[#3C50E0]"} p-2 flex flex-col gap-2 max-w-[400px] cursor-pointer`}
                    >
                        <div className="flex items-center gap-2">
                            <CircleDot color={value === 1 ? `#3C50E0` : "#fff"} />
                            <div className="text-green-500">{"< 10% Coverage"}</div>
                        </div>
                        <div>RWYCC – 6 for this third, no contamination reported</div>
                    </div>
                    <div
                        onClick={() => setValue(2)}
                        className={`border rounded-md ${value === 2 && "border-[#3C50E0]"} p-2 flex flex-col max-w-[400px] cursor-pointer`}
                    >
                        <div className="flex items-center gap-2">
                            <CircleDot color={value === 2 ? `#3C50E0` : "#fff"} />
                            <div className="text-red-500">{"≥ 10% - ≤ 25% Coverage"}</div>
                        </div>
                        <div>RWYCC – 6 for this third. Report contamination for 25% coverage zone</div>
                    </div>
                    <div
                        onClick={() => setValue(3)}
                        className={`border rounded-md ${value === 3 && "border-[#3C50E0]"} p-2 flex flex-col max-w-[400px] cursor-pointer`}
                    >
                        <div className="flex items-center gap-2">
                            <CircleDot color={value === 3 ? `#3C50E0` : "#fff"} />
                            <div className="text-green-500">{"> 25% Coverage"}</div>
                        </div>
                        <div>Assign RWYCC based on presence of contaminants and temperature</div>
                    </div>
                </div>
                <div>
                    <span className="text-red-500">Note: </span>
                    RCR report is not required when the coverage of the runway third is {"<10 %"} (except when a report about a clean runway is issued)
                </div>
            </div>
        </div >
    );
} 