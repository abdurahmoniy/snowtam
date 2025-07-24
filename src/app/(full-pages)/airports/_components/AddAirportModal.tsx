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
import { AttachUserToAirport, CreateAirport } from "@/services/airport.services";
import { GetAllUsers } from "@/services/user.services";
import type {
    IAirport,
    IAirportCreateDto,
} from "@/types/airport";
import type { MainResponse } from "@/types/auth";
import AddUserModal from "@/app/(full-pages)/users/_components/AddUserModal";
import { GetAllRoles } from "@/services/role.services";
import { ROLES } from "@/consts/role-based-routing";
import { toast } from "sonner";

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
    const [form] = Form.useForm<(IAirportCreateDto & { adminId: number; dispatcherId: number })>();
    const qc = useQueryClient();
    const [addingField, setAddingField] = useState<"adminId" | "dispatcherId" | null>(null);



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
        IAirportCreateDto & { adminId: number; dispatcherId: number }
    >({
        mutationFn: (data) => CreateAirport(data),
        // onSuccess: () => {
        //     message.success("Аэропорт успешно добавлен");
        //     form.resetFields();
        //     onSuccess();
        //     onClose();
        // },
        onSuccess: (res, variables) => {
            toast.success("Аэропорт успешно добавлен");
            form.resetFields();
            onSuccess();
            onClose();
            // 1) grab the new airport's ID
            const newAirportId = res.data.id;
            // 2) immediately attach the Admin
            AttachUserToAirport({ airportId: newAirportId, userId: variables.adminId });
            // 3) immediately attach the Dispatcher
            AttachUserToAirport({ airportId: newAirportId, userId: variables.dispatcherId });

            // 4) cleanup
            form.resetFields();
            onSuccess();
            onClose();
        },
        onError: () => {
            toast.error("Не удалось добавить аэропорт");
        },
    });

    const handleOk = () => {
        form.validateFields().then((values) => {
            mutation.mutate(values);
        });
    };

    // map users to options
    const userOptions =
        usersData?.data.filter(i => !i.airportDto).map((u) => ({
            label: u.fullname + ` (${u.email})`,
            value: u.id,
        })) ?? [];

    console.log("form-values", form.getFieldsValue());


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
                                defaultValue={form.getFieldValue("adminId")}
                                onSelect={(value) => form.setFieldsValue({ adminId: value })}
                            />
                            <Button
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    setAddingField("adminId");
                                    setAddUserModalOpen(true);

                                }}
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
                                defaultValue={form.getFieldValue("dispatcherId")}
                                onSelect={(value) => form.setFieldsValue({ dispatcherId: value })}

                            />
                            <Button
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    setAddingField("dispatcherId");
                                    setAddUserModalOpen(true);
                                }}
                            />
                        </Input.Group>
                    </Form.Item>
                </Form>
            </Modal>

            {/** Reuse your existing AddUserModal to drop in new users */}
            <AddUserModal
                open={addUserModalOpen}
                onClose={() => setAddUserModalOpen(false)}
                onSuccess={(newUser) => {
                    // 1) re-fetch the user list so the new one shows up in the dropdown
                    console.log(newUser, addingField, "newUser");

                    qc.invalidateQueries();
                    // 2) set the just-created user into the proper field
                    if (addingField) {
                        form.setFieldsValue({ [addingField]: newUser.id });
                    }
                    // 3) reset your “which field” flag & close
                    setAddingField(null);
                    setAddUserModalOpen(false);
                }}
                roleOptions={RoleOptions}
            />
        </>
    );
}
