"use client"

import { useQuery } from "@tanstack/react-query";
import { Alert, Button, DatePicker, Empty, Popover, Spin, Table } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GetAllRunWayCondition, GetAllRunWayConditionByPeriod } from "../../../services/runway-condition.services";
import type { RunwayCondition } from "../../../types/runway-condition";

import useLocalStorage from "use-local-storage";

function truncateText(text: string, maxLength = 12) {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

export default function Home() {
  const router = useRouter()
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [RunWayData, setRunWayData] = useLocalStorage("runway-condition-draft", null);
  console.log(RunWayData, "RunWayData");

  const [rangePickerValue, setRangePickerValue] = useState<any>([dayjs().subtract(7, 'day'), dayjs()]);


  const RWConditionData = useQuery({
    queryFn: () => GetAllRunWayCondition({
      page: page - 1,
      size: pageSize,
      // from: rangePickerValue[0].format('YYYY-MM-DD'),
      // to: rangePickerValue[1].format('YYYY-MM-DD'),
      // query: ""
    }),
    queryKey: [`rw-condition`, page, pageSize, rangePickerValue]
  })


  const localStorageItem = localStorage.getItem("user");
  const user = localStorageItem ? JSON.parse(localStorageItem) : null;

  return (
    <div className="">
      <div className="flex justify-end">
        <Button type="primary" variant="solid" size="large"
          onClick={() => router.push('/runway-condition/create')}
        >
          Создать
        </Button>
      </div>
      <div className="mt-6 flex justify-center">
        {RWConditionData.isLoading ? (
          <Spin size="large" />
        ) : RWConditionData.isError ? (
          <Alert type="error" message="Failed to load data" description={RWConditionData.error?.message || ''} />
        ) : RWConditionData.data?.data && RWConditionData.data.data.length > 0 ? (
          <Table
            className="!min-w-[1100px]"
            rowKey="id"
            dataSource={RWConditionData.data.data as RunwayCondition[]}
            columns={[
              {
                title: 'Код аэропорта', dataIndex: 'airportCode', key: 'airportCode', render(value, record, index) {
                  return <div>{record.runwayDto.airportDto.airportCode}</div>
                },
                align: "center"
              },
              {
                title: 'Обозначение ВПП',
                dataIndex: 'initials', key: 'initials',

                align: "center",
                render(value, record, index) {
                  return <div>{record.runwayDto.runwayDesignation}</div>
                }
              },
              {
                title: 'Дата и время отчёта', dataIndex: 'createdAt', key: 'createdAt', render: (date) => {
                  return date.length != 0 ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : date
                }
              },
              { title: 'Температура воздуха', dataIndex: 'ambientTemperature', key: 'ambientTemperature', align: "center" },
              { title: 'Трети', dataIndex: 'runwayThirds', key: 'runwayThirds', render: (thirds) => thirds?.length || 0, align: "center" },
              { title: 'Ситуационные уведомления', dataIndex: 'situationalNotifications', key: 'situationalNotifications', render: (n) => n?.length || 0, align: "center" },
              { title: 'Процедуры улучшения', dataIndex: 'improvementProcedures', key: 'improvementProcedures', render: (p) => p?.length || 0, align: "center" },
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
                  router.push(`/runway-condition/${record.id}`);
                },
                style: { cursor: 'pointer' },
              };
            }}
            loading={RWConditionData.isLoading}
          />
        ) : (
          <Empty description="No runway condition data found" />
        )}
      </div>
    </div>
  );
}
