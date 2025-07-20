"use client";

import { Modal, Descriptions, Button, Popconfirm, message } from "antd";
import { IAirport } from "@/types/airport";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

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
    if (!airport) return null;

    return (
        <Modal
            title={`Информация об аэропорте: ${airport.initialName}`}
            open={open}
            onCancel={onClose}
            footer={
                <div className="flex justify-end gap-3">
                     <Button key="edit" type="primary" icon={<EditOutlined />} onClick={() => onEdit(airport)}>
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
            <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Название">{airport.name}</Descriptions.Item>
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
                <Descriptions.Item label="Широта">{airport.latitude}</Descriptions.Item>
                <Descriptions.Item label="Третей ВПП">
                    {airport.runwayDtos?.length ?? 0}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
}
