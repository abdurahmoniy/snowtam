// src/app/(full-pages)/airports/_components/AddRunwayModal.tsx

"use client";

import { Modal, Form, Input, InputNumber, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateRunway } from "@/services/runway.services";
import type { IRunwayCreateDto } from "@/types/runway";

interface AddRunwayModalProps {
  open: boolean;
  onClose: () => void;
  airportId: number;
}

export default function AddRunwayModal({
  open,
  onClose,
  airportId,
}: AddRunwayModalProps) {
  const [form] = Form.useForm<IRunwayCreateDto>();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: IRunwayCreateDto) => CreateRunway(data),
    onSuccess: () => {
      message.success("ВПП добавлен");
      form.resetFields();
      // обновим список аэропортов
      queryClient.invalidateQueries({ queryKey: ["airports-list"] });
      onClose();
    },
    onError: () => {
      message.error("Не удалось добавить ВПП");
    },
  });

  const handleOk = () => {
    form.validateFields().then((values) => {
      mutation.mutate({ ...values, airportId });
    });
  };

  return (
    <Modal
      title="Добавить ВПП"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText="Добавить"
      cancelText="Отмена"
      confirmLoading={mutation.isPending}
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Название" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="runwayDesignation"
          label="Обозначение"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="length" label="Длина, м" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="width" label="Ширина, м" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="longitude" label="Долгота" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="latitude" label="Широта" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
