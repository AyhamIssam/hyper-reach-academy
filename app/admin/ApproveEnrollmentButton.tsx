"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApproveEnrollmentButton({
  enrollmentId,
  approved,
}: {
  enrollmentId: number;
  approved: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function approve() {
    setLoading(true);

    const res = await fetch("/api/admin/approve-enrollment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ enrollmentId }),
    });

    const text = await res.text();

    let data: any = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      alert(`Response Error: ${text}`);
      setLoading(false);
      return;
    }

    setLoading(false);

    if (!res.ok) {
      alert(data.error || `HTTP Error: ${res.status}`);
      return;
    }

    alert("تمت الموافقة بنجاح");
    router.refresh();
  }

  if (approved) {
    return (
      <div className="rounded-xl bg-green-900/40 px-4 py-3 text-center text-green-300">
        Approved
      </div>
    );
  }

  return (
    <button
      onClick={approve}
      disabled={loading}
      className="w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
    >
      {loading ? "جاري الموافقة..." : "Approve"}
    </button>
  );
}