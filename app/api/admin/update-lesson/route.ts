import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const body = await request.json();

    const {
      id,
      title,
      duration,
      bunny_video_id,
      order_index,
      is_free_preview,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Lesson ID required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("lessons")
      .update({
        title,
        duration,
        bunny_video_id,
        order_index,
        is_free_preview,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ lesson: data });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}