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
  const { supabase, admin } = await isAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();

  const { error } = await supabase
    .from("courses")
    .update({
      title: body.title,
      slug: body.slug,
      description: body.description,
      price: body.price,
      thumbnail_url: body.thumbnail_url,
      is_published: body.is_published,
    })
    .eq("id", body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}