"use client"

import { RunwayConditionCreateRequest } from "@/types/runway-condition";
import { Button, Form, RadioChangeEvent, Steps } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useCreateRunwayCondition } from "./fetch";
import ProceduresStep from "./steps/ProceduresStep";
import RunwayConditionInfoStep from "./steps/RunwayConditionInfoStep";
import RunwayTypeStep from "./steps/RunwayTypeStep";
import SituationalAlertStep from "./steps/SituationalAlertStep";

export default function RunwayConditionCreate() {
    const [form] = Form.useForm<RunwayConditionCreateRequest>();
    const { mutate, isPending, isSuccess, isError, error } = useCreateRunwayCondition();

    const [value, setValue] = useState(1);
    const [currentStep, setCurrentStep] = useState(0);
    const steps = [
        {
            title: 'Runway Condition Info',
            content: <RunwayConditionInfoStep form={form} value={value} setValue={setValue} />,
        },
        {
            title: 'Runway type 1',
            content: <RunwayTypeStep value={value} setValue={setValue} type={1} />,
        },
        {
            title: 'Runway type 2',
            content: <RunwayTypeStep value={value} setValue={setValue} type={2} />,
        },
        {
            title: 'Runway type 3',
            content: <RunwayTypeStep value={value} setValue={setValue} type={3} />,
        },
        {
            title: 'Situational alert',
            content: <SituationalAlertStep />,
        },
        // {
        //     title: 'Procedures',
        //     content: <ProceduresStep />,
        // },
    ];

    const next = () => {
        setCurrentStep(currentStep + 1);
    };
    const prev = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleFinish = (values: any) => {
        // Convert date to ISO string
        const payload: RunwayConditionCreateRequest = {
            ...values,
            reportDateTime: values.reportDateTime?.toISOString?.() || new Date().toISOString(),
            ambientTemperature: Number(values.ambientTemperature),
            overallConditionCode: Number(values.overallConditionCode),
        };
        mutate(payload);
    };

    const onChange = (e: RadioChangeEvent) => {
        setValue(e.target.value);
    };

    return (
        <div>
            {/* <div className="text-2xl mb-4">Create new runway condition</div> */}
            <Steps progressDot current={currentStep} className="mb-8" items={steps.map(s => ({ title: s.title }))} />
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    airportCode: "",
                    runwayDesignation: "",
                    reportDateTime: dayjs(),
                    ambientTemperature: 0,
                    initials: "",
                    rwycCode: "",
                    overallConditionCode: 0,
                    remarks: "",
                }}
                className=""
            >
                {steps[currentStep].content}
                <Form.Item>
                    <div className="flex justify-between mt-4">
                        {currentStep > 0 && (
                            <Button onClick={prev} size="large">
                                Previous
                            </Button>
                        )}
                        <div className="flex gap-2 ml-auto">
                            {/* Only show submit on last step */}
                            {currentStep === steps.length - 1 && (
                                <Button
                                    type="primary"
                                    loading={isPending}
                                    htmlType="submit"
                                    size="large"
                                >
                                    {isPending ? "Submitting..." : "Create"}
                                </Button>
                            )}
                            {/* For future steps, show Next button */}
                            {currentStep < steps.length - 1 && (
                                <Button type="primary" onClick={next} size="large">
                                    Next
                                </Button>
                            )}
                        </div>
                    </div>
                    {isSuccess && <div className="text-green-600 mt-2">Runway condition created successfully!</div>}
                    {isError && <div className="text-red-600 mt-2">{error?.message || "Error creating runway condition."}</div>}
                </Form.Item>
            </Form>
        </div>
    );
}