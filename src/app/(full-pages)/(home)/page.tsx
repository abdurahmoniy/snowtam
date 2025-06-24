"use client"

import { Button } from "antd";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  return (
    <div className="">
      <div className="flex justify-end">
        <Button type="primary" variant="solid" size="large"
          onClick={() => router.push('/runway-condition/create')}
        >
          Create new
        </Button>
      </div>
    </div>
  );
}
