"use client";

import { useState } from "react";

export default function CoursesManager({ courses }: { courses: any[] }) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function updateCourse(formData: FormData) {
    setLoading(true);

    const response = await fetch("/api/admin/update-course", {
      method: "POST",
      body: JSON.stringify({
        id: Number(formData.get("id")),
        title: formData.get("title"),
        slug: formData.get("slug"),
        description: formData.get("description"),
        price: Number(formData.get("price")),
        thumbnail_url: formData.get("thumbnail_url"),
        is_published: formData.get("is_published") === "on",
      }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      alert(data.error || "حدث خطأ أثناء التعديل");
      return;
    }

    alert("تم تعديل الدورة");
    window.location.reload();
  }

  async function deleteCourse(id: number) {
    const confirmDelete = confirm("هل أنت متأكد من حذف هذه الدورة؟");

    if (!confirmDelete) return;

    setLoading(true);

    const response = await fetch("/api/admin/delete-course", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      alert(data.error || "حدث خطأ أثناء الحذف");
      return;
    }

    alert("تم حذف الدورة");
    window.location.reload();
  }

  return (
    <section className="border border-blue-900 rounded-2xl p-6 bg-[#071226]">
      <h2 className="text-2xl font-bold mb-6">إدارة الدورات</h2>

      <div className="space-y-5">
        {courses?.map((course) => (
          <div
            key={course.id}
            className="border border-gray-800 rounded-xl p-4"
          >
            {editingId === course.id ? (
              <form action={updateCourse} className="space-y-3">
                <input type="hidden" name="id" defaultValue={course.id} />

                <input
                  name="title"
                  defaultValue={course.title}
                  className="w-full p-3 rounded-xl bg-[#0f172a] border border-gray-700"
                />

                <input
                  name="slug"
                  defaultValue={course.slug}
                  className="w-full p-3 rounded-xl bg-[#0f172a] border border-gray-700"
                />

                <textarea
                  name="description"
                  defaultValue={course.description || ""}
                  className="w-full p-3 rounded-xl bg-[#0f172a] border border-gray-700"
                />

                <input
                  name="price"
                  type="number"
                  defaultValue={course.price || 0}
                  className="w-full p-3 rounded-xl bg-[#0f172a] border border-gray-700"
                />

                <input
                  name="thumbnail_url"
                  defaultValue={course.thumbnail_url || ""}
                  className="w-full p-3 rounded-xl bg-[#0f172a] border border-gray-700"
                />

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_published"
                    defaultChecked={course.is_published}
                  />
                  <span>منشورة</span>
                </label>

                <div className="flex gap-3">
                  <button
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-xl font-bold"
                  >
                    حفظ
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-xl"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">{course.title}</h3>
                  <p className="text-gray-400 text-sm">Slug: {course.slug}</p>
                  <p className="text-gray-400 text-sm">
                    السعر: {course.price || 0}
                  </p>
                  <p className="text-gray-400 text-sm">
                    الحالة: {course.is_published ? "منشورة" : "غير منشورة"}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingId(course.id)}
                    className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl"
                  >
                    تعديل
                  </button>

                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl"
                  >
                    حذف
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {!courses?.length && (
          <div className="text-gray-400">لا يوجد دورات حاليًا.</div>
        )}
      </div>
    </section>
  );
}