// src/app/[your-path]/AirportsPage.tsx

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Modal,
  Radio,
  Table,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import useLocalStorage from "use-local-storage";

import ViewAirportModal from "./_components/ViewAirportModal";
import { DeleteAirport, GetAllAirportsExtended } from "@/services/airport.services"; // если такого нет, нужно добавить


import {
  GetAllRunWayCondition,
} from "../../../services/runway-condition.services";
import { GetAllAirports } from "@/services/airport.services";

import type { IAirport } from "@/types/airport";

import AirportsMap from "./_components/AirportsMap";
import AddAirportModal from "./_components/AddAirportModal";
import EditAirportModal from "./_components/EditAirportModal";
import { toast } from "sonner";

function truncateText(text: string, maxLength = 12) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

export default function AirportsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [RunWayData, setRunWayData] = useLocalStorage(
    "runway-condition-draft",
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [finalRCRModalIsEnglish, setFinalRCRModalIsEnglish] =
    useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAirport, setEditingAirport] = useState<IAirport | null>(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState<IAirport | null>(null);





  const [rangePickerValue, setRangePickerValue] = useState<any>([
    dayjs().subtract(7, "day"),
    dayjs(),
  ]);

  const RWConditionData = useQuery({
    queryFn: () =>
      GetAllRunWayCondition({
        page: page - 1,
        size: pageSize,
        
      }),
    queryKey: ["rw-condition", page, pageSize, rangePickerValue],
  });

  const localStorageItem = localStorage.getItem("user");
  const user = localStorageItem ? JSON.parse(localStorageItem) : null;

  const AirportsData = useQuery({
    queryKey: ["airports-list"],
    queryFn: () =>
      GetAllAirportsExtended({
        page: 0,
        size: 100,
      }),
  });


    const statusByAirport = useMemo(() => {
        return AirportsData.data?.data.reduce<Record<number, string>>((acc, airport) => {
            // 1) get only the runways with a real latestRunwayCondition
            const valid = airport.runwayDtos.filter(
                (r) => r.latestRunwayCondition != null
            );

            // 2) if none, mark N/A
            if (valid.length === 0) {
                acc[airport.id] = "0";
                return acc;
            }

            // 3) otherwise pick the runway with the max updatedAt
            const newest = valid.reduce((a, b) => {
                return new Date(b.latestRunwayCondition!.updatedAt).getTime() >
                    new Date(a.latestRunwayCondition!.updatedAt).getTime()
                    ? b
                    : a;
            });

            // 4) store its applicationStatus
            acc[airport.id] = newest.latestRunwayCondition!.applicationStatus;
            return acc;
        }, {});
    }, [AirportsData.data?.data]);

     const data = AirportsData.data?.data.map((warehouse) => ({
        ...warehouse,
        status: statusByAirport?.[warehouse.id],
    }));

    console.log(data, statusByAirport, statusByAirport?.[1], "AAAAAAAAAAAAAAAAA");
    


  useEffect(() => {
    if (!!selectedAirport) {
      setSelectedAirport(AirportsData.data?.data.find((airport) => airport.id === selectedAirport.id) ?? selectedAirport);
    }
  }, [AirportsData.data, user]);

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


  const handleDeleteAirport = async (airportId: number) => {
    try {
      await DeleteAirport(airportId);
      toast.success("Аэропорт удалён");
      queryClient.invalidateQueries({ queryKey: ["airports-list"] });
      setViewModalOpen(false);
    } catch {
      toast.error("Не удалось удалить аэропорт");
    }
  };

  const handleEditAirport = (airport: IAirport) => {
    setEditingAirport(airport);
    setEditModalOpen(true);
    setViewModalOpen(false);
  };


  return (
    <>
      <Modal
        closeIcon={null}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        centered
        title={
          <div className="flex min-w-52 items-center justify-between pr-2">
            <p>RCR:</p>{" "}
            <Radio.Group
              buttonStyle="solid"
              value={finalRCRModalIsEnglish ? "ENG" : "RU"}
              onChange={(e) => {
                setFinalRCRModalIsEnglish(e.target.value === "ENG");
              }}
            >
              <Radio.Button value={"RU"}>RU</Radio.Button>
              <Radio.Button value={"ENG"}>ENG</Radio.Button>
            </Radio.Group>
          </div>
        }
      >
        {finalRCRModalIsEnglish ? (
          <p style={{ whiteSpace: "pre-line" }}>
            {
              "UTTT\n\n15071901RWY 08L 2/6/6 50/100/100 90/NR/NR ICE/СУХАЯ/СУХАЯ\n\n\nRUNWAY LENGTH REDUCED 3000M. BRUSHED. MEASURED FRICTION COEFFICIENTS: 50/50/50 ATT-ВПП."
            }
          </p>
        ) : (
          <p style={{ whiteSpace: "pre-line" }}>
            {
              "UTTT\n\n16070109 ВПП 08L 6/6/6 100/100/100 NR/NR/NR СУХАЯ/СУХАЯ/СУХАЯ\n\n\nОБРАБОТАН ТВЁРДЫМ РЕАГЕНТОМ. ХИМИЧЕСКИ ОБРАБОТАН. ИЗМЕРЕННЫЕ КОЭФФИЦИЕНТЫ СЦЕПЛЕНИЯ: 0/0/0."
            }
          </p>
        )}
      </Modal>

      <AddAirportModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["airports-list"] })}
      />
      <EditAirportModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["airports-list"] })}
        airport={editingAirport}
      />

      <ViewAirportModal
        open={viewModalOpen}
        airport={selectedAirport}
        onClose={() => setViewModalOpen(false)}
        onEdit={handleEditAirport}
        onDelete={handleDeleteAirport}
      />
      <div className="flex justify-end mb-4">
        <Button type="primary" onClick={() => setAddModalOpen(true)}>
          Добавить аэропорт
        </Button>
      </div>
      <div className="flex justify-center">
        <div className="w-[900px]">
          <AirportsMap
            onAirportClick={() => setModalOpen(true)}
            regionColors={regionFillColors}
            warehouses={data ?? []}
          />
        </div>
      </div>


      <div className="mt-6 flex justify-center">
        <Table
          rowKey="id"
          dataSource={
            AirportsData.data?.data.map((i) => ({ ...i, key: i.id })) || []
          }
          columns={[
            {
              title: "Аэропорт",
              dataIndex: "initialName",
              key: "initialName",
            },
            {
              title: "Температура воздуха",
              dataIndex: "temperature",
              key: "temperature",
            },
            {
              title: "ВПП",
              dataIndex: "runwayThirds",
              key: "runwayThirds",
              render: (_thirds, record) => <div>
                {(record.runwayDtos?.length ? `${record.runwayDtos?.length}` : 0)}
              </div>,
            },
            {
              title: "ВПП",
              dataIndex: "runwayThirds",
              key: "runwayThirds",
              render: (_thirds, record) => <div>
                {record.runwayDtos?.map((i) => i.runwayDesignation).join(", ") || ""}
              </div>,
            },
            {
              title: "Действия",
              key: "actions",
              render: (_, record) => (
                <div className="flex justify-center">
                  <Button size="small" onClick={(e) => {
                    e.stopPropagation();
                    setEditingAirport(record);
                    setEditModalOpen(true);
                  }}><EditOutlined
                      style={{ cursor: "pointer" }}

                    /></Button>
                </div>
              ),
            },
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
          onRow={(record) => ({
            onClick: () => {
              // setSelectedAirport(record);
              // setViewModalOpen(true);
              router.push("/airports/" + record.id);
            },
            style: { cursor: "pointer" },
          })}
          loading={RWConditionData.isLoading}
        />
      </div>
    </>
  );
}
