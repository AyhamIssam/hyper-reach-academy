"use client";

import { useState } from "react";

export default function AddCourseForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    const response = await fetch("/api/admin/create-course", {
      method: "POST",
      body: JSON.stringify({
        title: formData.get("title"),
        slug: formData.get("slug"),
        description: formData.get("description"),
        price: Number(formData.get("price")),
        thumbnail_url: formData.get("thumbnail_url"),
        is_published: formData.get("is_published") === "on",
      }),
    });

    setLoading(false);

    if (response.ok) {
      alert("تم إنشاء الدورة بنجاح");
      window.location.reload();
    } else {
        const data = await response.json();
        alert(data.error || "حدث خطأ");
    }
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4 border border-blue-900 rounded-2xl p-6 bg-[#071226]"
    >
      <h2 className="text-2xl font-bold">إضافة دورة جديدة</h2>

      <input
        name="title"
        placeholder="عنوان الدورة"
        className="w-full p-3 rounded-xl bg-[#0f172a] border border-gray-700"
      />

      <input
        name="slug"
        placeholder="course-slug"
        className="w-full p-3 rounded-xl bg-[#0f172a] border border-gray-700"
      />

      <textarea
        name="description"
        placeholder="وصف الدورة"
        className="w-full p-3 rounded-xl bg-[#0f172a] border border-gray-700"
      />

      <input
        name="price"
        type="number"
        placeholder="السعر"
        className="w-full p-3 rounded-xl bg-[#0f172a] border border-gray-700"
      />

      <input
        name="thumbnail_url"
        placeholder="رابط الصورة"
        className="w-full p-3 rounded-xl bg-[#0f172a] border border-gray-700"
      />

      <label className="flex items-center gap-2">
        <input type="checkbox" name="is_published" />
        <span>نشر الدورة مباشرة</span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl font-bold"
      >
        {loading ? "جاري الإنشاء..." : "إضافة الدورة"}
      </button>
    </form>
  );
}