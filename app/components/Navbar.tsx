import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

type NavItem = {
  href: string;
  label: string;
};

export default async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user?.id)
    .maybeSingle();

  const navItems: NavItem[] = [
    { href: "/", label: "الرئيسية" },
    { href: "/courses", label: "الدورات" },
    { href: "/about", label: "من نحن" },
    { href: "/contact", label: "تواصل معنا" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="/"
          className="inline-flex items-center gap-3 font-semibold tracking-tight"
          aria-label="Hyper Reach Academy"
        >
          <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.8)] sm:h-16 sm:w-16">
            <Image
              src="/logo.png"
              alt="Hyper Reach Academy Logo"
              width={80}
              height={80}
              priority
              className="h-full w-full object-contain"
            />
          </span>

          <span className="text-base sm:text-lg">
            Hyper Reach Academy
          </span>
        </a>

        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              className="transition-colors hover:text-foreground"
              href={item.href}
            >
              {item.label}
            </a>
          ))}

          {user ? (
            <a
              href="/dashboard"
              className="mr-4 flex items-center gap-3 rounded-2xl border border-blue-900 bg-blue-950/40 px-4 py-2 transition hover:bg-blue-900/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {(
                  profile?.full_name?.charAt(0) ||
                  user.user_metadata?.full_name?.charAt(0) ||
                  "ط"
                ).toUpperCase()}
              </div>

              <div className="flex flex-col leading-tight">
                <span className="text-xs text-gray-400">
                  لوحة الطالب
                </span>

                <span className="text-sm font-semibold text-white">
                  مرحبًا،{" "}
                  {profile?.full_name ||
                    user.user_metadata?.full_name ||
                    "الطالب"}
                </span>
              </div>
            </a>
          ) : (
            <a
              href="/login"
              className="mr-4 rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            >
              تسجيل الدخول
            </a>
          )}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <details className="group relative">
            <summary className="list-none cursor-pointer select-none rounded-xl bg-white/5 px-3 py-2 text-sm font-semibold text-foreground ring-1 ring-white/10 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              القائمة
            </summary>

            <div className="absolute left-0 mt-2 w-56 overflow-hidden rounded-2xl bg-card/95 p-2 ring-1 ring-card-border shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}

              {user ? (
                <a
                  href="/dashboard"
                  className="mt-2 block rounded-xl bg-blue-950/40 px-3 py-3 text-sm text-white ring-1 ring-blue-900"
                >
                  <div className="text-xs text-gray-400 mb-1">
                    لوحة الطالب
                  </div>

                  <div className="font-semibold">
                    مرحبًا،{" "}
                    {profile?.full_name ||
                      user.user_metadata?.full_name ||
                      "الطالب"}
                  </div>
                </a>
              ) : (
                <a
                  href="/login"
                  className="mt-2 block rounded-xl bg-blue-600 px-3 py-3 text-center text-sm font-semibold text-white"
                >
                  تسجيل الدخول
                </a>
              )}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}