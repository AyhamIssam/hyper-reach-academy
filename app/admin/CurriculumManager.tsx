"use client";

import { useEffect, useState } from "react";

type Course = {
  id: number;
  title: string;
};

type Module = {
  id: number;
  title: string;
  order_index?: number;
};

type Lesson = {
  id: number;
  title: string;
  duration: string | null;
  bunny_video_id: string | null;
  order_index: number | null;
  is_free_preview: boolean | null;
};

export default function CurriculumManager({
  courses,
}: {
  courses: Course[];
}) {
  const [courseId, setCourseId] = useState("");
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleOrder, setModuleOrder] = useState(1);
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
    const [editModuleTitle, setEditModuleTitle] = useState("");
    const [editModuleOrder, setEditModuleOrder] = useState(1);

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");
  const [lessonOrder, setLessonOrder] = useState(1);
  const [bunnyVideoId, setBunnyVideoId] = useState("");
  const [isFreePreview, setIsFreePreview] = useState(false);

  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editOrder, setEditOrder] = useState(1);
  const [editBunnyVideoId, setEditBunnyVideoId] = useState("");
  const [editIsFreePreview, setEditIsFreePreview] = useState(false);

  const [loading, setLoading] = useState(false);

  async function fetchModules(courseIdValue: string) {
    if (!courseIdValue) {
      setModules([]);
      setSelectedModuleId("");
      setLessons([]);
      return;
    }

    const res = await fetch("/api/admin/get-modules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_id: Number(courseIdValue) }),
    });

    const data = await res.json();

    if (res.ok) {
      setModules(data.modules || []);
    } else {
      alert(data.error || "حدث خطأ أثناء جلب الأقسام");
    }
  }

  async function fetchLessons(moduleId: string) {
    if (!moduleId) {
      setLessons([]);
      return;
    }

    const res = await fetch("/api/admin/get-lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module_id: Number(moduleId) }),
    });

    const data = await res.json();

    if (res.ok) {
      setLessons(data.lessons || []);
    } else {
      alert(data.error || "حدث خطأ أثناء جلب الدروس");
    }
  }

  useEffect(() => {
    fetchModules(courseId);
  }, [courseId]);

  useEffect(() => {
    fetchLessons(selectedModuleId);
  }, [selectedModuleId]);

  async function addModule(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/admin/create-module", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        course_id: Number(courseId),
        title: moduleTitle,
        order_index: moduleOrder,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "حدث خطأ أثناء إضافة القسم");
      return;
    }

    alert("تمت إضافة القسم بنجاح");
    setModuleTitle("");
    setModuleOrder(1);
    fetchModules(courseId);
  }

  function startEditModule(module: Module) {
    setEditingModuleId(module.id);
    setEditModuleTitle(module.title || "");
    setEditModuleOrder(module.order_index || 1);
  }
  
  function cancelEditModule() {
    setEditingModuleId(null);
    setEditModuleTitle("");
    setEditModuleOrder(1);
  }
  
  async function updateModule(id: number) {
    setLoading(true);
  
    const res = await fetch("/api/admin/update-module", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        title: editModuleTitle,
        order_index: editModuleOrder,
      }),
    });
  
    const data = await res.json();
  
    setLoading(false);
  
    if (!res.ok) {
      alert(data.error || "حدث خطأ أثناء تعديل القسم");
      return;
    }
  
    alert("تم تعديل القسم بنجاح");
  
    cancelEditModule();
  
    fetchModules(courseId);
  }
  
  async function deleteModule(id: number) {
    const confirmed = confirm(
      "هل أنت متأكد أنك تريد حذف هذا القسم؟ سيتم حذف الدروس التابعة له أيضًا."
    );
  
    if (!confirmed) return;
  
    const res = await fetch("/api/admin/delete-module", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      alert(data.error || "حدث خطأ أثناء حذف القسم");
      return;
    }
  
    alert("تم حذف القسم بنجاح");
  
    if (selectedModuleId === String(id)) {
      setSelectedModuleId("");
      setLessons([]);
    }
  
    fetchModules(courseId);
  }

  async function addLesson(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/admin/create-lesson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        module_id: Number(selectedModuleId),
        title: lessonTitle,
        duration: lessonDuration,
        order_index: lessonOrder,
        bunny_video_id: bunnyVideoId,
        is_free_preview: isFreePreview,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "حدث خطأ أثناء إضافة الدرس");
      return;
    }

    alert("تمت إضافة الدرس بنجاح");
    setLessonTitle("");
    setLessonDuration("");
    setLessonOrder(1);
    setBunnyVideoId("");
    setIsFreePreview(false);
    fetchLessons(selectedModuleId);
  }

  function startEditLesson(lesson: Lesson) {
    setEditingLessonId(lesson.id);
    setEditTitle(lesson.title || "");
    setEditDuration(lesson.duration || "");
    setEditOrder(lesson.order_index || 1);
    setEditBunnyVideoId(lesson.bunny_video_id || "");
    setEditIsFreePreview(Boolean(lesson.is_free_preview));
  }

  function cancelEditLesson() {
    setEditingLessonId(null);
    setEditTitle("");
    setEditDuration("");
    setEditOrder(1);
    setEditBunnyVideoId("");
    setEditIsFreePreview(false);
  }

  async function updateLesson(id: number) {
    setLoading(true);

    const res = await fetch("/api/admin/update-lesson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        title: editTitle,
        duration: editDuration,
        order_index: editOrder,
        bunny_video_id: editBunnyVideoId,
        is_free_preview: editIsFreePreview,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "حدث خطأ أثناء تعديل الدرس");
      return;
    }

    alert("تم تعديل الدرس بنجاح");
    cancelEditLesson();
    fetchLessons(selectedModuleId);
  }

  async function deleteLesson(id: number) {
    const confirmed = confirm("هل أنت متأكد أنك تريد حذف هذا الدرس؟");
    if (!confirmed) return;

    const res = await fetch("/api/admin/delete-lesson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "حدث خطأ أثناء حذف الدرس");
      return;
    }

    alert("تم حذف الدرس بنجاح");
    fetchLessons(selectedModuleId);
  }

  return (
    <div className="mt-10 space-y-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900">إدارة محتوى الدورات</h2>

      <div className="space-y-3">
        <label className="font-semibold">اختر الدورة</label>

        <select
          value={courseId}
          onChange={(e) => {
            setCourseId(e.target.value);
            setSelectedModuleId("");
            setLessons([]);
            cancelEditLesson();
          }}
          className="w-full rounded-lg border p-3"
          required
        >
          <option value="">اختر الدورة</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={addModule} className="space-y-4 rounded-xl border p-4">
        <h3 className="text-xl font-semibold">إضافة قسم Module</h3>

        <input
          value={moduleTitle}
          onChange={(e) => setModuleTitle(e.target.value)}
          placeholder="اسم القسم"
          className="w-full rounded-lg border p-3"
          required
        />

        <input
          type="number"
          value={moduleOrder}
          onChange={(e) => setModuleOrder(Number(e.target.value))}
          placeholder="ترتيب القسم"
          className="w-full rounded-lg border p-3"
        />

        <button
          disabled={loading || !courseId}
          className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
        >
          {loading ? "جاري الحفظ..." : "إضافة القسم"}
        </button>
      </form>
<div className="space-y-3 rounded-xl border p-4">
  <h3 className="text-xl font-semibold">الأقسام الحالية</h3>

  {modules.length === 0 && (
    <p className="text-gray-500">
      لا يوجد أقسام داخل هذه الدورة بعد.
    </p>
  )}

  {modules.map((module) => (
    <div
      key={module.id}
      className="rounded-lg border p-3"
    >
      {editingModuleId === module.id ? (
        <div className="space-y-3">
          <input
            value={editModuleTitle}
            onChange={(e) =>
              setEditModuleTitle(e.target.value)
            }
            className="w-full rounded-lg border p-3"
            placeholder="اسم القسم"
          />

          <input
            type="number"
            value={editModuleOrder}
            onChange={(e) =>
              setEditModuleOrder(Number(e.target.value))
            }
            className="w-full rounded-lg border p-3"
            placeholder="ترتيب القسم"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => updateModule(module.id)}
              disabled={loading}
              className="rounded-lg bg-green-600 px-4 py-2 text-white disabled:opacity-50"
            >
              حفظ التعديل
            </button>

            <button
              type="button"
              onClick={cancelEditModule}
              className="rounded-lg bg-gray-400 px-4 py-2 text-white"
            >
              إلغاء
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold">
              {module.title}
            </p>

            <p className="text-sm text-gray-500">
              الترتيب: {module.order_index || 1}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => startEditModule(module)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              تعديل
            </button>

            <button
              type="button"
              onClick={() => deleteModule(module.id)}
              className="rounded-lg bg-red-500 px-4 py-2 text-white"
            >
              حذف
            </button>
          </div>
        </div>
      )}
    </div>
  ))}
