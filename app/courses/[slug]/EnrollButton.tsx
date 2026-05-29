"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EnrollButton({
  courseId,
  isLoggedIn,
}: {
  courseId: number;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function enroll() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/enroll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ courseId }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "حدث خطأ أثناء التسجيل");
      return;
    }

    if (data.alreadyRegistered) {
      alert("طلبك موجود مسبقًا، بانتظار موافقة الإدارة بعد الدفع");
    } else {
      alert("تم إرسال طلب التسجيل، سيتم تفعيل الدورة بعد تأكيد الدفع");
    }

    router.refresh();
  }

  return (
    <button
      onClick={enroll}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl mb-12 disabled:opacity-50"
    >
      {loading
        ? "جاري إرسال الطلب..."
        : isLoggedIn
          ? "طلب التسجيل في الدورة"
          : "سجل دخول أولاً"}
    </button>
  );
}