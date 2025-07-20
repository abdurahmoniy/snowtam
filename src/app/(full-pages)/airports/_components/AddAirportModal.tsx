"use client";

import React from "react";
import { Modal, Form, Input, InputNumber, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { CreateAirport } from "@/services/airport.services";
import type { IAirport, IAirportCreateDto } from "@/types/airport";
import { MainResponse } from "@/types/auth";

interface AddAirportModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddAirportModal({
    open,
    onClose,
    onSuccess,
}: AddAirportModalProps) {
    const [form] = Form.useForm<IAirportCreateDto>();

    const mutation = useMutation<MainResponse<IAirport>, Error, IAirportCreateDto>({
        mutationFn: (data) => CreateAirport(data),
        onSuccess: () => {
            message.success("Аэропорт успешно добавлен");
            form.resetFields();
            onSuccess();
            onClose();
        },
        onError: () => {
            message.error("Не удалось добавить аэропорт");
        },
    }
    );

    const handleOk = () => {
        form.validateFields().then((values) => {
            mutation.mutate(values);
        });
    };

    return (
        <Modal
            title="Добавить аэропорт"
            open={open}
            onOk={handleOk}
            onCancel={onClose}
            confirmLoading={mutation.isPending}
            okText="Добавить"
            cancelText="Отменить"
            centered
        >
            <Form form={form} layout="vertical">
                <Form.Item name="name" label="Название" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item
                    name="initialName"
                    label="Краткое название"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="airportCode"
                    label="Код аэропорта"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="temperature"
                    label="Температура"
                    rules={[{ required: true }]}
                >
                    <InputNumber style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    name="longitude"
                    label="Долгота"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="latitude"
                    label="Широта"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}
