export default function Home() {
  const highlights = [
    "تدريب عملي موجه لسوق الاتصالات",
    "محتوى عربي واضح ومباشر",
    "تعلم منظم خطوة بخطوة",
  ] as const;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-muted ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Hyper Reach Academy
          </div>

          <h1 className="text-balance text-4xl font-semibold leading-[1.15] tracking-tight sm:text-5xl">
            تعلّم مهارات الاتصالات
            <span className="block text-primary"> بطريقة عملية ومنظمة.</span>
          </h1>

          <p className="max-w-xl text-pretty text-base leading-7 text-muted sm:text-lg">
            أكاديمية عربية متخصصة في تقديم محتوى تدريبي عملي يساعدك على فهم
            العمل الميداني، تقارير المواقع، ومهارات قطاع الاتصالات بأسلوب واضح
            ومباشر.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {highlights.map((h) => (
              <div
                key={h}
                className="rounded-2xl bg-card/60 p-4 ring-1 ring-card-border"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/25">
                    ✓
                  </span>
                  <div className="text-sm leading-7 text-foreground">{h}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 mb-20">
            <a
              href="/courses"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_0_0_1px_rgba(47,123,255,0.35),0_12px_35px_-14px_rgba(47,123,255,0.75)] transition hover:brightness-110"
            >
              استعرض الدورات المتاحة
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 -z-10 rounded-[28px] bg-[radial-gradient(350px_280px_at_55%_35%,rgba(47,123,255,0.35),transparent_65%)] blur-2xl" />

          <div className="rounded-[28px] bg-card/70 p-6 ring-1 ring-card-border">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-primary">
                منصة تدريب احترافية
              </div>

              <h2 className="text-2xl font-semibold">
                مصممة للمتدربين في مجال الاتصالات
              </h2>

              <p className="text-sm leading-7 text-muted">
                ستجد داخل الأكاديمية دورات منظمة، دروس مرتبة، تتبع للتقدم،
                ومحتوى قابل للتوسع مع الوقت.
              </p>
            </div>

            <div className="mt-6 grid gap-3">
              {[
                {
                  title: "مجال التركيز",
                  value: "Telecom / TSSR / Field Work",
                },
                {
                  title: "طريقة التعلم",
                  value: "دروس مسجلة ومنظمة",
                },
                {
                  title: "اللغة",
                  value: "العربية",
                },
                {
                  title: "الوصول",
                  value: "بعد التسجيل والموافقة",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm font-semibold">
                      {item.title}
                    </div>

                    <div className="text-xs text-muted">
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-[300px] rounded-3xl bg-card/60 p-6 ring-1 ring-card-border sm:p-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="text-3xl font-semibold text-primary">
              01
            </div>

            <h3 className="mt-3 font-semibold">
              اختر الدورة
            </h3>

            <p className="mt-2 text-sm leading-7 text-muted">
              ادخل إلى صفحة الدورات وشاهد الدورات المتاحة فعلياً.
            </p>
          </div>

          <div>
            <div className="text-3xl font-semibold text-primary">
              02
            </div>

            <h3 className="mt-3 font-semibold">
              أرسل طلب التسجيل
            </h3>

            <p className="mt-2 text-sm leading-7 text-muted">
              عبّئ بياناتك وارفع إثبات الدفع إذا كان مطلوباً.
            </p>
          </div>

          <div>
            <div className="text-3xl font-semibold text-primary">
              03
            </div>

            <h3 className="mt-3 font-semibold">
              ابدأ التعلم
            </h3>

            <p className="mt-2 text-sm leading-7 text-muted">
              بعد موافقة الإدارة، يمكنك الدخول إلى الدروس ومتابعة تقدمك.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}