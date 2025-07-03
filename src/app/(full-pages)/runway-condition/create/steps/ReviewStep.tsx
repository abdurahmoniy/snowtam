"use client";

import { Card, Descriptions, Divider, List, Space, Typography } from "antd";
import { RunwayConditionCreateRequest } from "@/types/runway-condition";

const { Title, Text } = Typography;

interface ReviewStepProps {
  values: RunwayConditionCreateRequest;
}

const ReviewStep = ({ values }: ReviewStepProps) => {
  return (
    <div className="space-y-6">
      <Title level={4}>Review Runway Condition Report</Title>

      {/* Basic Information */}
      {/* <Card title="Basic Information">
        <Descriptions column={2}>
          <Descriptions.Item label="Airport Code">
            {values.airportCode || <Text type="secondary">Not provided</Text>}
          </Descriptions.Item>
          <Descriptions.Item label="Runway Designation">
            {values.runwayDesignation || (
              <Text type="secondary">Not provided</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Report Date/Time">
            {values.reportDateTime ? (
              new Date(values.reportDateTime).toLocaleString()
            ) : (
              <Text type="secondary">Not provided</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Ambient Temperature">
            {values.ambientTemperature !== null ? (
              `${values.ambientTemperature}°C`
            ) : (
              <Text type="secondary">Not provided</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Initials">
            {values.initials || <Text type="secondary">Not provided</Text>}
          </Descriptions.Item>
          <Descriptions.Item label="RWYC Code">
            {values.rwycCode || <Text type="secondary">Not provided</Text>}
          </Descriptions.Item>
          <Descriptions.Item label="Overall Condition Code">
            {values.overallConditionCode !== null ? (
              values.overallConditionCode
            ) : (
              <Text type="secondary">Not provided</Text>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card> */}

      {/* Runway Thirds */}
      <Card title="Runway Thirds Conditions">
        <List
          dataSource={values.runwayThirds || []}
          renderItem={(third, index) => (
            <List.Item key={index}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Text strong>Third {third.partNumber}</Text>
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="Coverage">
                    {third.contaminationCoverage || (
                      <Text type="secondary">Not provided</Text>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Surface Condition">
                    {third.surfaceCondition || (
                      <Text type="secondary">Not provided</Text>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Depth (mm)">
                    {third.depthMm !== null ? (
                      third.depthMm
                    ) : (
                      <Text type="secondary">Not applicable</Text>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Friction Coefficient">
                    {third.frictionCoefficient !== null ? (
                      third.frictionCoefficient
                    ) : (
                      <Text type="secondary">Not provided</Text>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="RWYC Value">
                    {third.rwycValue !== null ? (
                      third.rwycValue
                    ) : (
                      <Text type="secondary">Not provided</Text>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Temperature (°C)">
                    {third.temperatureCelsius !== null ? (
                      third.temperatureCelsius
                    ) : (
                      <Text type="secondary">Not provided</Text>
                    )}
                  </Descriptions.Item>
                </Descriptions>
              </Space>
            </List.Item>
          )}
        />
      </Card>

      {/* Situational Notifications */}
      {values.situationalNotifications?.length > 0 && (
        <Card title="Situational Notifications">
          <List
            dataSource={values.situationalNotifications}
            renderItem={(notification, index) => (
              <List.Item key={index}>
                <Space direction="vertical">
                  <Text strong>Notification {index + 1}</Text>
                  <div>
                    <Text>Type: </Text>
                    {notification.notificationType ? (
                      Array.isArray(notification.notificationType) ? (
                        <Text>{notification.notificationType.join(", ")}</Text>
                      ) : (
                        <Text>{notification.notificationType}</Text>
                      )
                    ) : (
                      <Text type="secondary">Not provided</Text>
                    )}
                  </div>
                  <div>
                    <Text>Runway Length Reduction: </Text>
                    {notification.runwayLengthReductionM !== null ? (
                      <Text>{notification.runwayLengthReductionM}m</Text>
                    ) : (
                      <Text type="secondary">Not provided</Text>
                    )}
                  </div>
                  {notification.additionalDetails && (
                    <div>
                      <Text>Additional Details: </Text>
                      <Text>{notification.additionalDetails}</Text>
                    </div>
                  )}
                </Space>
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* Improvement Procedures */}
      {values.improvementProcedures?.length > 0 && (
        <Card title="Improvement Procedures">
          <List
            dataSource={values.improvementProcedures}
            renderItem={(procedure, index) => (
              <List.Item key={index}>
                <Space direction="vertical">
                  <Text strong>Procedure {index + 1}</Text>
                  <div>
                    <Text>Type: </Text>
                    {procedure.procedureType ? (
                      Array.isArray(procedure.procedureType) ? (
                        <Text>{procedure.procedureType.join(", ")}</Text>
                      ) : (
                        <Text>{procedure.procedureType}</Text>
                      )
                    ) : (
                      <Text type="secondary">Not provided</Text>
                    )}
                  </div>
                  <div>
                    <Text>Application Time: </Text>
                    {procedure.applicationTime ? (
                      <Text>
                        {new Date(procedure.applicationTime).toLocaleString()}
                      </Text>
                    ) : (
                      <Text type="secondary">Not provided</Text>
                    )}
                  </div>
                  <div>
                    <Text>Effectiveness Rating: </Text>
                    {procedure.effectivenessRating !== null ? (
                      <Text>{procedure.effectivenessRating}</Text>
                    ) : (
                      <Text type="secondary">Not provided</Text>
                    )}
                  </div>
                </Space>
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* Remarks */}
      {values.remarks && (
        <Card title="Remarks">
          <Text>{values.remarks}</Text>
        </Card>
      )}
    </div>
  );
};

export default ReviewStep;
