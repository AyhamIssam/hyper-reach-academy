import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default async function CoursesPage() {
  let courses: any[] = [];
  let hasError = false;

  try {
    const { data, error } = await supabase
      .from("courses")
      .select("id,title,slug,description,price")
      .eq("is_published", true);

    if (error) {
      console.log(JSON.stringify(error, null, 2));
      hasError = true;
    } else {
      courses = data || [];
    }
  } catch (err) {
    console.log(err);
    hasError = true;
  }

  return (
    <main className="min-h-screen bg-[#020817] text-white p-10" dir="rtl">
      <h1 className="text-4xl font-bold mb-10">الدورات</h1>

      {hasError ? (
        <div>حدث خطأ أثناء تحميل الدورات</div>
      ) : courses.length === 0 ? (
        <div>لا توجد دورات منشورة حالياً</div>
      ) : (
        <div className="grid gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="border border-blue-900 rounded-2xl p-6 hover:border-blue-500 transition"
            >
              <h2 className="text-2xl font-bold mb-4">
                {course.title}
              </h2>

              <p className="text-gray-300 mb-4">
                {course.description}
              </p>

              <div className="text-blue-400">
                {course.price} JOD
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}