// "use client";

// import { RunwayConditionCreateRequest } from "@/types/runway-condition";
// import { Card, Descriptions, List, Space, Typography } from "antd";

// const { Title, Text } = Typography;

// interface ReviewStepProps {
//   values: RunwayConditionCreateRequest;
// }

// const ReviewStep = ({ values }: ReviewStepProps) => {
//   return (
//     <div className="space-y-6">
//       <Title level={4}>Review Runway Condition Report</Title>

//       {/* Basic Information */}
//       {/* <Card title="Basic Information">
//         <Descriptions column={2}>
//           <Descriptions.Item label="Airport Code">
//             {values.airportCode || <Text type="secondary">Not provided</Text>}
//           </Descriptions.Item>
//           <Descriptions.Item label="Runway Designation">
//             {values.runwayDesignation || (
//               <Text type="secondary">Not provided</Text>
//             )}
//           </Descriptions.Item>
//           <Descriptions.Item label="Report Date/Time">
//             {values.reportDateTime ? (
//               new Date(values.reportDateTime).toLocaleString()
//             ) : (
//               <Text type="secondary">Not provided</Text>
//             )}
//           </Descriptions.Item>
//           <Descriptions.Item label="Ambient Temperature">
//             {values.ambientTemperature !== null ? (
//               `${values.ambientTemperature}°C`
//             ) : (
//               <Text type="secondary">Not provided</Text>
//             )}
//           </Descriptions.Item>
//           <Descriptions.Item label="Initials">
//             {values.initials || <Text type="secondary">Not provided</Text>}
//           </Descriptions.Item>
//           <Descriptions.Item label="RWYC Code">
//             {values.rwycCode || <Text type="secondary">Not provided</Text>}
//           </Descriptions.Item>
//           <Descriptions.Item label="Overall Condition Code">
//             {values.overallConditionCode !== null ? (
//               values.overallConditionCode
//             ) : (
//               <Text type="secondary">Not provided</Text>
//             )}
//           </Descriptions.Item>
//         </Descriptions>
//       </Card> */}

//       {/* Runway Thirds */}
//       <Card title="Runway Thirds Conditions">
//         <List
//           dataSource={values.runwayThirds || []}
//           renderItem={(third, index) => (
//             <List.Item key={index}>
//               <Space direction="vertical" style={{ width: "100%" }}>
//                 <Text strong>Third {third.partNumber}</Text>
//                 <Descriptions column={2} size="small">
//                   <Descriptions.Item label="Coverage">
//                     {third.contaminationCoverage || (
//                       <Text type="secondary">Not provided</Text>
//                     )}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Surface Condition">
//                     {third.surfaceCondition || (
//                       <Text type="secondary">Not provided</Text>
//                     )}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Depth (mm)">
//                     {third.depthMm !== null ? (
//                       third.depthMm
//                     ) : (
//                       <Text type="secondary">Not applicable</Text>
//                     )}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Friction Coefficient">
//                     {third.frictionCoefficient !== null ? (
//                       third.frictionCoefficient
//                     ) : (
//                       <Text type="secondary">Not provided</Text>
//                     )}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="RWYC Value">
//                     {third.rwycValue !== null ? (
//                       third.rwycValue
//                     ) : (
//                       <Text type="secondary">Not provided</Text>
//                     )}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Temperature (°C)">
//                     {third.temperatureCelsius !== null ? (
//                       third.temperatureCelsius
//                     ) : (
//                       <Text type="secondary">Not provided</Text>
//                     )}
//                   </Descriptions.Item>
//                 </Descriptions>
//               </Space>
//             </List.Item>
//           )}
//         />
//       </Card>

//       {/* Situational Notifications */}
//       {values.situationalNotifications?.length > 0 && (
//         <Card title="Situational Notifications">
//           <List
//             dataSource={values.situationalNotifications}
//             renderItem={(notification, index) => (
//               <List.Item key={index}>
//                 <Space direction="vertical">
//                   <Text strong>Notification {index + 1}</Text>
//                   <div>
//                     <Text>Type: </Text>
//                     {notification.notificationType ? (
//                       Array.isArray(notification.notificationType) ? (
//                         <Text>{notification.notificationType.join(", ")}</Text>
//                       ) : (
//                         <Text>{notification.notificationType}</Text>
//                       )
//                     ) : (
//                       <Text type="secondary">Not provided</Text>
//                     )}
//                   </div>
//                   <div>
//                     <Text>Runway Length Reduction: </Text>
//                     {notification.runwayLengthReductionM !== null ? (
//                       <Text>{notification.runwayLengthReductionM}m</Text>
//                     ) : (
//                       <Text type="secondary">Not provided</Text>
//                     )}
//                   </div>
//                   {notification.additionalDetails && (
//                     <div>
//                       <Text>Additional Details: </Text>
//                       <Text>{notification.additionalDetails}</Text>
//                     </div>
//                   )}
//                 </Space>
//               </List.Item>
//             )}
//           />
//         </Card>
//       )}

