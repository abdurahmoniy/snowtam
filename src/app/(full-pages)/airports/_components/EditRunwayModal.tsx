// src/app/(full-pages)/airports/_components/EditRunwayModal.tsx

"use client";

import { useEffect } from "react";
import { Modal, Form, Input, InputNumber, message, Spin } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateRunway } from "@/services/runway.services";
import IAirportRunaway from "@/types/airport";
import { IRunwayUpdateDto } from "@/types/runway";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  runway: IAirportRunaway | null;
  airportId: number;
}

export default function EditRunwayModal({
  open,
  onClose,
  onSuccess,
  runway,
  airportId,
}: Props) {
  const [form] = Form.useForm<IRunwayUpdateDto>();
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: IRunwayUpdateDto) => UpdateRunway(data),
    onSuccess: () => {
      message.success("ВПП обновлён");
      form.resetFields();
      qc.invalidateQueries({ queryKey: ["airport"] });
      onSuccess();
      onClose();
    },
    onError: () => {
      message.error("Не удалось обновить ВПП");
    },
  });

  useEffect(() => {
    if (runway) {
      form.setFieldsValue({
        id: runway.id,
        name: runway.name,
        runwayDesignation: runway.runwayDesignation ?? "",
        length: runway.length ?? undefined,
        width: runway.width,
        longitude: runway.longitude ?? undefined,
        latitude: runway.latitude ?? undefined,
        airportId, // обязательно передаём airportId
      });
    }
  }, [runway, airportId, form]);

  const handleOk = () => {
    form.validateFields().then((vals) => mutation.mutate(vals));
  };

  return (
    <Modal
      title="Редактировать ВПП"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText="Сохранить"
      cancelText="Отмена"
      confirmLoading={mutation.isPending}
      centered
    >
      {!runway ? (
        <Spin />
      ) : (
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
          <Form.Item
            name="length"
            label="Длина, м"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="width"
            label="Ширина, м"
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
          {/* скрытое поле airportId */}
          <Form.Item name="airportId" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}
