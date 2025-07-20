"use client";

import { useUserMe } from "@/hooks/use-me";
import { Button, Card, Descriptions, Typography } from "antd";
import { ArrowLeftFromLine } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserProfilePage() {
    const { data, isLoading, isError } = useUserMe();
    const router = useRouter();

    if (isLoading) return <p>Загрузка...</p>;
    if (isError || !data?.data) return <p>Не удалось получить данные пользователя.</p>;

    const user = data.data;
    const airport = user.airportDto;

    return (
        <section className="max-w-5xl mx-auto p-6">
            <div className="flex items-center gap-4 mb-5">
                <Button
                    type="primary"
                    onClick={() => router.back()}
                    className="flex items-center"
                    icon={<ArrowLeftFromLine size={15} className="mb-0" />}
                >
                    Назад
                </Button>
                <Typography.Title level={2} className="!mb-0">
                    Профиль пользователя
                </Typography.Title>
            </div>

            <div className="flex gap-4">
                <Card title="Общая информация" bordered className="mb-4 flex-grow">
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="Ф.И.О.">{user.fullname}</Descriptions.Item>
                        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                        <Descriptions.Item label="Должность">{user.position}</Descriptions.Item>
                        <Descriptions.Item label="Статус">{user.status}</Descriptions.Item>
                        <Descriptions.Item label="Роли">{user.role.join(", ")}</Descriptions.Item>
                    </Descriptions>
                </Card>

                <Card title="Аэропорт" bordered className="mb-4 flex-grow">
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="Название">{airport.name}</Descriptions.Item>
                        <Descriptions.Item label="Краткое название">{airport.initialName}</Descriptions.Item>
                        <Descriptions.Item label="Код">{airport.airportCode}</Descriptions.Item>
                        <Descriptions.Item label="Температура">{airport.temperature}°C</Descriptions.Item>
                        <Descriptions.Item label="Координаты">
                            {airport.latitude}, {airport.longitude}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </div>

            <Card title="ВПП (взлётно-посадочные полосы)" bordered>
                {airport.runwayDtos.length === 0 ? (
                    <p>Полосы не найдены.</p>
                ) : (
                    airport.runwayDtos.map((runway) => (
                        <Descriptions
                            key={runway.id}
                            title={runway.name}
                            column={1}
                            bordered
                            className="mb-4"
                        >
                            <Descriptions.Item label="Обозначение">{runway.runwayDesignation}</Descriptions.Item>
                            <Descriptions.Item label="Длина">{runway.length ?? "Неизвестно"} м</Descriptions.Item>
                            <Descriptions.Item label="Ширина">{runway.width} м</Descriptions.Item>
                            <Descriptions.Item label="Координаты">
                                {runway.latitude}, {runway.longitude}
                            </Descriptions.Item>
                        </Descriptions>
                    ))
                )}
            </Card>
        </section>
    );
}
