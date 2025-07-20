"use client";

import { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  message,
  Spin,
} from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UpdateUser } from "@/services/user.services";
import { GetAllAirports } from "@/services/airport.services";
import type { IAirport } from "@/types/airport";
import type { IUser } from "@/types/user.auth";
import { toast } from "sonner";

interface Props {
  open: boolean;
  user: IUser | null;
  onClose: () => void;
  onSuccess: () => void;
  roleOptions: { label: string; value: string }[];
  statusOptions: { label: string; value: string }[];
}

export default function EditUserModal({
  open,
  user,
  onClose,
  onSuccess,
  roleOptions,
  statusOptions,
}: Props) {
  const [form] = Form.useForm();

  const { data: airports, isLoading: loadingAirports } = useQuery({
    queryKey: ["airports-for-edit"],
    queryFn: () => GetAllAirports({ page: 0, size: 100 }),
  });

  const mutation = useMutation({
    mutationFn: UpdateUser,
    onSuccess: () => {
      toast.success("Пользователь успешно обновлён");
      form.resetFields();
      onSuccess();
      onClose();
    },
    onError: () => {
      toast.error("Ошибка при обновлении пользователя");
    },
  });

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullname: user.fullname,
        email: user.email,
        position: user.position,
        airportId: user.airportDto?.id,
        role: user.role[0] || "",
        status: user.status,
      });
    }
  }, [user, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      mutation.mutate({
        id: user!.id,
        fullname: values.fullname,
        position: values.position,
        airportId: values.airportId,
        email: values.email,
        password: values.password || undefined,
        role: Number(values.role),
        status: values.status,
      });
    });
  };

  return (
    <Modal
      title="Редактировать пользователя"
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      okText="Сохранить"
      cancelText="Отмена"
      confirmLoading={mutation.isPending}
      centered
    >
      {loadingAirports ? (
        <Spin />
      ) : (
        <Form form={form} layout="vertical">
          <Form.Item className="mb-3" name="fullname" label="ФИО" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item className="mb-3" name="email" label="Email">
            <Input disabled />
          </Form.Item>

          <Form.Item className="mb-3" name="password" label="Новый пароль">
            <Input.Password placeholder="Оставьте пустым, если не хотите менять" />
          </Form.Item>

          <Form.Item className="mb-3" name="position" label="Должность" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item className="mb-3" name="airportId" label="Аэропорт" rules={[{ required: true }]}>
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

          <Form.Item className="mb-3" name="role" label="Роль" rules={[{ required: true }]}>
            <Select
              options={roleOptions}
              placeholder="Выберите роль"
            />
          </Form.Item>

          <Form.Item className="mb-0" name="status" label="Статус" rules={[{ required: true }]}>
            <Select
              options={statusOptions}
              placeholder="Выберите статус"
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}
