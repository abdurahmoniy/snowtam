
"use client";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter, redirect } from "next/navigation";
import { Descriptions, Table, Tag, Alert, Card, Spin, Button, Space, Popconfirm } from "antd";
import { ArrowLeftFromLine } from "lucide-react";
import { GetAirportById } from "@/services/airport.services";
import { GetAllUsers } from "@/services/user.services";
import type { IAirport } from "@/types/airport";
import type { IUser } from "@/types/user.auth";


import { CreateRunway, DeleteRunway } from "@/services/runway.services";
import AddRunwayModal from "../_components/AddRunwayModal";
import EditRunwayModal from "../_components/EditRunwayModal";
import IAirportRunaway from "@/types/airport";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export default function AirportPage() {
    const { airportId } = useParams();
    const router = useRouter();

    const [addRunwayOpen, setAddRunwayOpen] = useState(false);
    const [editRunwayOpen, setEditRunwayOpen] = useState(false);
    const [selectedRunway, setSelectedRunway] = useState<IAirportRunaway | null>(null);

    const queryClient = useQueryClient();

    if (!airportId || isNaN(Number(airportId))) {
        redirect("/airports");
    }

    const airportQuery = useQuery({
        queryKey: ["airport", airportId],
        queryFn: () => GetAirportById(Number(airportId))
    });
    const usersQuery = useQuery({
        queryKey: ["users"],
        queryFn: () => GetAllUsers({ page: 0, size: 100, airportId: Number(airportId) }),
        enabled: !!airportId
    });

    const DeleteRunwayById = useMutation({
        mutationFn: (id: number) => DeleteRunway(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["airport", airportId] });
        }
    })

    if (airportQuery.isLoading || usersQuery.isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Spin size="large" />
            </div>
        );
    }

    const airport = airportQuery.data!.data as IAirport;
    const airportUsers = (usersQuery.data!.data as IUser[]).filter(
        (u) => u.airportDto?.id === airport.id
    );

    return (

        <>
            <div className="max-w-5xl mx-auto py-8 space-y-8">
                <Button type="primary" onClick={() => router.back()} className="flex items-center" icon={<ArrowLeftFromLine size={15} className="mb-0"></ArrowLeftFromLine>}>Назад</Button>


                {/* Airport Info */}
                <Card title="Данные аэропорта" bordered>
                    <Descriptions
                        bordered
                        column={2}
                        size="small"
                        labelStyle={{ width: 200 }}
                    >
                        <Descriptions.Item label="Полное название">
                            {airport.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Краткое название">
                            {airport.initialName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Код аэропорта">
                            {airport.airportCode}
                        </Descriptions.Item>
                        <Descriptions.Item label="Температура">
                            {airport.temperature}°
                        </Descriptions.Item>
                        <Descriptions.Item label="Долгота">
                            {airport.longitude}
                        </Descriptions.Item>
                        <Descriptions.Item label="Широта">
                            {airport.latitude}
                        </Descriptions.Item>
                        <Descriptions.Item label="Всего ВПП" span={2}>
                            <Tag color="blue">{airport.runwayDtos.length}</Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Runways List */}
                <Card
                    title="ВПП аэропорта"
                    bordered
                    extra={
                        <Button type="primary" onClick={() => setAddRunwayOpen(true)}>
                            Добавить ВПП
                        </Button>
                    }
                >
                    <Table
                        dataSource={airport.runwayDtos.map((r) => ({ ...r, key: r.id }))}
                        pagination={false}
                        size="small"
                        bordered
                        columns={[
                            { title: "ID", dataIndex: "id", key: "id" },
                            { title: "Название", dataIndex: "name", key: "name" },
                            { title: "Обозначение", dataIndex: "runwayDesignation", key: "runwayDesignation" },
                            {
                                title: "Длина (м)",
                                dataIndex: "length",
                                key: "length",
                                render: (len: number | null) => len ?? "—",
                            },
                            { title: "Ширина (м)", dataIndex: "width", key: "width" },
                            {
                                title: "Действия",
                                key: "actions",
                                render: (_: any, record: IAirportRunaway) => (
                                    <Space size="small">
                                        <Button
                                            icon={<EditOutlined />}
                                            onClick={() => {
                                                setSelectedRunway(record);
                                                setEditRunwayOpen(true);
                                            }}
                                        />
                                        <Popconfirm
                                            title="Удалить ВПП?"
                                            onConfirm={async () => {
                                                DeleteRunwayById.mutate(record.id, {
                                                    onSuccess(data, variables, context) {
                                                        queryClient.invalidateQueries();
                                                    },
                                                });
                                            }}
                                            okText="Да"
                                            cancelText="Нет"
                                        >
                                            <Button danger icon={<DeleteOutlined />} />
                                        </Popconfirm>
                                    </Space>
                                ),
                            },
                        ]}
                    />
                </Card>

                {/* Airport Users */}
                <Card title="Пользователи аэропорта" bordered>
                    {airportUsers.length === 0 ? (
                        <Alert
                            message="Нет пользователей, назначенных на этот аэропорт"
                            type="info"
                        />
                    ) : (
                        <Table
                            dataSource={airportUsers.map((u) => ({ ...u, key: u.id }))}
                            pagination={false}
                            size="small"
                            bordered
                            columns={[
                                { title: "ФИО", dataIndex: "fullname", key: "fullname" },
                                { title: "Email", dataIndex: "email", key: "email" },
                                { title: "Должность", dataIndex: "position", key: "position" },
                                {
                                    title: "Роли",
                                    dataIndex: "role",
                                    key: "role",
                                    render: (roles: string[]) =>
                                        roles.map((r) => <Tag key={r}>{r}</Tag>),
                                },
                                { title: "Статус", dataIndex: "status", key: "status" },
                            ]}
                        />
                    )}
                </Card>
            </div>

            <AddRunwayModal
                open={addRunwayOpen}
                onClose={() => setAddRunwayOpen(false)}
                airportId={airport.id}
                onSuccess={() => queryClient.invalidateQueries({ queryKey: ["airport", airportId] })}
            />

            <EditRunwayModal
                open={editRunwayOpen}
                onClose={() => setEditRunwayOpen(false)}
                airportId={airport.id}
                runway={selectedRunway}
                onSuccess={() => queryClient.invalidateQueries({ queryKey: ["airport", airportId] })}
            />

        </>





    );
}
