import { Divider, Input, Radio } from "antd";

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
                <div className="text-lg">Surface condition</div>
                <Radio.Group defaultValue="DRY">
                    <Radio value="DRY">DRY</Radio>
                    <Radio value="WET">WET</Radio>
                    <Radio value="ICE">ICE</Radio>
                    <Radio value="SNOW">SNOW</Radio>
                </Radio.Group>
            </div>
            <div className="w-1/2">
                <div className="text-xl font-semibold mb-2">{type}/3 of Runway</div>
                <div>For coverage zones of 25% or less, enter code 6</div>
            </div>
        </div>
    );
} 