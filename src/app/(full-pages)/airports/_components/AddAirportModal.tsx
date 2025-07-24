// "use client";

// import React from "react";
// import { Modal, Form, Input, InputNumber, message } from "antd";
// import { useMutation } from "@tanstack/react-query";
// import { CreateAirport } from "@/services/airport.services";
// import type { IAirport, IAirportCreateDto } from "@/types/airport";
// import { MainResponse } from "@/types/auth";

// interface AddAirportModalProps {
//     open: boolean;
//     onClose: () => void;
//     onSuccess: () => void;
// }

// export default function AddAirportModal({
//     open,
//     onClose,
//     onSuccess,
// }: AddAirportModalProps) {
//     const [form] = Form.useForm<IAirportCreateDto>();

//     const mutation = useMutation<MainResponse<IAirport>, Error, IAirportCreateDto>({
//         mutationFn: (data) => CreateAirport(data),
//         onSuccess: () => {
//             message.success("Аэропорт успешно добавлен");
//             form.resetFields();
//             onSuccess();
//             onClose();
//         },
//         onError: () => {
//             message.error("Не удалось добавить аэропорт");
//         },
//     }
//     );

//     const handleOk = () => {
//         form.validateFields().then((values) => {
//             mutation.mutate(values);
//         });
//     };

//     return (
//         <Modal
//             title="Добавить аэропорт"
//             open={open}
//             onOk={handleOk}
//             onCancel={onClose}
//             confirmLoading={mutation.isPending}
//             okText="Добавить"
//             cancelText="Отменить"
//             centered
//         >
//             <Form form={form} layout="vertical">
//                 <Form.Item name="name" label="Название" rules={[{ required: true }]}>
//                     <Input />
//                 </Form.Item>

//                 <Form.Item
//                     name="initialName"
//                     label="Краткое название"
//                     rules={[{ required: true }]}
//                 >
//                     <Input />
//                 </Form.Item>

//                 <Form.Item
//                     name="airportCode"
//                     label="Код аэропорта"
//                     rules={[{ required: true }]}
//                 >
//                     <Input />
//                 </Form.Item>

//                 <Form.Item
//                     name="temperature"
//                     label="Температура"
//                     rules={[{ required: true }]}
//                 >
//                     <InputNumber style={{ width: "100%" }} />
//                 </Form.Item>

//                 <Form.Item
//                     name="longitude"
//                     label="Долгота"
//                     rules={[{ required: true }]}
//                 >
//                     <Input />
//                 </Form.Item>

//                 <Form.Item
//                     name="latitude"
//                     label="Широта"
//                     rules={[{ required: true }]}
//                 >
//                     <Input />
//                 </Form.Item>
//             </Form>
//         </Modal>
//     );
// }




























// src/app/(full-pages)/airports/_components/AddAirportModal.tsx
"use client";

import React, { useState } from "react";
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Button,
    Select,
    message,
    InputNumberProps,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateAirport } from "@/services/airport.services";
import { GetAllUsers } from "@/services/user.services";
import type {
    IAirport,
    IAirportCreateDto,
} from "@/types/airport";
import type { MainResponse } from "@/types/auth";
import AddUserModal from "@/app/(full-pages)/users/_components/AddUserModal";
import { GetAllRoles } from "@/services/role.services";
import { ROLES } from "@/consts/role-based-routing";

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
    const qc = useQueryClient();

    // fetch all users for selects
    const { data: usersData, isLoading: loadingUsers } = useQuery({
        queryKey: ["users-for-airport"],
        queryFn: () =>
            GetAllUsers({ page: 0, size: 100 }),
    });

    const RolesData = useQuery({
        queryKey: ["get-all-roles"],
        queryFn: () => GetAllRoles(),
    })


    const RoleOptions = RolesData.data?.data.filter(i => (i.name == ROLES.ADMIN || i.name == ROLES.DISPETCHER)).map((role) => ({
        label: role.name,
        value: role.id,
    })) ?? [];


    // open/close add-user modal
    const [addUserModalOpen, setAddUserModalOpen] = useState(false);

    const mutation = useMutation<
        MainResponse<IAirport>,
        Error,
        IAirportCreateDto
    >({
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
    });

    const handleOk = () => {
        form.validateFields().then((values) => {
            mutation.mutate(values);
        });
    };

    // map users to options
    const userOptions =
        usersData?.data.map((u) => ({
            label: u.fullname + ` (${u.email})`,
            value: u.id,
        })) ?? [];

    return (
        <>
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
                    <Form.Item
                        name="name"
                        label="Название"
                        rules={[{ required: true }]}
                        className="mb-2"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="initialName"
                        label="Краткое название"
                        rules={[{ required: true }]}
                        className="mb-2"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="airportCode"
                        label="Код аэропорта"
                        rules={[{ required: true }]}
                        className="mb-2"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="temperature"
                        label="Температура"
                        rules={[{ required: true }]}
                        className="mb-2"
                    >
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        name="longitude"
                        label="Долгота"
                        rules={[{ required: true }]}
                        className="mb-2"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="latitude"
                        label="Широта"
                        rules={[{ required: true }]}
                        className="mb-2"
                    >
                        <Input />
                    </Form.Item>

                    {/** ———————— New Admin selector ———————— **/}
                    <Form.Item
                        name="adminId"
                        label="Администратор"
                        rules={[{ required: true }]}
                        className="mb-2"
                    >
                        <Input.Group compact>
                            <Select
                                loading={loadingUsers}
                                options={userOptions}
                                placeholder="Выберите администратора"
                                style={{ width: "calc(100% - 32px)" }}
                            />
                            <Button
                                icon={<PlusOutlined />}
                                onClick={() => setAddUserModalOpen(true)}
                            />
                        </Input.Group>
                    </Form.Item>

                    {/** ———————— New Dispatcher selector ———————— **/}
                    <Form.Item
                        name="dispatcherId"
                        label="Диспетчер"
                        rules={[{ required: true }]}
                        className="mb-2"
                    >
                        <Input.Group compact>
                            <Select
                                loading={loadingUsers}
                                options={userOptions}
                                placeholder="Выберите диспетчера"
                                style={{ width: "calc(100% - 32px)" }}
                            />
                            <Button
                                icon={<PlusOutlined />}
                                onClick={() => setAddUserModalOpen(true)}
                            />
                        </Input.Group>
                    </Form.Item>
                </Form>
            </Modal>

            {/** Reuse your existing AddUserModal to drop in new users */}
            <AddUserModal
                open={addUserModalOpen}
                onClose={() => setAddUserModalOpen(false)}
                onSuccess={() => {
                    // refetch users so the new user appears in our selects
                    qc.invalidateQueries({ queryKey: ["users-for-airport"] });
                    setAddUserModalOpen(false);
                }}
                roleOptions={RoleOptions}
            />
        </>
    );
}
