import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await request.json();

  const { data: existing } = await supabase
    .from("enrollments")
    .select("id, approved, payment_status")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json({
      success: true,
      alreadyRegistered: true,
      enrollment: existing[0],
    });
  }

  const { error } = await supabase.from("enrollments").insert({
    user_id: user.id,
    course_id: courseId,
    payment_status: "pending",
    approved: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}