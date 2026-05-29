import { createClient } from "@/lib/supabase/server";
import PurchaseCourseForm from "./PurchaseCourseForm";

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!course) {
    return (
      <main className="min-h-screen bg-[#020817] text-white p-10" dir="rtl">
        الدورة غير موجودة
      </main>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let enrollment: any = null;

  if (user) {
    const { data } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .maybeSingle();

    enrollment = data;
  }

  const { data: modules } = await supabase
    .from("modules")
    .select(`
      id,
      title,
      order_index,
      lessons (
        id,
        title,
        duration,
        order_index,
        is_free_preview
      )
    `)
    .eq("course_id", course.id)
    .order("order_index", { ascending: true });

  const firstLessonId = modules
    ?.flatMap((module: any) => module.lessons || [])
    ?.sort((a: any, b: any) => a.order_index - b.order_index)?.[0]?.id;

  const isApproved = enrollment?.approved === true;
  const isPending =
    enrollment &&
    enrollment.approved === false &&
    enrollment.payment_status === "pending";

  return (
    <main className="min-h-screen bg-[#020817] text-white p-10" dir="rtl">
      <section className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-4xl font-bold">{course.title}</h1>

        <p className="mb-6 text-lg leading-10 text-gray-300">
          {course.description}
        </p>

        <div className="mb-8 text-xl text-blue-400">
          السعر: {course.price} JOD
        </div>

        <div className="mb-10">
          {isApproved ? (
            <a
              href={firstLessonId ? `/learn/${firstLessonId}` : "#"}
              className="inline-flex rounded-2xl bg-green-600 px-6 py-4 hover:bg-green-700"
            >
              ابدأ التعلم
            </a>
          ) : isPending ? (
            <div className="rounded-2xl border border-yellow-700 bg-yellow-950/40 p-6">
              <h2 className="mb-2 text-2xl font-bold text-yellow-300">
                طلبك قيد المراجعة
              </h2>

              <p className="text-yellow-100">
                تم إرسال طلب شراء الدورة بنجاح، والحالة الحالية: بانتظار موافقة
                الإدارة.
              </p>
            </div>
          ) : user ? (
            <PurchaseCourseForm courseId={course.id} userId={user.id} />
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <h2 className="mb-3 text-2xl font-bold">شراء الدورة</h2>

              <p className="mb-5 text-slate-300">
                يجب تسجيل الدخول أولًا حتى تتمكن من إرسال طلب شراء الدورة.
              </p>

              <a
                href="/login"
                className="inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                تسجيل الدخول
              </a>
            </div>
          )}
        </div>

        <h2 className="mb-6 text-2xl font-bold">منهج الدورة</h2>

        <div className="space-y-6">
          {modules?.map((module: any) => (
            <div
              key={module.id}
              className="rounded-2xl border border-blue-900 p-6"
            >
              <h3 className="mb-4 text-xl font-bold">{module.title}</h3>

              <div className="space-y-3">
                {module.lessons
                  ?.sort((a: any, b: any) => a.order_index - b.order_index)
                  .map((lesson: any) => (
                    <div
                      key={lesson.id}
                      className="flex justify-between rounded-xl border border-gray-800 p-4"
                    >
                      <a
                        href={`/learn/${lesson.id}`}
                        className="transition hover:text-blue-400"
                      >
                        {lesson.title}
                      </a>

                      <span className="text-gray-400">
                        {lesson.duration}
                        {lesson.is_free_preview ? " | معاينة مجانية" : ""}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}