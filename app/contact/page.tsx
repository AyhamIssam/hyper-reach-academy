export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          تواصل معنا
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-muted sm:text-base">
          
        </p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl bg-card/60 p-6 ring-1 ring-card-border lg:col-span-2">
          <h2 className="text-lg font-semibold">نموذج رسالة</h2>
          <form className="mt-5 grid gap-4" action="#">
            <div className="grid gap-2">
              <label className="text-sm font-semibold" htmlFor="name">
                الاسم
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="اكتب اسمك"
                className="h-12 rounded-2xl bg-background/40 px-4 text-sm text-foreground outline-none ring-1 ring-white/10 placeholder:text-muted focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold" htmlFor="email">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                className="h-12 rounded-2xl bg-background/40 px-4 text-sm text-foreground outline-none ring-1 ring-white/10 placeholder:text-muted focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold" htmlFor="message">
                الرسالة
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="كيف يمكننا مساعدتك؟"
                rows={6}
                className="resize-none rounded-2xl bg-background/40 px-4 py-3 text-sm text-foreground outline-none ring-1 ring-white/10 placeholder:text-muted focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_0_0_1px_rgba(47,123,255,0.35),0_12px_35px_-14px_rgba(47,123,255,0.75)] transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              إرسال
            </button>
          </form>
        </section>

        <aside className="rounded-3xl bg-card/60 p-6 ring-1 ring-card-border">
          <h2 className="text-lg font-semibold">معلومات</h2>
          <div className="mt-4 grid gap-3 text-sm text-muted">
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-xs">البريد</div>
              <div className="mt-1 font-semibold text-foreground">
                support@hyperreach.academy
              </div>
              <div className="mt-2 text-xs text-muted">
                (للعرض فقط — يمكن تغييره لاحقًا)
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-xs">الوقت المناسب</div>
              <div className="mt-1 font-semibold text-foreground">
                خلال أيام العمل
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

