import { Divider, Input, Radio, Select } from "antd";

interface RunwayTypeStepProps {
    type: 1 | 2 | 3;
}

export default function RunwayTypeStep({ type }: RunwayTypeStepProps) {
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
            <div className="w-1/2">

            </div>
        </div >
    );
} 