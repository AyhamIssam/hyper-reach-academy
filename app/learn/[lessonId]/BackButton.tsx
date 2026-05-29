"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="rounded-xl bg-slate-800 px-4 py-2 hover:bg-slate-700"
    >
      ← رجوع
    </button>
  );
}