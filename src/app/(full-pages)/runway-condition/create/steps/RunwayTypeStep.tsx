import { MinusCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Radio } from "antd";
import { CircleDot } from "lucide-react";

export default function RunwayTypeStep({ field, fieldKey, remove, value, setValue }: any) {
    return (
        <div className="flex gap-2 p-8 bg-white dark:bg-dark-2 rounded shadow mb-4">
            <div className="w-1/2">
                <div className="flex justify-between">
                    <div className="">
                        <div className="text-xl font-semibold mb-2">Runway Third #{fieldKey + 1}</div>
                        <div>For coverage zones of 25% or less, enter code 6</div>
                    </div>
                </div>
                <Divider size="small" />
                <Form.Item {...field} name={[field.name, 'partNumber']} label="Part Number" rules={[{ required: true }]}> <Input type="number" /> </Form.Item>
                {/* Coverage selection UI */}
                <Form.Item
                    name={[field.name, 'contaminationCoverage']}
                    style={{ display: 'none' }}
                >
                    <Input />
                </Form.Item>
                <div className="bg-white w-full dark:bg-dark-2 px-6 rounded shadow flex flex-col gap-4 mb-4">
                    <div>Evaluate the % coverage of runway contamination for each third of the runway</div>
                    <div className="flex flex-col gap-2">
                        <div
                            onClick={() => setValue(fieldKey, 'LESS_THAN_10_PERCENT')}
                            className={`border rounded-md ${value === 'LESS_THAN_10_PERCENT' && "border-[#3C50E0]"} p-2 flex flex-col gap-2 max-w-[400px] cursor-pointer`}
                        >
                            <div className="flex items-center gap-2">
                                <CircleDot color={value === 'LESS_THAN_10_PERCENT' ? `#3C50E0` : "#fff"} />
                                <div className="text-green-500">{"< 10% Coverage"}</div>
                            </div>
                            <div>RWYCC – 6 for this third, no contamination reported</div>
                        </div>
                        <div
                            onClick={() => setValue(fieldKey, 'BETWEEN_10_AND_25_PERCENT')}
                            className={`border rounded-md ${value === 'BETWEEN_10_AND_25_PERCENT' && "border-[#3C50E0]"} p-2 flex flex-col max-w-[400px] cursor-pointer`}
                        >
                            <div className="flex items-center gap-2">
                                <CircleDot color={value === 'BETWEEN_10_AND_25_PERCENT' ? `#3C50E0` : "#fff"} />
                                <div className="text-red-500">{"≥ 10% - ≤ 25% Coverage"}</div>
                            </div>
                            <div>RWYCC – 6 for this third. Report contamination for 25% coverage zone</div>
                        </div>
                        <div
                            onClick={() => setValue(fieldKey, 'GREATER_THAN_25_PERCENT')}
                            className={`border rounded-md ${value === 'GREATER_THAN_25_PERCENT' && "border-[#3C50E0]"} p-2 flex flex-col max-w-[400px] cursor-pointer`}
                        >
                            <div className="flex items-center gap-2">
                                <CircleDot color={value === 'GREATER_THAN_25_PERCENT' ? `#3C50E0` : "#fff"} />
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
                <Form.Item {...field} name={[field.name, 'surfaceCondition']} label="Surface" rules={[{ required: true }]}> <Radio.Group>
                    <Radio value="DRY">DRY</Radio>
                    <Radio value="WET">WET</Radio>
                    <Radio value="ICE">ICE</Radio>
                    <Radio value="SNOW">SNOW</Radio>
                </Radio.Group> </Form.Item>
                <Form.Item {...field} name={[field.name, 'depthMm']} label="Depth (mm)" rules={[{ required: true }]}> <Input type="number" /> </Form.Item>
                <Form.Item {...field} name={[field.name, 'frictionCoefficient']} label="Friction" rules={[{ required: true }]}> <Input type="number" /> </Form.Item>
                <Form.Item {...field} name={[field.name, 'rwycValue']} label="RWYC Value" rules={[{ required: true }]}> <Input type="number" /> </Form.Item>
                <Form.Item {...field} name={[field.name, 'temperatureCelsius']} label="Temp (C)" rules={[{ required: true }]}> <Input type="number" /> </Form.Item>
                <Button icon={<MinusCircleOutlined />} onClick={() => remove(field.name)} danger type="dashed" className="mt-2">Remove</Button>
            </div>
        </div>
    );
} 