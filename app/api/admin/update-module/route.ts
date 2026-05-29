import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const body = await req.json();

    const { id, title, order_index } = body;

    if (!id || !title) {
      return NextResponse.json(
        {
          error: "البيانات ناقصة",
        },
        {
          status: 400,
        }
      );
    }

    const { error } = await supabase
      .from("modules")
      .update({
        title,
        order_index,
      })
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