import { useQuery } from "@tanstack/react-query";
import { DatePicker, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { GetAlertTypes, GetProcedureTypes } from "../../../../../services/enums";

export default function SituationalAlertStep() {
    const AlertTypesData = useQuery({
        queryFn: () => GetAlertTypes(),
        queryKey: ['alert-types']
    });

    const ProcedureTypesData = useQuery({
        queryFn: () => GetProcedureTypes(),
        queryKey: ['procedure-types']
    });

    return (
        <div className="w-full flex p-8 bg-white dark:bg-dark-2 rounded shadow">
            <div className="w-1/2">
                <div className="text-xl font-semibold mb-4">Situational Alert</div>
                <div className="space-y-4">
                    <div className="">
                        <div className="mb-2">Alert type</div>
                        <Select className="w-[300px]" size="large" placeholder="Choose alert type">
                            {AlertTypesData.data?.data.map((item, i) => (
                                <Select.Option key={i}>
                                    {item}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                    <div className="">
                        <div className="mb-2">Runway Length Reduction M</div>
                        <Input size="large" className="w-[300px]" />
                    </div>
                    <div className="">
                        <div className="mb-2">Additional details</div>
                        <TextArea size="large" className="w-[300px]" />
                    </div>
                </div>
            </div>
            <div className="w-1/2">
                <div className="text-xl font-semibold mb-4">Procedures</div>
                <div className="space-y-4">
                    <div className="">
                        <div className="mb-2">Procedure type</div>
                        <Select className="w-[300px]" size="large" placeholder="Choose procedure type">
                            {ProcedureTypesData.data?.data.map((item, i) => (
                                <Select.Option key={i}>
                                    {item}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                    <div className="">
                        <div className="mb-2">Application time</div>
                        <DatePicker size="large" className="w-[300px]" />
                    </div>
                    <div className="">
                        <div className="mb-2">Effectiveness rating</div>
                        <Input size="large" className="w-[300px]" />
                    </div>
                </div>
            </div>
        </div>
    );
} 