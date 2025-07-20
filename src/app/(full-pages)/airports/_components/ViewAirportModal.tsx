// src/app/(full-pages)/airports/_components/ViewAirportModal.tsx

"use client";

import { useState } from "react";
import {
    Modal,
    Descriptions,
    Button,
    Popconfirm,
    Table,
} from "antd";
import IAirportRunaway, { IAirport } from "@/types/airport";
import { IRunway } from "@/types/runway"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import AddRunwayModal from "./AddRunwayModal";

interface ViewAirportModalProps {
    open: boolean;
    airport: IAirport | null;
    onClose: () => void;
    onEdit: (airport: IAirport) => void;
    onDelete: (airportId: number) => void;
}

export default function ViewAirportModal({
    open,
    airport,
    onClose,
    onEdit,
    onDelete,
}: ViewAirportModalProps) {
    const [addRunwayOpen, setAddRunwayOpen] = useState(false);
    if (!airport) return null;

    // Колонки для таблицы ВПП
    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Название", dataIndex: "name", key: "name" },
        {
            title: "Обозначение",
            dataIndex: "runwayDesignation",
            key: "runwayDesignation",
        },
        {
            title: "Длина (м)",
            dataIndex: "length",
            key: "length",
            render: (len: number | null) => (len ?? "—"),
        },
        { title: "Ширина (м)", dataIndex: "width", key: "width" },
        { title: "Долгота", dataIndex: "longitude", key: "longitude" },
        { title: "Широта", dataIndex: "latitude", key: "latitude" },
    ];

    return (
        <>
            <Modal
                title={`Информация об аэропорте: ${airport.initialName}`}
                open={open}
                onCancel={onClose}
                width={1000}
                footer={
                    <div className="flex justify-end gap-3">
                        <Button onClick={() => setAddRunwayOpen(true)}>
                            Добавить ВПП
                        </Button>
                        <Button
                            key="edit"
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => onEdit(airport)}
                        >
                            Редактировать
                        </Button>
                        <Popconfirm
                            key="delete"
                            title="Вы уверены, что хотите удалить аэропорт?"
                            onConfirm={() => onDelete(airport.id)}
                            okText="Да"
                            cancelText="Нет"
                        >
                            <Button type="primary" danger icon={<DeleteOutlined />}>
                                Удалить
                            </Button>
                        </Popconfirm>
                    </div>
                }
            >
                <div style={{ display: "flex", gap: 22 }}>
                    {/* Левая колонка: описания */}
                    <div style={{ }}>
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="Название">
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
                            <Descriptions.Item label="Всего ВПП">
                                {airport.runwayDtos.length}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>

                    {/* Правая колонка: таблица ВПП */}
                    <div style={{ flex: 1 }}>
                        <Table<IAirportRunaway>
                            dataSource={airport.runwayDtos.map((r) => ({
                                ...r,
                                key: r.id,
                            }))}
                            columns={columns}
                            pagination={false}
                            size="small"
                            bordered
                            title={() => "Список ВПП"}
                        />
                    </div>
                </div>
            </Modal>

            <AddRunwayModal
                open={addRunwayOpen}
                onClose={() => setAddRunwayOpen(false)}
                airportId={airport.id}
            />
        </>
    );
}
