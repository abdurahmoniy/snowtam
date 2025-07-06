"use client"

import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Empty, Popover, Spin, Table } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GetAllRunWayCondition } from "../../../services/runway-condition.services";
import type { RunwayCondition } from "../../../types/runway-condition";

// Utility to truncate text
function truncateText(text: string, maxLength = 12) {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

export default function Home() {
  const router = useRouter()
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const RWConditionData = useQuery({
    queryFn: () => GetAllRunWayCondition({
      page: page - 1,
      size: pageSize
    }),
    queryKey: [`rw-condition`, page, pageSize]
  })

  return (
    <div className="">
      <div className="flex justify-end">
        <Button type="primary" variant="solid" size="large"
          onClick={() => router.push('/runway-condition/create')}
        >
          Create new
        </Button>
      </div>
      <div className="mt-6">
        {RWConditionData.isLoading ? (
          <Spin size="large" />
        ) : RWConditionData.isError ? (
          <Alert type="error" message="Failed to load data" description={RWConditionData.error?.message || ''} />
        ) : RWConditionData.data?.data && RWConditionData.data.data.length > 0 ? (
          <Table
            rowKey="id"
            dataSource={RWConditionData.data.data as RunwayCondition[]}
            columns={[
              // { title: 'ID', dataIndex: 'id', key: 'id' },
              { title: 'Airport Code', dataIndex: 'airportCode', key: 'airportCode' },
              { title: 'Runway Designation', dataIndex: 'runwayDesignation', key: 'runwayDesignation' },
              { title: 'Report DateTime', dataIndex: 'reportDateTime', key: 'reportDateTime', render: (date) => date ? dayjs(date).format('YYYY-MM-DD') : '' },
              { title: 'Ambient Temp', dataIndex: 'ambientTemperature', key: 'ambientTemperature' },
              { title: 'Initials', dataIndex: 'initials', key: 'initials' },
              { title: 'RWYC Code', dataIndex: 'rwycCode', key: 'rwycCode' },
              { title: 'Overall Condition', dataIndex: 'overallConditionCode', key: 'overallConditionCode' },
              {
                title: 'Remarks', dataIndex: 'remarks', key: 'remarks', render: (text) => (
                  <Popover content={text}>
                    <span>{truncateText(text)}</span>
                  </Popover>
                )
              },
              { title: 'Runway Thirds', dataIndex: 'runwayThirds', key: 'runwayThirds', render: (thirds) => thirds?.length || 0 },
              { title: 'Situational Notifications', dataIndex: 'situationalNotifications', key: 'situationalNotifications', render: (n) => n?.length || 0 },
              { title: 'Improvement Procedures', dataIndex: 'improvementProcedure', key: 'improvementProcedure', render: (p) => p?.length || 0 },
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
            loading={RWConditionData.isLoading}
          />
        ) : (
          <Empty description="No runway condition data found" />
        )}
      </div>
    </div>
  );
}
