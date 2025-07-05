"use client";

import { Card, Descriptions, Divider, List, Space, Typography } from "antd";
import { RunwayConditionCreateRequest } from "@/types/runway-condition";

const { Title, Text } = Typography;

interface ReviewStepProps {
  values: RunwayConditionCreateRequest;
}

const ReviewStep = ({ values }: ReviewStepProps) => {
  // 3-та ВПП учун бошланғич қийматларни аниклаш
  const allThirds = [
    values.runwayThirds?.[0] || {
      partNumber: 1,
      contaminationCoverage: null,
      surfaceCondition: null,
      depthMm: null,
      frictionCoefficient: null,
      rwycValue: null,
      temperatureCelsius: null,
    },
    values.runwayThirds?.[1] || {
      partNumber: 2,
      contaminationCoverage: null,
      surfaceCondition: null,
      depthMm: null,
      frictionCoefficient: null,
      rwycValue: null,
      temperatureCelsius: null,
    },
    values.runwayThirds?.[2] || {
      partNumber: 3,
      contaminationCoverage: null,
      surfaceCondition: null,
      depthMm: null,
      frictionCoefficient: null,
      rwycValue: null,
      temperatureCelsius: null,
    },
  ];

  const getCoverageText = (coverage: string | null) => {
    switch (coverage) {
      case "LESS_THAN_10_PERCENT":
        return "Менее 10%";
      case "BETWEEN_10_AND_25_PERCENT":
        return "10-25%";
      case "MORE_THAN_25_PERCENT":
        return "Более 25%";
      default:
        return <Text type="secondary">Не указано</Text>;
    }
  };

  return (
    <div className="space-y-6">
      <Title level={4}>Проверка отчета о состоянии ВПП</Title>

      {/* Основная информация */}
      <Card title="Основная информация">
        <Descriptions column={2}>
          <Descriptions.Item label="Код аэропорта">
            {values.airportCode || <Text type="secondary">Не указано</Text>}
          </Descriptions.Item>
          <Descriptions.Item label="Обозначение ВПП">
            {values.runwayDesignation || (
              <Text type="secondary">Не указано</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Дата/время отчета">
            {values.reportDateTime ? (
              new Date(values.reportDateTime).toLocaleString()
            ) : (
              <Text type="secondary">Не указано</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Температура окружающей среды">
            {values.ambientTemperature !== null ? (
              `${values.ambientTemperature}°C`
            ) : (
              <Text type="secondary">Не указано</Text>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Состояние третей ВПП */}
      <Card title="Состояние третей ВПП">
        <List
          dataSource={allThirds}
          renderItem={(third, index) => (
            <List.Item key={index}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Text strong>{third.partNumber} треть ВПП</Text>
                <Descriptions column={2} size="small" bordered>
                  <Descriptions.Item label="Покрытие" span={2}>
                    {getCoverageText(third.contaminationCoverage)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Состояние поверхности">
                    {third.surfaceCondition || (
                      <Text type="secondary">Не указано</Text>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Глубина (мм)">
                    {third.depthMm !== null ? (
                      third.depthMm
                    ) : (
                      <Text type="secondary">Не применимо</Text>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Коэффициент трения">
                    {third.frictionCoefficient !== null ? (
                      third.frictionCoefficient
                    ) : (
                      <Text type="secondary">Не указано</Text>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Значение RWYC">
                    {third.rwycValue !== null ? (
                      third.rwycValue
                    ) : (
                      <Text type="secondary">Не указано</Text>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Температура (°C)">
                    {third.temperatureCelsius !== null ? (
                      third.temperatureCelsius
                    ) : (
                      <Text type="secondary">Не указано</Text>
                    )}
                  </Descriptions.Item>
                </Descriptions>
              </Space>
            </List.Item>
          )}
        />
      </Card>

      {/* Ситуационные уведомления */}
      <Card title="Ситуационные уведомления">
        {values.situationalNotifications?.length > 0 ? (
          <List
            dataSource={values.situationalNotifications}
            renderItem={(item, index) => (
              <List.Item key={index}>
                <Text>{String(item)}</Text>
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary">Уведомления не выбраны</Text>
        )}
      </Card>

      {/* Процедуры улучшения */}
      <Card title="Процедуры улучшения">
        {values.improvementProcedures?.length > 0 ? (
          <List
            dataSource={values.improvementProcedures}
            renderItem={(item, index) => (
              <List.Item key={index}>
                <Text>{String(item)}</Text>
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary">Процедуры не выбраны</Text>
        )}
      </Card>

      {/* Примечания */}
      {values.remarks && (
        <Card title="Примечания">
          <Text>{values.remarks}</Text>
        </Card>
      )}
    </div>
  );
};

export default ReviewStep;
