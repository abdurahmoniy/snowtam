"use client"

import { RunwayConditionCreateRequest } from "@/types/runway-condition";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, RadioChangeEvent, Steps } from "antd";
import { useState } from "react";
import { useCreateRunwayCondition } from "./fetch";
import ReviewStep from "./steps/ReviewStep";
import RunwayConditionInfoStep from "./steps/RunwayConditionInfoStep";
import RunwayTypeStep from "./steps/RunwayTypeStep";
import SituationalAlertStep from "./steps/SituationalAlertStep";

export default function RunwayConditionCreate() {
    const [form] = Form.useForm<RunwayConditionCreateRequest>();
    const { mutate, isPending, isSuccess, isError, error } = useCreateRunwayCondition();

    const [value, setValue] = useState(1);
    const [currentStep, setCurrentStep] = useState(0);
    const [formValues, setFormValues] = useState(form.getFieldsValue());
    const [coverageSelections, setCoverageSelections] = useState<{ [key: number]: string }>({});
    const steps = [
        {
            title: 'Runway Condition Info',
            content: <RunwayConditionInfoStep form={form} value={value} setValue={setValue} />,
        },
        {
            title: 'Runway Thirds',
            content: (
                <Form.List name="runwayThirds">
                    {(fields, { add, remove }) => (
                        <div>
                            {fields.map((field, idx) => (
                                <RunwayTypeStep
                                    key={field.key}
                                    field={field}
                                    fieldKey={idx}
                                    remove={remove}
                                    value={coverageSelections[idx]}
                                    setValue={(index: number, val: string) => {
                                        setCoverageSelections(prev => ({ ...prev, [index]: val }));
                                        const thirds = form.getFieldValue('runwayThirds') || [];
                                        if (thirds[index]) {
                                            thirds[index].contaminationCoverage = val;
                                            form.setFieldsValue({ runwayThirds: thirds });
                                        }
                                    }}
                                />
                            ))}
                            <Button icon={<PlusOutlined />} onClick={() => add()} type="dashed" style={{ width: '100%' }}>Add Runway Third</Button>
                        </div>
                    )}
                </Form.List>
            )
        },
        {
            title: 'Situational Notifications',
            content: (
                <Form.List name="situationalNotifications">
                    {(fields, { add, remove }) => (
                        <div>
                            {fields.map(({ key, name, ...restField }) => (
                                <div key={key} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                    <Form.Item {...restField} name={[name, 'notificationType']} label="Type" rules={[{ required: true }]}>
                                        <input placeholder="REDUCED_RUNWAY_LENGTH" />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[name, 'runwayLengthReductionM']} label="Length Reduction (m)" rules={[{ required: true }]}>
                                        <input type="number" />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[name, 'isActive']} label="Active" valuePropName="checked">
                                        <input type="checkbox" />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[name, 'additionalDetails']} label="Details">
                                        <input />
                                    </Form.Item>
                                    <Button icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
                                </div>
                            ))}
                            <Button icon={<PlusOutlined />} onClick={() => add()} type="dashed" style={{ width: '100%' }}>Add Notification</Button>
                        </div>
                    )}
                </Form.List>
            )
        },
        {
            title: 'Improvement Procedures',
            content: (
                <Form.List name="improvementProcedures">
                    {(fields, { add, remove }) => (
                        <div>
                            {fields.map(({ key, name, ...restField }) => (
                                <div key={key} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                    <Form.Item {...restField} name={[name, 'procedureType']} label="Type" rules={[{ required: true }]}>
                                        <input placeholder="MECHANICAL_CLEANING" />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[name, 'applicationTime']} label="Time" rules={[{ required: true }]}>
                                        <input type="datetime-local" />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[name, 'isApplied']} label="Applied" valuePropName="checked">
                                        <input type="checkbox" />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[name, 'effectivenessRating']} label="Effectiveness" rules={[{ required: true }]}>
                                        <input type="number" />
                                    </Form.Item>
                                    <Button icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
                                </div>
                            ))}
                            <Button icon={<PlusOutlined />} onClick={() => add()} type="dashed" style={{ width: '100%' }}>Add Procedure</Button>
                        </div>
                    )}
                </Form.List>
            )
        },
        {
            title: 'Situational alert',
            content: <SituationalAlertStep />,
        },
        {
            title: 'Review',
            content: <ReviewStep values={formValues} />
        },
    ];

    const next = () => {
        if (currentStep === steps.length - 2) {
            setFormValues(form.getFieldsValue(true));
        }
        setCurrentStep(currentStep + 1);
    };
    const prev = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleFinish = (values: any) => {
        // Convert date to ISO string
        const payload = {
            ...values,
            reportDateTime: values.reportDateTime?.toISOString?.() || new Date().toISOString(),
            ambientTemperature: Number(values.ambientTemperature),
            overallConditionCode: Number(values.overallConditionCode),
            runwayThirds: values.runwayThirds || [],
            situationalNotifications: values.situationalNotifications || [],
            improvementProcedures: values.improvementProcedures || [],
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
                    reportDateTime: "",
                    ambientTemperature: 0,
                    initials: "",
                    rwycCode: "",
                    overallConditionCode: 0,
                    remarks: "",
                    runwayThirds: [],
                    situationalNotifications: [],
                    improvementProcedures: [],
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