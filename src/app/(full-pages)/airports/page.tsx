"use client"

import { useQuery } from "@tanstack/react-query";
import { Alert, Button, DatePicker, Empty, Popover, Spin, Table } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GetAllRunWayCondition, GetAllRunWayConditionByPeriod } from "../../../services/runway-condition.services";
import type { RunwayCondition } from "../../../types/runway-condition";

import useLocalStorage from "use-local-storage";
import { GetAllAirports } from "@/services/airport.services";
import AirportsMap from "./_components/AirportsMap";

function truncateText(text: string, maxLength = 12) {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

export default function AirportsPage() {
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


  const AirportsData = useQuery({
    queryKey: ['airports-list'],
    queryFn: () => GetAllAirports({
      page: 0,
      size: 100
    }),
  });

  console.log(AirportsData.data, "AirportsData");


  const regionFillColors: Record<number, string> = {
    1: "#a4edff",
    2: "#a4edff",
    3: "#a4edff",
    4: "#0069c0",
    5: "#1890ff",
    6: "#1890ff",
    7: "#0069c0",
    8: "#26c2ff",
    9: "#26c2ff",
    10: "#0069c0",
    11: "#1695f2",
    12: "#a4edff",
    13: "#0069c0",
    14: "#1695f2",
  };

  return (
    <div className="">

      <div className="flex justify-center">
        <div className="w-[700px]">
          <AirportsMap regionColors={regionFillColors} warehouses={AirportsData.data?.data ?? []}></AirportsMap>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Table
          rowKey="id"
          dataSource={AirportsData.data?.data.map(i => ({ ...i, key: i.id })) || []}
          columns={[
            { title: 'Aeroport nomi', dataIndex: 'initialName', key: 'initialName' },
            { title: 'Температура воздуха', dataIndex: 'temperature', key: 'temperature' },
            { title: 'Трети', dataIndex: 'runwayThirds', key: 'runwayThirds', render: (thirds, record) => record.runwayDtos?.length || 0 },
            // { title: 'Ситуационные уведомления', dataIndex: 'situationalNotifications', key: 'situationalNotifications', render: (n) => n?.length || 0 },
            // { title: 'Процедуры улучшения', dataIndex: 'improvementProcedures', key: 'improvementProcedures', render: (p) => p?.length || 0 },
          ]}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: AirportsData.data?.elements || 0,
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
                router.push(`/runway-condition/${""}`);
              },
              style: { cursor: 'pointer' },
            };
          }}
          loading={RWConditionData.isLoading}
        />
      </div>
    </div>
  );
}
