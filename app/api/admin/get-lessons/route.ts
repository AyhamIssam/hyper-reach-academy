import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const body = await request.json();
    const { module_id } = body;

    if (!module_id) {
      return NextResponse.json(
        { error: "module_id is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("lessons")
      .select("id, title, duration, bunny_video_id, order_index, is_free_preview")
      .eq("module_id", Number(module_id))
      .order("order_index", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ lessons: data });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}