</div>

      <form onSubmit={addLesson} className="space-y-4 rounded-xl border p-4">
        <h3 className="text-xl font-semibold">إضافة درس Lesson</h3>

        <select
          value={selectedModuleId}
          onChange={(e) => {
            setSelectedModuleId(e.target.value);
            cancelEditLesson();
          }}
          className="w-full rounded-lg border p-3"
          required
        >
          <option value="">اختر القسم</option>
          {modules.map((module) => (
            <option key={module.id} value={module.id}>
              {module.title}
            </option>
          ))}
        </select>

        <input
          value={lessonTitle}
          onChange={(e) => setLessonTitle(e.target.value)}
          placeholder="عنوان الدرس"
          className="w-full rounded-lg border p-3"
          required
        />

        <input
          value={lessonDuration}
          onChange={(e) => setLessonDuration(e.target.value)}
          placeholder="مدة الدرس مثال: 10 دقائق"
          className="w-full rounded-lg border p-3"
        />

        <input
          type="number"
          value={lessonOrder}
          onChange={(e) => setLessonOrder(Number(e.target.value))}
          placeholder="ترتيب الدرس"
          className="w-full rounded-lg border p-3"
        />

        <input
          value={bunnyVideoId}
          onChange={(e) => setBunnyVideoId(e.target.value)}
          placeholder="Video URL لاحقًا"
          className="w-full rounded-lg border p-3"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isFreePreview}
            onChange={(e) => setIsFreePreview(e.target.checked)}
          />
          درس مجاني للمعاينة
        </label>

        <button
          disabled={loading || !selectedModuleId}
          className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
        >
          {loading ? "جاري الحفظ..." : "إضافة الدرس"}
        </button>
      </form>

      <div className="space-y-3 rounded-xl border p-4">
        <h3 className="text-xl font-semibold">الدروس الحالية</h3>

        {!selectedModuleId && (
          <p className="text-gray-500">اختر قسمًا لعرض الدروس.</p>
        )}

        {selectedModuleId && lessons.length === 0 && (
          <p className="text-gray-500">لا يوجد دروس داخل هذا القسم بعد.</p>
        )}

        {lessons.map((lesson) => (
          <div key={lesson.id} className="rounded-lg border p-3">
            {editingLessonId === lesson.id ? (
              <div className="space-y-3">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-lg border p-3"
                  placeholder="عنوان الدرس"
                />

                <input
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  className="w-full rounded-lg border p-3"
                  placeholder="مدة الدرس"
                />

                <input
                  type="number"
                  value={editOrder}
                  onChange={(e) => setEditOrder(Number(e.target.value))}
                  className="w-full rounded-lg border p-3"
                  placeholder="ترتيب الدرس"
                />

                <input
                  value={editBunnyVideoId}
                  onChange={(e) => setEditBunnyVideoId(e.target.value)}
                  className="w-full rounded-lg border p-3"
                  placeholder="Video URL"
                />

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editIsFreePreview}
                    onChange={(e) => setEditIsFreePreview(e.target.checked)}
                  />
                  درس مجاني للمعاينة
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateLesson(lesson.id)}
                    disabled={loading}
                    className="rounded-lg bg-green-600 px-4 py-2 text-white disabled:opacity-50"
                  >
                    حفظ التعديل
                  </button>

                  <button
                    type="button"
                    onClick={cancelEditLesson}
                    className="rounded-lg bg-gray-400 px-4 py-2 text-white"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">{lesson.title}</p>
                  <p className="text-sm text-gray-500">
                    المدة: {lesson.duration || "غير محددة"}
                  </p>
                  <p className="text-sm text-gray-500">
                    الترتيب: {lesson.order_index || 1}
                  </p>
                  {lesson.bunny_video_id && (
                    <p className="text-sm text-gray-500">
                      Video URL: {lesson.bunny_video_id}
                    </p>
                  )}
                  {lesson.is_free_preview && (
                    <p className="text-sm text-green-600">
                      درس مجاني للمعاينة
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEditLesson(lesson)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                  >
                    تعديل
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteLesson(lesson.id)}
                    className="rounded-lg bg-red-500 px-4 py-2 text-white"
                  >
                    حذف
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}