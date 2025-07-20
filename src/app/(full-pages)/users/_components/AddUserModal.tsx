// src/app/users/_components/AddUserModal.tsx

"use client";

import {
  Modal,
  Form,
  Input,
  Select,
  message,
  Spin,
} from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SignUp } from "@/services/auth.services";
import { GetAllAirports } from "@/services/airport.services";
import type { IAirport } from "@/types/airport";
import type { SignUpRequest } from "@/types/auth";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  roleOptions: { label: string; value: string }[];
}

export default function AddUserModal({
  open,
  onClose,
  onSuccess,
  roleOptions,
}: Props) {
  const [form] = Form.useForm<SignUpRequest>();

  const { data: airports, isLoading: loadingAirports } = useQuery({
    queryKey: ["airports-for-signup"],
    queryFn: () => GetAllAirports({ page: 0, size: 100 }),
  });

  const mutation = useMutation({
    mutationFn: SignUp,
    onSuccess: () => {
      toast.success("Пользователь зарегистрирован");
      form.resetFields();
      onSuccess();
      onClose();
    },
    onError: () => {
      toast.error("Ошибка при регистрации пользователя");
    },
  });

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      mutation.mutate(values);
    });
  };

  return (
    <Modal
      title="Регистрация пользователя"
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      okText="Создать"
      cancelText="Отмена"
      confirmLoading={mutation.isPending}
      centered
    >
      {loadingAirports ? (
        <Spin />
      ) : (
        <Form form={form} layout="vertical">
          <Form.Item
            name="fullName"
            label="ФИО"
            rules={[{ required: true }]}
            className="mb-3"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
            className="mb-3"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Пароль"
            rules={[{ required: true }]}
            className="mb-3"
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="position"
            label="Должность"
            rules={[{ required: true }]}
            className="mb-3"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="airportId"
            label="Аэропорт"
            rules={[{ required: true }]}
            className="mb-3"
          >
            <Select
              options={airports?.data.map((a: IAirport) => ({
                label: a.initialName,
                value: a.id,
              }))}
              placeholder="Выберите аэропорт"
              showSearch
              filterOption={(input, option) =>
                (option?.label as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            name="roleId"
            label="Роль"
            rules={[{ required: true }]}
            className="mb-3"
          >
            <Select
              options={roleOptions}
              placeholder="Выберите роль"
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}
