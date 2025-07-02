"use client"

import { RunwayConditionCreateRequest } from "@/types/runway-condition";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery } from "@tanstack/react-query";
import { Button, DatePicker, Form, Input, RadioChangeEvent, Select, Steps } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GetAlertTypes, GetProcedureTypes } from "../../../../services/enums";
import NewRunWay3 from "../_components/NewRunWay3";
import { useCreateRunwayCondition } from "./fetch";
import ReviewStep from "./steps/ReviewStep";
import RunwayConditionInfoStep from "./steps/RunwayConditionInfoStep";

export default function RunwayConditionCreate() {
    const [form] = Form.useForm<RunwayConditionCreateRequest>();
    const { mutate, isPending, isSuccess, isError, error } = useCreateRunwayCondition();
    const router = useRouter()
    const [value, setValue] = useState(1);
    const [currentStep, setCurrentStep] = useState(1);
    const [formValues, setFormValues] = useState(form.getFieldsValue());
    const [coverageSelections, setCoverageSelections] = useState<{ [key: number]: string }>({});

    const AlertTypesData = useQuery({
        queryFn: () => GetAlertTypes(),
        queryKey: ['alert-types']
    });

    const ProcedureTypesData = useQuery({
        queryFn: () => GetProcedureTypes(),
        queryKey: ['procedure-types']
    });

    const steps = [
        {
            title: 'Runway Condition Info',
            content: <RunwayConditionInfoStep form={form} value={value} setValue={setValue} />,
        },
        {
            title: 'Runway Thirds',
            content: (<NewRunWay3 />
                // <Form.List name="runwayThirds">
                //     {(fields, { add, remove }) => (
                //         <div>
                //             {fields.map((field, idx) => (
                //                 <RunwayTypeStep
                //                     key={field.key}
                //                     field={field}
                //                     fieldKey={idx}
                //                     remove={remove}
                //                     value={coverageSelections[idx]}
                //                     setValue={(index: number, val: string) => {
                //                         setCoverageSelections(prev => ({ ...prev, [index]: val }));
                //                         const thirds = form.getFieldValue('runwayThirds') || [];
                //                         if (thirds[index]) {
                //                             thirds[index].contaminationCoverage = val;
                //                             form.setFieldsValue({ runwayThirds: thirds });
                //                         }
                //                     }}
                //                 />
                //             ))}
                //             <Button icon={<PlusOutlined />} onClick={() => add()} type="dashed" style={{ width: '100%' }}>Add Runway Third</Button>
                //         </div>
                //     )}
                // </Form.List>
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
                                    <Form.Item {...restField} name={[name, 'notificationType']} label="Type" rules={[{ required: true, message: 'Please select notification type' }]}>
                                        <Select size="large" placeholder="Choose notification type">
                                            {AlertTypesData.data?.data.map((item, i) => (
                                                <Select.Option key={i} value={String(item)}>
                                                    {item}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item {...restField} name={[name, 'runwayLengthReductionM']} label="Length Reduction (m)" rules={[{ required: true, message: 'Please enter length reduction' }, { min: 0, message: 'Length must be positive' }]}>
                                        <Input size="large" type="number" />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[name, 'additionalDetails']} label="Details">
                                        <Input size="large" />
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
                                    <Form.Item {...restField} name={[name, 'procedureType']} label="Type" rules={[{ required: true, message: 'Please select procedure type' }]}>
                                        <Select size="large" placeholder="Choose procedure type">
                                            {ProcedureTypesData.data?.data.map((item, i) => (
                                                <Select.Option key={i} value={item}>
                                                    {item}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item {...restField} name={[name, 'applicationTime']} label="Time" rules={[{ required: true, message: 'Please select application time' }]}>
                                        <DatePicker size="large" showTime />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[name, 'effectivenessRating']} label="Effectiveness" rules={[{ required: true, message: 'Please enter effectiveness rating' }, { min: 1, max: 10, message: 'Rating must be between 1-10' }]}>
                                        <Input size="large" type="number" />
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
            title: 'Review',
            content: <ReviewStep values={formValues} />
        },
    ];

    const next = async () => {
        try {
            // Validate current step before proceeding
            if (currentStep === 0) {
                // Validate Runway Condition Info step
                await form.validateFields([
                    'airportCode',
                    'runwayDesignation',
                    'reportDateTime',
                    'ambientTemperature',
                    'initials',
                    'rwycCode',
                    'overallConditionCode'
                ]);
            } else if (currentStep === 1) {
                // Validate Runway Thirds step
                const runwayThirds = form.getFieldValue('runwayThirds') || [];
                if (runwayThirds.length === 0) {
                    throw new Error('At least one runway third is required');
                }

                // Check if at least one runway third has all required fields
                let hasValidThird = false;
                for (let i = 0; i < runwayThirds.length; i++) {
                    const third = runwayThirds[i];
                    if (third &&
                        third.partNumber &&
                        third.contaminationCoverage &&
                        third.surfaceCondition &&
                        third.depthMm !== null && third.depthMm !== undefined &&
                        third.frictionCoefficient !== null && third.frictionCoefficient !== undefined &&
                        third.rwycValue !== null && third.rwycValue !== undefined &&
                        third.temperatureCelsius !== null && third.temperatureCelsius !== undefined) {
                        hasValidThird = true;
                        break;
                    }
                }

                if (!hasValidThird) {
                    throw new Error('At least one runway third must have all required fields filled');
                }

                // Validate all filled runway thirds
                for (let i = 0; i < runwayThirds.length; i++) {
                    const third = runwayThirds[i];
                    if (third && third.partNumber) { // Only validate if third exists and has partNumber
                        await form.validateFields([
                            ['runwayThirds', i, 'partNumber'],
                            ['runwayThirds', i, 'contaminationCoverage'],
                            ['runwayThirds', i, 'surfaceCondition'],
                            ['runwayThirds', i, 'depthMm'],
                            ['runwayThirds', i, 'frictionCoefficient'],
                            ['runwayThirds', i, 'rwycValue'],
                            ['runwayThirds', i, 'temperatureCelsius']
                        ]);
                    }
                }
            } else if (currentStep === 2) {
                // Validate Situational Notifications step
                const notifications = form.getFieldValue('situationalNotifications') || [];
                for (let i = 0; i < notifications.length; i++) {
                    await form.validateFields([
                        ['situationalNotifications', i, 'notificationType'],
                        ['situationalNotifications', i, 'runwayLengthReductionM']
                    ]);
                }
            } else if (currentStep === 3) {
                // Validate Improvement Procedures step
                const procedures = form.getFieldValue('improvementProcedures') || [];
                for (let i = 0; i < procedures.length; i++) {
                    await form.validateFields([
                        ['improvementProcedures', i, 'procedureType'],
                        ['improvementProcedures', i, 'applicationTime'],
                        ['improvementProcedures', i, 'effectivenessRating']
                    ]);
                }
            }

            // If validation passes, proceed to next step
            if (currentStep === steps.length - 2) {
                setFormValues(form.getFieldsValue(true));
            }
            setCurrentStep(currentStep + 1);
        } catch (error) {
            console.error('Validation failed:', error);
            // Form validation errors will be displayed automatically by Ant Design
        }
    };
    const prev = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleFinish = async (values: any) => {
        console.log('handleFinish called with values:', values);

        try {
            // Get all form values including nested arrays
            const allFormValues = form.getFieldsValue(true);
            console.log('All form values from form.getFieldsValue(true):', allFormValues);

            // Use the complete form values instead of just the passed values
            const formData = allFormValues || values;
            console.log('Form data to process:', formData);

            // Process dates and convert to ISO strings
            const processedValues = {
                ...formData,
                reportDateTime: formData.reportDateTime?.toISOString?.() || new Date().toISOString(),
                ambientTemperature: Number(formData.ambientTemperature) || 0,
                overallConditionCode: Number(formData.overallConditionCode) || 0,
                runwayThirds: (formData.runwayThirds || []).map((third: any) => ({
                    ...third,
                    partNumber: Number(third.partNumber) || 0,
                    depthMm: Number(third.depthMm) || 0,
                    frictionCoefficient: Number(third.frictionCoefficient) || 0,
                    rwycValue: Number(third.rwycValue) || 0,
                    temperatureCelsius: Number(third.temperatureCelsius) || 0
                })),
                situationalNotifications: (formData.situationalNotifications || []).map((notification: any) => ({
                    ...notification,
                    runwayLengthReductionM: Number(notification.runwayLengthReductionM) || 0,
                })),
                improvementProcedures: (formData.improvementProcedures || []).map((procedure: any) => ({
                    ...procedure,
                    applicationTime: procedure.applicationTime?.toISOString?.() || new Date().toISOString(),
                    effectivenessRating: Number(procedure.effectivenessRating) || 0
                }))
            };

            console.log('Final processed payload:', processedValues);
            mutate(processedValues);
        } catch (error) {
            console.error('Error processing form values:', error);
        }
    };

    const onChange = (e: RadioChangeEvent) => {
        setValue(e.target.value);
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("Runway condition created successfully!");
            router.push('/')
        }
    }, [isSuccess]);

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
                    ambientTemperature: null,
                    initials: "",
                    rwycCode: "",
                    overallConditionCode: null,
                    remarks: "",
                    runwayThirds: [{
                        partNumber: 1,
                        contaminationCoverage: "LESS_THAN_10_PERCENT",
                        surfaceCondition: "DRY",
                        depthMm: 0,
                        frictionCoefficient: 1,
                        rwycValue: 6,
                        temperatureCelsius: 0
                    }],
                    situationalNotifications: [{
                        notificationType: null,
                        runwayLengthReductionM: 0,
                        additionalDetails: ""
                    }],
                    improvementProcedures: [{
                        procedureType: null,
                        applicationTime: "",
                        effectivenessRating: 0
                    }],
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