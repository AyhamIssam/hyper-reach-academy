import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const body = await req.json();

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        {
          error: "Module ID مطلوب",
        },
        {
          status: 400,
        }
      );
    }

    await supabase
      .from("lessons")
      .delete()
      .eq("module_id", id);

    const { error } = await supabase
      .from("modules")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "حدث خطأ غير متوقع",
      },
      {
        status: 500,
      }
    );
  }
}