// src/app/users/page.tsx

"use client";

import { useState } from "react";
import { Button, Select, Table } from "antd";
import { useQuery } from "@tanstack/react-query";
import { GetAllUsers } from "@/services/user.services";
import type { IUser } from "@/types/user.auth";
import AddUserModal from "./_components/AddUserModal";
import ViewUserModal from "./_components/ViewUserModal";
import EditUserModal from "./_components/EditUserModal";
import { GetAllRoles } from "@/services/role.services";

const statusOptions = [
  { label: "Все", value: "All" },
  { label: "Активен", value: "ACTIVE" },
  { label: "Ожидает", value: "PENDING" },
  { label: "Временный", value: "TEMP" },
  { label: "Заблокирован", value: "BANNED" },
];

const roleOptions = [
  { label: "Админ", value: "1" },
  { label: "Модератор", value: "2" },
  { label: "Пользователь", value: "3" },
];

export default function UsersPage() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>();

  const { data: usersData, refetch, isLoading } = useQuery({
    queryKey: ["users", statusFilter],
    queryFn: () => GetAllUsers({ page: 0, size: 100, userStatus: statusFilter as any }),
  });

  const openView = (user: IUser) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const openEdit = (user: IUser) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const RolesData = useQuery({
    queryKey: ["get-all-roles"],
    queryFn: () => GetAllRoles(),
  })

  const RoleOptions = RolesData.data?.data.map((role) => ({
    label: role.name,
    value: role.name,
  }));


  console.log(RolesData.data, "RolesData");


  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
          style={{ width: 200 }}
          placeholder="Статус пользователя"
        />
        <Button type="primary" onClick={() => setAddModalOpen(true)}>
          Добавить пользователя
        </Button>
      </div>

      <Table
        rowKey="id"
        loading={isLoading}
        dataSource={usersData?.data || []}
        columns={[
          { title: "ФИО", dataIndex: "fullname" },
          { title: "Email", dataIndex: "email" },
          { title: "Статус", dataIndex: "status" },
          {
            title: "Роль",
            dataIndex: "role",
            render: (roles: string[]) => roles.join(", "),
          },
          {
            title: "Действия",
            key: "actions",
            render: (_, user) => (
              <Button onClick={() => openView(user)}>Просмотр</Button>
            ),
          },
        ]}
        onRow={(record) => {
          return {
            onDoubleClick: () => openEdit(record),
          };
        }}
      />

      <AddUserModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={refetch}
        roleOptions={RoleOptions ?? []}
      />

      <EditUserModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={() => {
          refetch()
        }}
        user={selectedUser}
        roleOptions={RoleOptions ?? []}
        statusOptions={statusOptions}
      />

      <ViewUserModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        onEdit={() => {
          setViewModalOpen(false);
          setTimeout(() => {
            setEditModalOpen(true);
          }, 200);
        }}
        user={selectedUser}
        onBanned={refetch}

      />
    </div>
  );
}
