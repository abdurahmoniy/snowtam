import { DatePicker, Form, Input, InputNumber } from "antd";
import { CircleDot } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface RunwayConditionInfoStepProps {
    form: any;
    value: number;
    setValue: Dispatch<SetStateAction<number>>;
}

export default function RunwayConditionInfoStep({ form, value, setValue }: RunwayConditionInfoStepProps) {
    return (
        <div className="w-full flex gap-2">
            <div className="bg-white w-1/2 dark:bg-dark-2 p-6 rounded shadow flex gap-4">
                <div className="w-1/2">
                    <Form.Item
                        label="Airport Code"
                        name="airportCode"
                        rules={[{ required: true, message: "Please enter airport code" }]}
                    >
                        <Input placeholder="Enter airport code" />
                    </Form.Item>
                    <Form.Item
                        label="Runway Designation"
                        name="runwayDesignation"
                        rules={[{ required: true, message: "Please enter runway designation" }]}
                    >
                        <Input placeholder="Enter runway designation" />
                    </Form.Item>
                    <Form.Item
                        label="Report DateTime"
                        name="reportDateTime"
                        rules={[{ required: true, message: "Please select date and time" }]}
                    >
                        <DatePicker
                            showTime
                            style={{ width: "100%" }}
                            format="YYYY-MM-DDTHH:mm"
                            placeholder="Select date and time"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Ambient Temperature (°C)"
                        name="ambientTemperature"
                        rules={[{ required: true, message: "Please enter temperature" }]}
                    >
                        <InputNumber style={{ width: "100%" }} placeholder="Enter temperature" />
                    </Form.Item>
                </div>
                <div className="w-1/2">
                    <Form.Item
                        label="Initials"
                        name="initials"
                        rules={[{ required: true, message: "Please enter initials" }]}
                    >
                        <Input placeholder="Enter initials" />
                    </Form.Item>
                    <Form.Item
                        label="RWYC Code"
                        name="rwycCode"
                        rules={[{ required: true, message: "Please enter RWYC code" }]}
                    >
                        <Input placeholder="Enter RWYC code" />
                    </Form.Item>
                    <Form.Item
                        label="Overall Condition Code"
                        name="overallConditionCode"
                        rules={[{ required: true, message: "Please enter overall condition code" }]}
                    >
                        <InputNumber style={{ width: "100%" }} placeholder="Enter overall condition code" />
                    </Form.Item>
                    <Form.Item label="Remarks" name="remarks">
                        <Input.TextArea placeholder="Enter remarks" rows={1} />
                    </Form.Item>
                </div>
            </div>
            <div className="bg-white w-1/2 dark:bg-dark-2 p-6 rounded shadow flex flex-col gap-4">
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
        </div>
    );
} 