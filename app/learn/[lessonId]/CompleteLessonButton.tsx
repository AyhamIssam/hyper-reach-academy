"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CompleteLessonButton({
  lessonId,
  completed,
}: {
  lessonId: number;
  completed: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function completeLesson() {
    setLoading(true);

    const res = await fetch("/api/complete-lesson", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lessonId }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error);
      console.log(data);
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={completeLesson}
      disabled={loading || completed}
      className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl disabled:opacity-50"
    >
      {loading ? "جاري الحفظ..." : completed ? "تم إكمال الدرس" : "إكمال الدرس"}
    </button>
  );
}