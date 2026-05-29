import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import ApproveEnrollmentButton from "./ApproveEnrollmentButton";
import AddCourseForm from "./AddCourseForm";
import CoursesManager from "./CoursesManager";
import CurriculumManager from "./CurriculumManager";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  // enrollments
  const { data: enrollmentsData, error } = await supabase
    .from("enrollments")
    .select("*")
    .order("created_at", { ascending: false });

  const enrollments = enrollmentsData || [];

  // courses
  const { data: coursesListData } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  const coursesList = coursesListData || [];

  // ids
  const userIds = enrollments.map((e: any) => e.user_id);
  const courseIds = enrollments.map((e: any) => e.course_id);

  // profiles
  const { data: profilesData } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", userIds);

  const profiles = profilesData || [];

  // courses titles
  const { data: coursesData } = await supabase
    .from("courses")
    .select("id, title")
    .in("id", courseIds);

  const courses = coursesData || [];

  return (
    <main className="min-h-screen bg-[#020817] text-white p-10" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-3">لوحة الإدارة</h1>

        <p className="text-gray-400 mb-10">
          أهلاً {profile?.full_name || "Admin"}، هنا يمكنك متابعة المنصة بالكامل.
        </p>

        {error && (
          <div className="mb-6 rounded-xl border border-red-800 bg-red-950/40 p-4 text-red-300">
            {error.message}
          </div>
        )}

        {/* Add Course */}
        <div className="mb-10">
          <AddCourseForm />
        </div>

        {/* Manage Courses */}
        <div className="mb-10">
          <CoursesManager courses={coursesList} />
        </div>
        {/* Manage Curriculum */}
        <div className="mb-10">
          <CurriculumManager courses={coursesList} />
        </div>

        {/* Enrollments */}
        <section className="border border-blue-900 rounded-2xl p-6 bg-[#071226]">
          <h2 className="text-2xl font-bold mb-6">طلبات التسجيل</h2>

          <div className="space-y-4">
            {enrollments.map((enrollment: any) => {
              const student = profiles.find(
                (p: any) => p.id === enrollment.user_id
              );

              const course = courses.find(
                (c: any) => c.id === enrollment.course_id
              );
              
              return (
                <div
                  key={enrollment.id}
                  className="grid gap-4 md:grid-cols-5 items-center border border-gray-800 rounded-xl p-4"
                >
                  {/* Student */}
                  <div>
  <div className="text-xs text-gray-500">
    اسم العميل
  </div>

  <div className="font-semibold">
    {enrollment.customer_name ||
      student?.full_name ||
      "بدون اسم"}
  </div>

  <div className="text-xs text-gray-600 break-all mt-1">
    {enrollment.user_id}
  </div>
</div>

                 

                  {/* Course */}
                  <div>
                    <div className="text-xs text-gray-500">
                      الدورة
                    </div>

                    <div className="font-semibold">
                      {course?.title || "دورة غير معروفة"}
                    </div>

                    <div className="text-xs text-gray-600 mt-1">
                      Course ID: {enrollment.course_id}
                    </div>
                  </div>

                  {/* Payment */}
                  <div>
                    <div className="text-xs text-gray-500">
                      الدفع
                    </div>

                    <div>
                      {enrollment.payment_status || "pending"}
                    </div>
                  </div>
 


                  <div>
  <div className="text-xs text-gray-500">
    إثبات الدفع
  </div>

  {enrollment.payment_proof_url ? (
    <a
      href={enrollment.payment_proof_url}
      target="_blank"
      className="text-blue-400 underline"
    >
      عرض الصورة
    </a>
  ) : (
    <span className="text-gray-500">
      لا يوجد مرفق
    </span>
  )}
</div>


                  {/* Approval */}
                  <div>
                    <div className="text-xs text-gray-500">
                      الموافقة
                    </div>

                    <div>
                      {enrollment.approved
                        ? "مقبول"
                        : "بانتظار الموافقة"}
                    </div>
                  </div>

                  {/* Button */}
                  <div>
                    <ApproveEnrollmentButton
                      enrollmentId={enrollment.id}
                      approved={enrollment.approved}
                    />
                  </div>
                </div>
              );
            })}

            {!enrollments.length && (
              <div className="text-gray-400">
                لا يوجد طلبات تسجيل حاليًا.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}