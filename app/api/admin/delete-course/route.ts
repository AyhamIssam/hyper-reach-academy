import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

async function isAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, admin: false };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return { supabase, admin: profile?.role === "admin" };
}

export async function POST(request: Request) {
  try {
    const { supabase, admin } = await isAdmin();

    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const courseId = body.id;

    if (!courseId) {
      return NextResponse.json({ error: "Course ID مطلوب" }, { status: 400 });
    }

    const { data: modules, error: modulesError } = await supabase
      .from("modules")
      .select("id")
      .eq("course_id", courseId);

    if (modulesError) {
      return NextResponse.json({ error: modulesError.message }, { status: 400 });
    }

    const moduleIds = modules?.map((module) => module.id) || [];

    if (moduleIds.length > 0) {
      const { data: lessons, error: lessonsSelectError } = await supabase
        .from("lessons")
        .select("id")
        .in("module_id", moduleIds);

      if (lessonsSelectError) {
        return NextResponse.json(
          { error: lessonsSelectError.message },
          { status: 400 }
        );
      }

      const lessonIds = lessons?.map((lesson) => lesson.id) || [];

      if (lessonIds.length > 0) {
        const { error: progressError } = await supabase
          .from("lesson_progress")
          .delete()
          .in("lesson_id", lessonIds);

        if (progressError) {
          return NextResponse.json(
            { error: progressError.message },
            { status: 400 }
          );
        }

        const { error: lessonsDeleteError } = await supabase
          .from("lessons")
          .delete()
          .in("id", lessonIds);

        if (lessonsDeleteError) {
          return NextResponse.json(
            { error: lessonsDeleteError.message },
            { status: 400 }
          );
        }
      }
    }

    const { error: modulesDeleteError } = await supabase
      .from("modules")
      .delete()
      .eq("course_id", courseId);

    if (modulesDeleteError) {
      return NextResponse.json(
        { error: modulesDeleteError.message },
        { status: 400 }
      );
    }

    const { error: enrollmentsError } = await supabase
      .from("enrollments")
      .delete()
      .eq("course_id", courseId);

    if (enrollmentsError) {
      return NextResponse.json(
        { error: enrollmentsError.message },
        { status: 400 }
      );
    }

    const { error: courseError } = await supabase
      .from("courses")
      .delete()
      .eq("id", courseId);

    if (courseError) {
      return NextResponse.json({ error: courseError.message }, { status: 400 });
    }
    console.log("COURSE ID:", courseId);

    const { data: checkCourse } = await supabase
      .from("courses")
      .select("id,title")
      .eq("id", courseId);
    
    console.log("COURSE AFTER DELETE:", checkCourse);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE COURSE ERROR:", error);

    return NextResponse.json(
      { error: "حدث خطأ غير متوقع أثناء حذف الدورة" },
      { status: 500 }
    );
  }
}