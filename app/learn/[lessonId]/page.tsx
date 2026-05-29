import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import CompleteLessonButton from "./CompleteLessonButton";
import BackButton from "./BackButton";

function getVideoEmbedUrl(videoValue: string | null) {
  if (!videoValue) return null;

  const bunnyLibraryId = "671889";

  if (videoValue.includes("youtube.com/watch?v=")) {
    const videoId = videoValue.split("v=")[1]?.split("&")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }

  if (videoValue.includes("youtu.be/")) {
    const videoId = videoValue.split("youtu.be/")[1]?.split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }

  if (videoValue.includes("youtube.com/embed/")) {
    return videoValue;
  }

  if (videoValue.includes("iframe.mediadelivery.net")) {
    return videoValue;
  }

  if (
    videoValue.length > 20 &&
    videoValue.includes("-") &&
    !videoValue.startsWith("http")
  ) {
    return `https://iframe.mediadelivery.net/embed/${bunnyLibraryId}/${videoValue}`;
  }

  if (videoValue.startsWith("https://")) {
    return videoValue;
  }

  return null;
}

function LockedLessonScreen({
  courseSlug,
  lessonTitle,
}: {
  courseSlug: string | null;
  lessonTitle: string;
}) {
  return (
    <main
      className="min-h-screen bg-[#020817] text-white flex items-center justify-center px-4"
      dir="rtl"
    >
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950 p-8 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-3xl">
          🔒
        </div>

        <p className="mb-2 text-sm text-blue-400">درس مقفول</p>

        <h1 className="mb-4 text-2xl font-bold">{lessonTitle}</h1>

        <p className="mb-6 leading-7 text-slate-300">
          هذا الدرس متاح فقط للطلاب الذين قاموا بشراء الدورة وتمت الموافقة على
          طلبهم. يمكنك مشاهدة الدروس المجانية فقط قبل الشراء.
        </p>

        {courseSlug ? (
          <Link
            href={`/courses/${courseSlug}`}
            className="block w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            الرجوع لصفحة الدورة
          </Link>
        ) : (
          <Link
            href="/courses"
            className="block w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            الرجوع للدورات
          </Link>
        )}

        <Link
          href="/dashboard"
          className="mt-4 block text-sm text-slate-400 hover:text-white"
        >
          الذهاب إلى لوحة الطالب
        </Link>
      </div>
    </main>
  );
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: lesson } = await supabase
    .from("lessons")
    .select(
      `
      *,
      modules (
        id,
        course_id,
        courses (
          id,
          title,
          slug
        )
      )
    `
    )
    .eq("id", lessonId)
    .maybeSingle();

  if (!lesson) {
    return (
      <main className="min-h-screen bg-[#020817] text-white p-10" dir="rtl">
        الدرس غير موجود
      </main>
    );
  }

  const courseId = lesson.modules?.course_id;

  const { data: courseModules } = await supabase
  .from("modules")
  .select(`
    id,
    order_index,
    lessons (
      id,
      title,
      order_index
    )
  `)
  .eq("course_id", courseId)
  .order("order_index");

const allLessons =
  courseModules
    ?.flatMap((m: any) => m.lessons || [])
    ?.sort((a: any, b: any) => a.order_index - b.order_index) || [];

const currentIndex = allLessons.findIndex(
  (l: any) => l.id === lesson.id
);

const previousLesson =
  currentIndex > 0
    ? allLessons[currentIndex - 1]
    : null;

const nextLesson =
  currentIndex < allLessons.length - 1
    ? allLessons[currentIndex + 1]
    : null;


  const courseSlug = lesson.modules?.courses?.slug ?? null;

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .eq("approved", true)
    .maybeSingle();

  const isFreePreview = lesson.is_free_preview === true;
  const canAccessLesson = isFreePreview || !!enrollment;

  if (!canAccessLesson) {
    return (
      <LockedLessonScreen
        courseSlug={courseSlug}
        lessonTitle={lesson.title}
      />
    );
  }

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("lesson_id", lesson.id)
    .maybeSingle();

  const videoUrl = getVideoEmbedUrl(lesson.bunny_video_id);

  return (
    <main className="min-h-screen bg-[#020817] text-white p-10" dir="rtl">
      <div className="mx-auto max-w-5xl">
        {isFreePreview && !enrollment && (
          <div className="mb-6 rounded-2xl border border-blue-900 bg-blue-950/40 p-4 text-blue-100">
            هذا درس معاينة مجانية. لفتح كامل الدورة، قم بشراء الدورة وانتظر
            موافقة الإدارة.
          </div>
        )}
        <div className="mb-6">
  <BackButton />
</div>

        <h1 className="mb-8 text-4xl font-bold">{lesson.title}</h1>

        <div className="mb-8 aspect-video overflow-hidden rounded-2xl border border-blue-900 bg-black">
          {videoUrl ? (
            <iframe
              src={videoUrl}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-gray-400">
                لا يوجد فيديو مربوط بهذا الدرس بعد
              </span>
            </div>
          )}
        </div>

        <div className="mb-8 text-lg text-gray-300">
          مدة الدرس: {lesson.duration || "غير محددة"}
        </div>

        {enrollment && (
          <CompleteLessonButton
            lessonId={lesson.id}
            completed={!!progress?.completed}
          />
        )}
        <div className="mt-10 flex flex-wrap gap-4 justify-between">
  {previousLesson ? (
    <a
      href={`/learn/${previousLesson.id}`}
      className="rounded-xl bg-slate-800 px-5 py-3 hover:bg-slate-700"
    >
      ← الدرس السابق
    </a>
  ) : (
    <div />
  )}

  {nextLesson ? (
    <a
      href={`/learn/${nextLesson.id}`}
      className="rounded-xl bg-blue-600 px-5 py-3 hover:bg-blue-700"
    >
      الدرس التالي →
    </a>
  ) : (
    <span className="text-green-400 font-semibold">
       انتهيت من جميع الدروس
    </span>
  )}
</div>
      </div>
    </main>
  );
}