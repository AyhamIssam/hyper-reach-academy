import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(`
      id,
      courses (
        id,
        title,
        slug,
        description,
        modules (
          id,
          lessons (
            id
          )
        )
      )
    `)
    .eq("user_id", user.id);

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("completed", true);

  const completedLessonIds = new Set(
    progress?.map((item) => item.lesson_id) || []
  );

  return (
    <main className="min-h-screen bg-[#020817] text-white p-10" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">لوحة الطالب</h1>

        <div className="border border-blue-900 rounded-2xl p-6 bg-[#071226] mb-10">
          <div className="text-2xl mb-4">
            أهلاً {profile?.full_name || "طالب"}
          </div>
          <div className="text-gray-400">{user.email}</div>
        </div>

        <h2 className="text-2xl font-bold mb-6">دوراتي</h2>

        {!enrollments || enrollments.length === 0 ? (
          <div className="border border-gray-800 rounded-2xl p-6 text-gray-400">
            لم تسجل في أي دورة بعد.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {enrollments.map((enrollment: any) => {
              const course = enrollment.courses;

              const lessons =
                course?.modules?.flatMap((module: any) => module.lessons) || [];

              const totalLessons = lessons.length;

              const completedLessons = lessons.filter((lesson: any) =>
                completedLessonIds.has(lesson.id)
              ).length;

              const percent =
                totalLessons === 0
                  ? 0
                  : Math.round((completedLessons / totalLessons) * 100);

              return (
                <div
                  key={enrollment.id}
                  className="border border-blue-900 rounded-2xl p-6 bg-[#071226]"
                >
                  <h3 className="text-xl font-bold mb-3">{course?.title}</h3>

                  <p className="text-gray-400 mb-5 line-clamp-3">
                    {course?.description}
                  </p>

                  <div className="mb-5">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>التقدم</span>
                      <span>{percent}%</span>
                    </div>

                    <div className="w-full bg-gray-800 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="text-sm text-gray-500 mt-2">
                      {completedLessons} من {totalLessons} دروس مكتملة
                    </div>
                  </div>

                  <Link
                    href={`/courses/${course?.slug}`}
                    className="inline-block bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl"
                  >
                    فتح الدورة
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}