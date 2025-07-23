// src/components/EditAirportModal.tsx

"use client";

import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, message, Popconfirm, Button } from "antd";
import { useMutation } from "@tanstack/react-query";
import { DeleteAirport, UpdateAirport } from "@/services/airport.services";
import type { IAirport, IAirportUpdateDto } from "@/types/airport";
import type { MainResponse } from "@/types/auth";

interface EditAirportModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  airport: IAirport | null;
}

export default function EditAirportModal({
  open,
  onClose,
  onSuccess,
  airport,
}: EditAirportModalProps) {
  const [form] = Form.useForm<IAirportUpdateDto>();

  // Заполняем форму при открытии модалки
  useEffect(() => {
    if (airport) {
      form.setFieldsValue({
        id: airport.id,
        name: airport.name,
        initialName: airport.initialName,
        airportCode: airport.airportCode,
        temperature: airport.temperature,
        longitude: airport.longitude,
        latitude: airport.latitude,
      });
    }
  }, [airport, form]);

  const mutation = useMutation<MainResponse<IAirport>, Error, IAirportUpdateDto>({
    mutationFn: (data) => UpdateAirport(data),
    onSuccess: () => {
      message.success("Аэропорт успешно обновлён");
      form.resetFields();
      onSuccess();
      onClose();
    },
    onError: () => {
      message.error("Не удалось обновить аэропорт");
    },
  });

  const deleteAirport = useMutation<MainResponse<void>, Error, number>({
    mutationFn: (id) => DeleteAirport(id),
    onSuccess: () => {
      message.success("Аэропорт удалён");
      form.resetFields();
      onSuccess();
      onClose();
    },
    onError: () => {
      message.error("Не удалось удалить аэропорт");
    },
  });

  const handleOk = () => {
    form.validateFields().then((values) => {
      mutation.mutate(values);
    });
  };




  const handleDelete = () => {
    if (airport) {
      deleteAirport.mutate(airport.id);
    }
  };

  return (
    <Modal
      title="Редактировать аэропорт"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={mutation.isPending}
      okText="Сохранить"
      cancelText="Отменить"
      centered
      footer={(
        <div className="flex justify-between w-full">
          {/* DELETE button on the left */}
          <Popconfirm
            title="Вы уверены, что хотите удалить этот аэропорт?"
            onConfirm={handleDelete}
            okText="Да"
            cancelText="Нет"
          >
            <Button danger type="primary" loading={deleteAirport.isPending}>
              Удалить
            </Button>
          </Popconfirm>

          <div>
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Отменить
            </Button>
            <Button
              type="primary"
              onClick={handleOk}
              loading={mutation.isPending}
            >
              Сохранить
            </Button>
          </div>
        </div>
      )}
    >
      <Form form={form} layout="vertical">
        {/* Скрытое поле id */}
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

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
