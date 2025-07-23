"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Descriptions,
  Empty,
  Modal,
  Popover,
  Radio,
  Spin,
  Table,
  Tabs,
} from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AcceptRunWayConditionById,
  DeclineRunWayConditionById,
  GetAllRunWayCondition,
  GetAllRunWayConditionByPeriod,
} from "../../../services/runway-condition.services";
import type { RunwayCondition } from "../../../types/runway-condition";

import { StopOutlined } from "@ant-design/icons";

import useLocalStorage from "use-local-storage";
import Loading from "@/components/Loading";
import { useUserMe } from "@/hooks/use-me";
import { ROLES } from "@/consts/role-based-routing";
import { Check } from "lucide-react";
import { toast } from "sonner";


const tabs = [
  { key: "PENDING", label: "В Процессе" },
  { key: "ACCEPTED", label: "Подтверждённые" },
  { key: "DECLINED", label: "Отклонённые" },
  { key: "SEND", label: "Отправлено" },
  { key: "FINISHED", label: "Завершенные" },
];

const SAItabs = [
  { key: "SEND", label: "Отправлено" },
  { key: "DECLINED", label: "Отклонённые" },
  { key: "FINISHED", label: "Завершенные" },
]

function truncateText(text: string, maxLength = 12) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

export default function Home() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const currentUser = useUserMe();
  const isOperator = currentUser.data?.data.role.includes(ROLES.OPERATOR);


  const [selectedRunwayCondition, setSelectedRunwayCondition] =
    useState<RunwayCondition | null>(null);
  const [FinalRCRModalOpen, setFinalRCRModalOpen] = useState(false);
  const [finalRCRModalIsEnglish, setFinalRCRModalIsEnglish] = useState(false);

  const isSAI = currentUser.data?.data.role.includes(ROLES.SAI);

  const [statusFilter, setStatusFilter] = useState<
    "PENDING" | "ACCEPTED" | "DECLINED" | "SEND" | "FINISHED"
  >(isSAI ? "SEND" : "PENDING");

  const [RunWayData, setRunWayData] = useLocalStorage(
    "runway-condition-draft",
    null,
  );

  const queryClient = useQueryClient();

  console.log(RunWayData, "RunWayData");

  const [rangePickerValue, setRangePickerValue] = useState<any>([
    dayjs().subtract(7, "day"),
    dayjs(),
  ]);

  const [tableSize, setTableSize] = useState<"small" | "middle" | "large">(
    "middle",
  );

  console.log(selectedRunwayCondition, "selectedRunwayCondition");
  

  useEffect(() => {
    const updateTableSize = () => {
      if (window.innerWidth < 992) {
        setTableSize("small"); // планшеты и меньше
      } else {
        setTableSize("middle"); // desktop
      }
    };

    updateTableSize(); // начальное состояние

    window.addEventListener("resize", updateTableSize);
    return () => window.removeEventListener("resize", updateTableSize);
  }, []);

  const RWConditionData = useQuery({
    queryFn: () =>
      GetAllRunWayCondition({
        page: page - 1,
        size: pageSize,
        ...(isSAI && { applicationStatus: "SEND" }),
        applicationStatus: statusFilter
        // from: rangePickerValue[0].format('YYYY-MM-DD'),
        // to: rangePickerValue[1].format('YYYY-MM-DD'),
        // query: ""
      }),
    queryKey: [`rw-condition`, page, pageSize, rangePickerValue, isSAI, statusFilter],
  });

  const localStorageItem = localStorage.getItem("user");
  const user = localStorageItem ? JSON.parse(localStorageItem) : null;

  const AcceptRCR = useMutation({
    mutationFn: ({ }: {}) =>
      AcceptRunWayConditionById({
        id: Number(selectedRunwayCondition?.id),
      }),
  });

  const DeclineRCR = useMutation({
    mutationFn: ({ }: {}) =>
      DeclineRunWayConditionById({
        id: Number(selectedRunwayCondition?.id),
      }),
  });


  useEffect(() => {
    if (!!selectedRunwayCondition) {
      setSelectedRunwayCondition(RWConditionData.data?.data.find(i => i.id == selectedRunwayCondition?.id) ?? selectedRunwayCondition)
    }
  }, [RWConditionData.data])

  useEffect(() => {
    if (selectedRunwayCondition) {
      const updated = RWConditionData.data?.data.find(
        (i) => i.id === selectedRunwayCondition.id
      );
      if (updated) setSelectedRunwayCondition(updated);
    }
  }, [RWConditionData.data]);

  return (
    <div className="">
      <Modal
        centered
        width={1000}
        closeIcon={null}
        title={
          <div className="flex min-w-52 items-center justify-between pr-2">
            <p className="text-xl">RCR:</p>{" "}
            <Radio.Group
              buttonStyle="solid"
              value={finalRCRModalIsEnglish == true ? "ENG" : "RU"}
              onChange={(e) => {
                setFinalRCRModalIsEnglish(e.target.value === "ENG");
              }}
            >
              <Radio.Button value={"RU"}>RU</Radio.Button>
              <Radio.Button value={"ENG"}>ENG</Radio.Button>
            </Radio.Group>
          </div>
        }
        maskClosable={false}
        footer={null}
        open={FinalRCRModalOpen}
        onOk={() => { }}
        onCancel={() => {
          setFinalRCRModalOpen(false);
          toast.success("Runway condition created successfully!");
          router.push("/");
        }}
      >
        <div className="flex justify-center">
          <div className="flex flex-col gap-6 py-6 text-2xl">
            {finalRCRModalIsEnglish ? (
              <div>
                <p style={{ whiteSpace: "pre-line" }}>
                  {selectedRunwayCondition?.finalRCR}
                </p>
              </div>
            ) : (
              <div>
                <p style={{ whiteSpace: "pre-line" }}>
                  {selectedRunwayCondition?.finalRCRru}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-4">
          <Button
            onClick={() => {
              setFinalRCRModalOpen(false);
            }}
            size="large"
          >
            Назад
          </Button>
          <div className="flex items-center gap-4">
            <Button
              loading={AcceptRCR.isPending}
              type="primary"
              disabled={
                selectedRunwayCondition?.applicationStatus == "FINISHED" ||
                selectedRunwayCondition?.applicationStatus == "DECLINED"
              }
              onClick={() => {
                AcceptRCR.mutate("", {
                  onSuccess(data, variables, context) {
                    toast.success("Успешно подтвердил RCR");
                    queryClient.invalidateQueries();
                    RWConditionData.refetch();
                    setFinalRCRModalOpen(false);
                  },
                });
              }}
              className="flex items-center"
              icon={<Check size={15} className="mb-0"></Check>}
            >
              Подтвердить
            </Button>
            <Button
              type="primary"
              loading={DeclineRCR.isPending}
              disabled={
                selectedRunwayCondition?.applicationStatus == "FINISHED" ||
                selectedRunwayCondition?.applicationStatus == "DECLINED"
              }
              danger
              onClick={() => {
                DeclineRCR.mutate("", {
                  onSuccess(data, variables, context) {
                    toast.success("Успешно отклонил RCR");
                    queryClient.invalidateQueries();
                    RWConditionData.refetch();
                    setFinalRCRModalOpen(false);


                  },
                });
              }}
              className="flex items-center"
              icon={<StopOutlined size={15} className="mb-0"></StopOutlined>}
            >
              Отклонить
            </Button>{" "}
          </div>
        </div>
      </Modal>



      <div className="flex justify-end">
        {!isSAI && (
          <Button
            type="primary"
            variant="solid"
            size="large"
            onClick={() => router.push("/runway-condition/create")}
          >
            Создать
          </Button>
        )}
      </div>
      <Tabs
        activeKey={statusFilter}
        onChange={(key) =>
          setStatusFilter(key as "PENDING" | "ACCEPTED" | "DECLINED" | "SEND")
        }
        items={(isSAI ? SAItabs : tabs).map((t) => ({ key: t.key, label: t.label }))}
        style={{}}
        className="!mb-0"
      />
      <div className="mt-2 flex items-start justify-center">
        {RWConditionData.isLoading ? (
          // <Spin size="large" />
          <div className="flex items-start justify-center">
            <Loading />
          </div>
        ) : RWConditionData.isError ? (
          <Alert
            type="error"
            message="Failed to load data"
            description={RWConditionData.error?.message || ""}
          />
        ) : RWConditionData.data?.data &&
          RWConditionData.data.data.length > 0 ? (
          <div>

            <Table
              size={"large"}
              className={[
                tableSize == "small"
                  ? "!min-w-[600px]"
                  : "!min-w-[1200px] !text-lg",
              ].join(" ")}
              rowKey="id"
              dataSource={RWConditionData.data.data as RunwayCondition[]}
              columns={[
                {
                  title: "Код аэропорта",
                  dataIndex: "airportCode",
                  key: "airportCode",
                  render(value, record, index) {
                    return (
                      <div className="!text-lg">
                        {record.runwayDto.airportDto.airportCode}
                      </div>
                    );
                  },
                  align: "center",
                },
                {
                  title: "Обозначение ВПП",
                  dataIndex: "initials",
                  key: "initials",

                  align: "center",
                  render(value, record, index) {
                    return (
                      <div className="!text-lg">
                        {record.runwayDto.runwayDesignation}
                      </div>
                    );
                  },
                },
                {
                  title: "Дата и время отчёта",
                  dataIndex: "createdAt",
                  key: "createdAt",
                  render: (date) => {
                    return (
                      <div className="!text-lg">
                        {date.length != 0
                          ? dayjs(date).format("YYYY-MM-DD HH:mm:ss")
                          : date}
                      </div>
                    );
                  },
                  align: "center",
                },
                {
                  title: "Инициалы",
                  dataIndex: "initialName",
                  key: "initialName",
                  render: (initialName) => (
                    <div className="!text-lg">{initialName}</div>
                  ),
                  align: "center",
                },
                {
                  title: "Температура воздуха",
                  dataIndex: "ambientTemperature",
                  key: "ambientTemperature",
                  align: "center",
                  render(value, record, index) {
                    return <div className="!text-lg">{value}</div>;
                  },
                },

                {
                  title: "Ситуационные уведомления",
                  dataIndex: "situationalNotifications",
                  key: "situationalNotifications",
                  render: (n) => <div className="!text-lg">{n?.length || 0}</div>,
                  align: "center",
                },
                {
                  title: "Процедуры улучшения",
                  dataIndex: "improvementProcedures",
                  key: "improvementProcedures",
                  render: (p) => <div className="!text-lg">{p?.length || 0}</div>,
                  align: "center",
                },
                {
                  title: "Статус",
                  dataIndex: "applicationStatus",
                  key: "applicationStatus",

                  render: (p) => (
                    <Button type="default" className="!text-lg">
                      {(p == "FINISHED" || p == "ACCEPTED")
                        ? "Подтверждено"
                        : (p == "PENDING" || p == "SEND")
                          ? "В процессе"
                          : "Отклонено"}
                    </Button>
                  ),
                  align: "center",
                },
              ]}
              pagination={{
                current: page,
                pageSize: pageSize,
                total: RWConditionData.data?.elements || 0,
                onChange: (newPage, newPageSize) => {
                  setPage(newPage);
                  setPageSize(newPageSize);
                },
                showSizeChanger: true,
                pageSizeOptions: [5, 10, 20, 50, 100],
              }}
              onRow={(record) => {
                return {
                  onClick: () => {
                    if (isSAI) {
                      setFinalRCRModalOpen(true);
                      setSelectedRunwayCondition(record);
                    } else {
                      router.push(`/runway-condition/${record.id}`);
                    }
                  },
                  style: { cursor: "pointer" },
                };
              }}
              loading={RWConditionData.isLoading}
            />
          </div>
        ) : (
          <Empty description="Нет данных о состоянии ВПП" />
        )}
      </div>
    </div>
  );
}
