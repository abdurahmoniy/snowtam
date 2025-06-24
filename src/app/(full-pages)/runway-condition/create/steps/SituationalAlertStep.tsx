import { useQuery } from "@tanstack/react-query";
import { Select } from "antd";
import { GetAlertTypes } from "../../../../../services/enums";

export default function SituationalAlertStep() {
    const AlertTypesData = useQuery({
        queryFn: () => GetAlertTypes(),
        queryKey: ['alert-types']
    });

    console.log(AlertTypesData.data?.data)
    return (
        <div className="p-8 bg-white dark:bg-dark-2 rounded shadow">
            <div className="text-xl font-semibold mb-4">Situational Alert</div>
            <div className="">Alert type</div>
            <Select>
                {AlertTypesData.data?.data.map((item, i) => (
                    <Select.Option key={i}>
                        {item}
                    </Select.Option>
                ))}
            </Select>
        </div>
    );
} 