//       {/* Improvement Procedures */}
//       {values.improvementProcedures?.length > 0 && (
//         <Card title="Improvement Procedures">
//           <List
//             dataSource={values.improvementProcedures}
//             renderItem={(procedure, index) => (
//               <List.Item key={index}>
//                 <Space direction="vertical">
//                   <Text strong>Procedure {index + 1}</Text>
//                   <div>
//                     <Text>Type: </Text>
//                     {procedure.procedureType ? (
//                       Array.isArray(procedure.procedureType) ? (
//                         <Text>{procedure.procedureType.join(", ")}</Text>
//                       ) : (
//                         <Text>{procedure.procedureType}</Text>
//                       )
//                     ) : (
//                       <Text type="secondary">Not provided</Text>
//                     )}
//                   </div>
//                   <div>
//                     <Text>Application Time: </Text>
//                     {procedure.applicationTime ? (
//                       <Text>
//                         {new Date(procedure.applicationTime).toLocaleString()}
//                       </Text>
//                     ) : (
//                       <Text type="secondary">Not provided</Text>
//                     )}
//                   </div>
//                   <div>
//                     <Text>Effectiveness Rating: </Text>
//                     {procedure.effectivenessRating !== null ? (
//                       <Text>{procedure.effectivenessRating}</Text>
//                     ) : (
//                       <Text type="secondary">Not provided</Text>
//                     )}
//                   </div>
//                 </Space>
//               </List.Item>
//             )}
//           />
//         </Card>
//       )}

//       {/* Remarks */}
//       {values.remarks && (
//         <Card title="Remarks">
//           <Text>{values.remarks}</Text>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default ReviewStep;







































































"use client";

