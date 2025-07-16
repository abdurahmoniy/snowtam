

"use client";

import { NotificationType, ProcedureType } from "@/consts/data";
import { useUserMe } from "@/hooks/use-me";
import { getAllDevices } from "@/services/device.services";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Descriptions, Form, FormInstance, Input, InputNumber, Radio, Select, Typography } from "antd";
import dayjs from "dayjs";
import { ArrowLeftFromLine, MoveLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
        chemicalType: ("HARD" | "LIQUID") | null,
        coefficient2: undefined,
        coefficient3: undefined
      },
      improvementProcedure: ProcedureType[];
      RCR: string | null;
      RCRru: string | null;
    };
  };
  formInstance: FormInstance
}

const ReviewStep = ({ values, formInstance }: ReviewStepProps) => {
  const { form1, form2, form3 } = values;
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(dayjs().format("DD-MM HH:mm"));


  const { id } = useParams();
  const isCreateMode = id === "create";

  const UserData = useUserMe();
  const [finalRCRModalIsEnglish, setFinalRCRModalIsEnglish] = useState(false);



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

  const ProcedureNames: Record<ProcedureType | any, string> = {
    [ProcedureType.OTHER]: "Другое",
    [ProcedureType.BRUSHING]: "Щетки",
    [ProcedureType.CHEMICAL_TREATMENT]: "Хим обработка",
    [ProcedureType.HARD]: "Твердый",
    [ProcedureType.LIQUID]: "Жидкая",
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




  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs().format("DD-MM HH:mm");
      setCurrentTime(now);
      formInstance.setFieldsValue({ datetime: now }); // ⬅️ добавлено!
    }, 1000);

    return () => clearInterval(interval); // очищаем при размонтировании
  }, []);


  console.log(thirds, "thirds");


  console.log((form3.improvementProcedure
    ?
    (!!form3.improvementProcedure.find(i => i == ProcedureType.CHEMICAL_TREATMENT)
      ?
      [...form3.improvementProcedure.filter(i => i != ProcedureType.CHEMICAL_TREATMENT), form3.details.chemicalType as any]
      :
      form3.improvementProcedure)?.map(i => ({
        applicationTime: dayjs(form3.applicationTime).format('YYYY-MM-DDTHH:mm:ss'),
        procedureType: i,
      }))
    : []), "AAAAAAAAA");



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
                <div><strong>RWYC:</strong> {t.rwyc ?? <Text type="secondary">N/R</Text>}</div>
                <div><strong>Процент покрытия:</strong> {t.coverage ?? <Text type="secondary">N/R</Text>}</div>
                <div><strong>Глубина:</strong> {t.depth ?? <Text type="secondary">N/R</Text>}</div>
                <div><strong>Состояние поверхности:</strong> {t.surface ?? <Text type="secondary">N/R</Text>}</div>
              </div>
            </Descriptions.Item>
          ))}
        </Descriptions>
      </Card> */}
      {!isCreateMode && (

        <Card title={
          // "RCR:"
          <div className="flex items-center min-w-52 justify-between pr-8"><p>RCR:</p> <Radio.Group buttonStyle="solid" value={finalRCRModalIsEnglish == true ? "ENG" : "RU"} onChange={(e) => {
            setFinalRCRModalIsEnglish(e.target.value === "ENG");
          }}>
            <Radio.Button value={"RU"}>RU</Radio.Button>
            <Radio.Button value={"ENG"}>ENG</Radio.Button>
          </Radio.Group></div>
        }>
          <Descriptions bordered column={1} size="small">
            {
              finalRCRModalIsEnglish ? <div>
                <p>{form3?.RCR}</p>
              </div> : <div>
                <p>{form3?.RCRru}</p>
              </div>
            }
          </Descriptions>
        </Card>
      )}

      <div className="flex gap-4">
        <Card title="Общие сведения" className="" size="small" bordered >
          {/* <div className="flex flex-col gap-2 mb-4">
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
          </div> */}
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex w-[150px]">Аэродром:</div>
              <Form.Item layout="horizontal" label="" initialValue={UserData.data?.data?.airportDto.name} name={"airport"} className="mb-0 w-[250px]">
                <Input readOnly></Input>
              </Form.Item >

            </div>
            <div className="flex items-center justify-between">
              <div className="flex w-[150px]">Дата/Время: <br />(ДД-ММ ЧЧ:ММ)</div>
              <Form.Item layout="horizontal" label="" name={"datetime"} className="mb-0 w-[250px]">
                <Input readOnly value={currentTime}></Input>
              </Form.Item>

            </div>
            <div className="flex items-center justify-between">
              <div className="flex w-[150px]">ВПП:</div>
              <Form.Item layout="horizontal" label="" name={"VPP"} className="mb-0 w-[250px]">
                <Select open={false} options={UserData.data?.data.airportDto.runwayDtos.map(i => ({
                  label: i.runwayDesignation,
                  value: i.id
                }))}></Select>
                {/* <Input readOnly></Input> */}
              </Form.Item>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex w-[150px]">Температура окр. среды:</div>
              <Form.Item layout="horizontal" label="" name={"temperature"} className="mb-0 w-[250px]" >
                <Input readOnly suffix="°C"></Input>
              </Form.Item>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex w-[150px]">Инициалы:</div>
              <Form.Item layout="horizontal" label="" name={"initials"} className="mb-0 w-[250px]">
                <Input readOnly ></Input>
              </Form.Item>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex w-[150px]">Должность:</div>
              <Form.Item layout="horizontal" label="" name={"position"} className="mb-0 w-[250px]">
                <Input readOnly></Input>
              </Form.Item>
            </div>
          </div>
        </Card>
        <Card title="Состояние ВПП по третям" className="flex-grow">
          <div className="flex flex-col lg:flex-row gap-4">

            {thirds.map((t, idx) => (
              <Card key={idx} title={t.part} className="flex-1 border-[2px] border-[#00000060] dark:border-[#2c48c4cc]" size="small" bordered >
                <div className="space-y-2">
                  <div><strong>RWYC:</strong> {t.rwyc ?? <Text type="secondary">N/R</Text>}</div>
                  <div><strong>Процент покрытия:</strong> {t.coverage ?? <Text type="secondary">N/R</Text>}</div>
                  <div><strong>Глубина:</strong> {!!t.depth ? t.depth : <Text type="secondary">N/R</Text>}</div>
                  <div><strong>Состояние поверхности:</strong> {sostoyanie[t.surface as any] ?? <Text type="secondary">N/R</Text>}</div>
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
                ? form2.notificationType.map((type) => NotificationNames[type as NotificationType]).join(", ") : "N/R"
                : <Text type="secondary">N/R</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="Сокращение длины ВПП">
              {(form2.notification_details[NotificationType.REDUCED_RUNWAY_LENGTH]) ?? <Text type="secondary">N/R</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="Сугробы на ВПП (Л/П)">
              {(!!form2.notification_details[NotificationType.DEBRIS_ON_RUNWAY_LEFT] && !!form2.notification_details[NotificationType.DEBRIS_ON_RUNWAY_RIGHT])
                ? `${form2.notification_details[NotificationType.DEBRIS_ON_RUNWAY_LEFT] ?? 0} / ${form2.notification_details[NotificationType.DEBRIS_ON_RUNWAY_RIGHT] ?? 0} м`
                : <Text type="secondary">N/R</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="Сугробы на РД (Л/П)">
              {(form2.notification_details[NotificationType.DEBRIS_ON_TAXIWAY_LEFT] !== null && form2.notification_details[NotificationType.DEBRIS_ON_TAXIWAY_RIGHT] !== null)
                ? `${form2.notification_details[NotificationType.DEBRIS_ON_TAXIWAY_LEFT] ?? 0} / ${form2.notification_details[NotificationType.DEBRIS_ON_TAXIWAY_RIGHT] ?? 0} м`
                : <Text type="secondary">N/R</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="Плохое состояние перрона">
              {form2.notification_details[NotificationType.APRON_POOR_CONDITION] ?? <Text type="secondary">N/R</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="Плохое состояние РД">
              {form2.notification_details[NotificationType.TAXIWAY_POOR_CONDITION] ?? <Text type="secondary">N/R</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="Другое">
              {form2.notification_details[NotificationType.OTHER] ?? <Text type="secondary">N/R</Text>}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        {form3.details.coefficient1 == null ? null : <Card title="Коэффициенты сцепления">
          <div className="max-w-[300px]">
            <h3>Измеренный коэффициент сцепления</h3>
            <div className="flex gap-3 py-2">
              {[1, 2, 3].map((item) => (
                <div key={item}>
                  <Form.Item rules={[{
                    required: true,
                    message: "Обязательное поле"
                  }]} name={["details", `coefficient${item}`]}>
                    <InputNumber
                      min={0}
                      max={100}
                      step={1}
                      className="flex h-16 w-16 items-center justify-center text-center text-lg"
                      maxLength={2}
                      type="number"
                      readOnly
                    />
                  </Form.Item>
                </div>
              ))}
            </div>
            <p>Коэффициент сцепления включает в ситуационный раздел представлении (RCR) в SNOWTAM</p>
          </div>
        </Card>}

      </div>

      {form3?.improvementProcedure && (
        // <Card title="Процедуры улучшения">
        //   <Descriptions bordered column={1} size="small">
        //     {(form3.improvementProcedure 
        //     ? 
        //     (!!form3.improvementProcedure.find(i => i == ProcedureType.CHEMICAL_TREATMENT) 
        //     ? 
        //       [...form3.improvementProcedure.filter(i => i != ProcedureType.CHEMICAL_TREATMENT), form3.details.chemicalType as any] 
        //       : 
        //       form3.improvementProcedure)?.map(i => ({
        //       applicationTime: dayjs(form3.applicationTime).format('YYYY-MM-DDTHH:mm:ss'),
        //       procedureType: i,
        //     })) 
        //     : [])



        //     .filter(i => i.procedureType != ProcedureType.CHEMICAL_TREATMENT).map((proc, idx) => {

        //       if (proc.procedureType == ProcedureType.HARD || proc.procedureType == ProcedureType.LIQUID) {
        //         return <Descriptions.Item key={idx} label={`Процедура №${idx + 1}`}>
        //           <div className="space-y-1">
        //             <div><strong>Тип(ы):</strong> {proc ? "Хим обработка" : <Text type="secondary">Нет</Text>}</div>
        //             <div><strong>Тип химии:</strong> {ProcedureNames[proc.procedureType] ?? <Text type="secondary">N/R</Text>}</div>
        //           </div>
        //         </Descriptions.Item>
        //       }

        //       return (
        //         <Descriptions.Item key={idx} label={`Процедура №${idx + 1}`}>
        //           <div className="space-y-1">
        //             <div><strong>Тип(ы):</strong> {proc ? ProcedureNames[proc.procedureType] : <Text type="secondary">Нет</Text>}</div>
        //             <div><strong>Тип химии:</strong> {(<Text type="secondary">N/R</Text>)}</div>
        //           </div>
        //         </Descriptions.Item>
        //       )
        //     })}
        //     <Descriptions.Item label="Устройство">
        //       {AllDevicesData.data?.data.find(d => d.id === form3["device-of-implementation"])?.name

        //         ?? <Text type="secondary">N/R</Text>}
        //     </Descriptions.Item>
        //   </Descriptions>
        // </Card>
        <Card title="Процедуры улучшения">
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Процедуры">
              {form3.improvementProcedure.length === 0 ? (
                <Text type="secondary">N/R</Text>
              ) : (
                form3.improvementProcedure
                  .map((type) => {
                    if (type === ProcedureType.CHEMICAL_TREATMENT) {
                      const chemicalType = ProcedureNames[form3.details.chemicalType || ""] ?? "N/R";
                      return `${ProcedureNames[type]} (${chemicalType})`;
                    }
                    return ProcedureNames[type];
                  })
                  .join(", ")
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Устройство">
              {AllDevicesData.data?.data.find(d => d.id === form3["device-of-implementation"])?.name
                ?? <Text type="secondary">N/R</Text>}
            </Descriptions.Item>
          </Descriptions>
        </Card>


      )}

    </div>
  );
};

export default ReviewStep;
