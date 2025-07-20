// src/app/users/_components/ViewUserModal.tsx

"use client";

import { Modal, Descriptions, Button, Popconfirm, Tag, message } from "antd";
import { StopOutlined, EditOutlined } from "@ant-design/icons";
import type { IUser } from "@/types/user.auth";
import { BanUser } from "@/services/user.services";
import { toast } from "sonner";

interface Props {
  open: boolean;
  user: IUser | null;
  onClose: () => void;
  onEdit: (user: IUser) => void;
  onBanned?: () => void; // invalidate after success
}

export default function ViewUserModal({
  open,
  user,
  onClose,
  onEdit,
  onBanned,
}: Props) {
  if (!user) return null;

  const handleBan = async () => {
    try {
      await BanUser({ userId: user.id });
      toast.success("Пользователь заблокирован");
      onBanned?.();
      onClose();
    } catch {
      toast.error("Не удалось заблокировать пользователя");
    }
  };

  return (
    <Modal
      title={`Пользователь: ${user.fullname}`}
      open={open}
      onCancel={onClose}
      footer={<div className="flex justify-end gap-4">
        <Button key="edit" icon={<EditOutlined />} onClick={() => onEdit(user)} type="primary">
          Редактировать
        </Button>{
          user.status !== "BANNED" && (
            <Popconfirm
              key="ban"
              title="Заблокировать пользователя?"
              onConfirm={handleBan}
              okText="Да"
              cancelText="Нет"
            >
              <Button type="primary" danger icon={<StopOutlined />}>
                Заблокировать
              </Button>
            </Popconfirm>
          )

        }
      </div>}
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="ФИО">{user.fullname}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Должность">{user.position}</Descriptions.Item>
        <Descriptions.Item label="Статус">
          <Tag color={user.status === "BANNED" ? "red" : "green"}>
            {user.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Аэропорт">
          {user.airportDto?.initialName}
        </Descriptions.Item>
        <Descriptions.Item label="Роли">
          {user.role.map((r) => (
            <Tag key={r}>{r}</Tag>
          ))}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}