import { NotificationType, ProcedureType } from "@/consts/data";
import { useUserMe } from "@/hooks/use-me";
import { getAllDevices } from "@/services/device.services";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Descriptions, Form, Input, Select, Typography } from "antd";
import { ArrowLeftFromLine, MoveLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
const { Title, Text } = Typography;

interface ReviewStepProps {
  values: {
    form1: {
      runwayConditionType1: string | null;
      coveragePercentage1: number | null;
      depth1: string | null;
      surfaceCondition1: string | null;
      runwayConditionType2: string | null;
      coveragePercentage2: number | null;
      depth2: string | null;
      surfaceCondition2: string | null;
      runwayConditionType3: string | null;
      coveragePercentage3: number | null;
      depth3: string | null;
      surfaceCondition3: string | null;
    };
    form2: {
      notificationType: string[];
      notification_details: { [key: string]: string | number | null };

      [key: (NotificationType | string)]: string | number | string[] | null | {};
    };
    form3: {
      "device-of-implementation": null,
      applicationTime: string;
      details: {
        coefficient1: undefined,
        chemicalType: ("HARD" | "LIQUID") | undefined,
        coefficient2: undefined,
        coefficient3: undefined
      },
      improvementProcedure: ProcedureType | null;
      RCR: string | null;
    };
  };
}

const ReviewStep = ({ values }: ReviewStepProps) => {
  const { form1, form2, form3 } = values;
  const router = useRouter();

  const { id } = useParams();
  const isCreateMode = id === "create";

  const UserData = useUserMe();

  const thirds = [
    {
      part: "Треть 1",
      rwyc: form1.runwayConditionType1,
      coverage: form1.coveragePercentage1,
      depth: form1.depth1,
      surface: form1.surfaceCondition1,
    },
    {
      part: "Треть 2",
      rwyc: form1.runwayConditionType2,
      coverage: form1.coveragePercentage2,
      depth: form1.depth2,
      surface: form1.surfaceCondition2,
    },
    {
      part: "Треть 3",
      rwyc: form1.runwayConditionType3,
      coverage: form1.coveragePercentage3,
      depth: form1.depth3,
      surface: form1.surfaceCondition3,
    },
  ];

  const NotificationNames = {
    [NotificationType.OTHER]: "Другое",
    [NotificationType.REDUCED_RUNWAY_LENGTH]: "Уменьшенная длина ВПП LDA",
    [NotificationType.SAND_ON_RUNWAY]: "Песок на ВПП",
    [NotificationType.DEBRIS_ON_RUNWAY_LEFT]: "Сугробы на ВПП (левый от оси ВПП)",
    [NotificationType.DEBRIS_ON_RUNWAY_RIGHT]: "Сугробы на ВПП (правый от оси ВПП)",
    [NotificationType.SNOW_BANK_NEAR_RUNWAY]: "Снежная позёмка на ВПП",
    [NotificationType.DEBRIS_ON_TAXIWAY_LEFT]: "Сугробы на РД Левый от оси РД",
    [NotificationType.DEBRIS_ON_TAXIWAY_RIGHT]: "Сугробы на РД Правый от оси ВПП",
    [NotificationType.SNOWDRIFTS_NEAR_RUNWAY]: "Сугробы вблизи ВПП",
    [NotificationType.TAXIWAY_POOR_CONDITION]: "РД Плохое",
    [NotificationType.APRON_POOR_CONDITION]: "Перрон Плохое",

    [NotificationType.DEBRIS_ON_RUNWAY]: "Сугробы на ВПП",
    [NotificationType.DEBRIS_ON_TAXIWAY]: "Сугробы на РД Левый от оси ВПП",
  };

  const ProcedureNames = {
    [ProcedureType.OTHER]: "Другое",
    [ProcedureType.BRUSHING]: "Щетки",
    [ProcedureType.CHEMICAL_TREATMENT]: "Реагенты",
    [ProcedureType.HARD]: "Жёсткий",
    [ProcedureType.LIQUID]: "Жидкий",
    [ProcedureType.PLOWING]: "Продув",
    [ProcedureType.SAND_APPLICATION]: "Песок",
  }


  const sostoyanie: Record<string, string> = {
    "DRY": "Сухой",
    "WET": "Мокрый",
    "ICE": "Лед",
    "DRY_SNOW": "Сухой снег",
    "MOISTURIZE_SNOW": "Мокрый снег",
    "HOARFROST": "Иней"

  }


  const AllDevicesData = useQuery({
    queryFn: () => getAllDevices(),
    queryKey: ["devices-list"],
  });

  console.log(AllDevicesData, "AllDevicesData");




  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        {!isCreateMode && <Button type="primary" onClick={() => router.back()} className="flex items-center" icon={<ArrowLeftFromLine size={15} className="mb-0"></ArrowLeftFromLine>}>Назад</Button>}
        <Title level={4} className="!mb-0">Обзор состояния ВПП</Title>
      </div>

      {/* <Card title="Состояние ВПП по третям">
        <Descriptions bordered column={1} size="small">
          {thirds.map((t, idx) => (
            <Descriptions.Item styles={{}} style={{
            }} key={idx} label={t.part} className="">
              <div className="space-y-1">
                <div><strong>RWYC:</strong> {t.rwyc ?? <Text type="secondary">Нет данных</Text>}</div>
                <div><strong>Процент покрытия:</strong> {t.coverage ?? <Text type="secondary">Нет данных</Text>}</div>
                <div><strong>Глубина:</strong> {t.depth ?? <Text type="secondary">Нет данных</Text>}</div>
                <div><strong>Состояние поверхности:</strong> {t.surface ?? <Text type="secondary">Нет данных</Text>}</div>
              </div>
            </Descriptions.Item>
          ))}
        </Descriptions>
      </Card> */}
      <div className="flex gap-4">
        <Card title="Общие сведения" className="" size="small" bordered >
          <div className="flex flex-col gap-2 mb-4">
            <Form.Item layout="horizontal" label="Аэродром" initialValue={UserData.data?.data?.airportDto.name} name={"airport"} className="mb-0">
              <Input readOnly></Input>
            </Form.Item >
            <Form.Item layout="horizontal" label="Дата/Время" name={"datetime"} className="mb-0">
              <Input readOnly></Input>
            </Form.Item>
            <Form.Item layout="horizontal" label="ВПП" name={"VPP"} className="mb-0">
              <Select options={UserData.data?.data.airportDto.runwayDtos.map(i => ({
                label: i.name + " | " + i.runwayDesignation,
                value: i.id
              }))}></Select>
            </Form.Item>
            <Form.Item layout="horizontal" label="Температура окр. среды" name={"temperature"} className="mb-0" >
              <Input readOnly suffix="°C"></Input>
            </Form.Item>
            <Form.Item layout="horizontal" label="Инициалы" name={"initials"} className="mb-0">
              <Input readOnly></Input>
            </Form.Item>
            <Form.Item layout="horizontal" label="Должность" name={"position"} className="mb-0">
              <Input readOnly></Input>
            </Form.Item>
          </div>
        </Card>
        <Card title="Состояние ВПП по третям" className="flex-grow">
          <div className="flex flex-col lg:flex-row gap-4">

            {thirds.map((t, idx) => (
              <Card key={idx} title={t.part} className="flex-1 border-[2px] border-[#00000060] dark:border-[#2c48c4cc]" size="small" bordered >
                <div className="space-y-2">
                  <div><strong>RWYC:</strong> {t.rwyc ?? <Text type="secondary">Нет данных</Text>}</div>
                  <div><strong>Процент покрытия:</strong> {t.coverage ?? <Text type="secondary">Нет данных</Text>}</div>
                  <div><strong>Глубина:</strong> {t.depth ?? <Text type="secondary">Нет данных</Text>}</div>
                  <div><strong>Состояние поверхности:</strong> {sostoyanie[t.surface as any] ?? <Text type="secondary">Нет данных</Text>}</div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>



      <div className="flex gap-4">
        <Card title="Ситуационные уведомления" className="flex-grow">
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Типы уведомлений">
              {form2.notificationType ? form2.notificationType.length > 0
                ? form2.notificationType.map((type) => NotificationNames[type as NotificationType]).join(", ") : "Нет данных"
                : <Text type="secondary">Нет данных</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="Сокращение длины ВПП">
              {(form2.notification_details[NotificationType.REDUCED_RUNWAY_LENGTH]) ?? <Text type="secondary">Нет данных</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="Сугробы на ВПП (Л/П)">
              {(!!form2.notification_details[NotificationType.DEBRIS_ON_RUNWAY_LEFT] && !!form2.notification_details[NotificationType.DEBRIS_ON_RUNWAY_RIGHT])
                ? `${form2.notification_details[NotificationType.DEBRIS_ON_RUNWAY_LEFT] ?? 0} / ${form2.notification_details[NotificationType.DEBRIS_ON_RUNWAY_RIGHT] ?? 0} м`
                : <Text type="secondary">Нет данных</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="Сугробы на РД (Л/П)">
              {(form2.notification_details[NotificationType.DEBRIS_ON_TAXIWAY_LEFT] !== null && form2.notification_details[NotificationType.DEBRIS_ON_TAXIWAY_RIGHT] !== null)
                ? `${form2.notification_details[NotificationType.DEBRIS_ON_TAXIWAY_LEFT] ?? 0} / ${form2.notification_details[NotificationType.DEBRIS_ON_TAXIWAY_RIGHT] ?? 0} м`
                : <Text type="secondary">Нет данных</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="Плохое состояние перрона">
              {form2.notification_details[NotificationType.APRON_POOR_CONDITION] ?? <Text type="secondary">Нет данных</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="Плохое состояние РД">
              {form2.notification_details[NotificationType.TAXIWAY_POOR_CONDITION] ?? <Text type="secondary">Нет данных</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="Другое">
              {form2.notification_details[NotificationType.OTHER] ?? <Text type="secondary">Нет данных</Text>}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card title="Коэффициенты сцепления">
          <div className="max-w-[300px]">
            <h3>Измеренный коэффициент сцепления</h3>
            <div className="flex gap-3 py-2">
              {[1, 2, 3].map((item) => (
                <div key={item}>
                  <Form.Item rules={[{
                    required: true,
                    message: "Обязательное поле"
                  }]} name={["details", `coefficient${item}`]}>
                    <Input readOnly={true} min={0} max={"99"} maxLength={2} type="number" className="w-16 h-16 text-center flex justify-center text-lg" />
                  </Form.Item>
                </div>
              ))}
            </div>
            <p>Коэффициент сцепления включает в ситуационный раздел представлении (RCR) в SNOWTAM</p>
          </div>
        </Card>
      </div>

      {form3?.improvementProcedure && (
        <Card title="Процедуры улучшения">
          <Descriptions bordered column={1} size="small">
            {[form3].filter(i => !!i).map((proc, idx) => (
              <Descriptions.Item key={idx} label={`Процедура №${idx + 1}`}>
                <div className="space-y-1">
                  <div><strong>Тип(ы):</strong> {proc.improvementProcedure ? ProcedureNames[proc.improvementProcedure] : <Text type="secondary">Нет</Text>}</div>
                  <div><strong>Тип химии:</strong> {proc.details.chemicalType ?? <Text type="secondary">Нет данных</Text>}</div>
                </div>
              </Descriptions.Item>
            ))}
            <Descriptions.Item label="Устройство">
              {AllDevicesData.data?.data.find(d => d.id === form3["device-of-implementation"])?.name
                // form3["device-of-implementation"] 

                ?? <Text type="secondary">Нет данных</Text>}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
      {!isCreateMode && (

        <Card title="RCR:">
          <Descriptions bordered column={1} size="small">
            <div>{form3.RCR}</div>
          </Descriptions>
        </Card>
      )}
    </div>
  );
};

export default ReviewStep;
