export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          من نحن
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-muted sm:text-base">
          Hyper Reach Academy منصة تدريب عربية تهدف لتقديم محتوى واضح وعملي في
          التقنية والأعمال.
        </p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl bg-card/60 p-6 ring-1 ring-card-border lg:col-span-2">
          <h2 className="text-lg font-semibold">رؤيتنا</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            تمكين المتعلم العربي من اكتساب مهارات قابلة للتطبيق بشكل مباشر، عبر
            دورات قصيرة ومركّزة، وتوثيق منهجي يسهّل عليك العودة للمعلومة عند
            الحاجة.
          </p>

          <h2 className="mt-8 text-lg font-semibold">كيف نبني المحتوى</h2>
          <ul className="mt-4 grid gap-2 text-sm text-muted">
            {[
              "أهداف واضحة لكل دورة قبل البدء.",
              "أمثلة تطبيقية قدر الإمكان بدون ادعاءات تسويقية مبالغ فيها.",
              "تحسين تجربة القراءة للعربية: مسافات، تباين، وترتيب.",
            
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span className="leading-7">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <aside className="rounded-3xl bg-card/60 p-6 ring-1 ring-card-border">
          <h2 className="text-lg font-semibold">روابط سريعة</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <a
              className="rounded-2xl bg-white/5 px-4 py-3 text-muted ring-1 ring-white/10 hover:text-foreground"
              href="/courses"
            >
              استعرض الدورات
            </a>
            <a
              className="rounded-2xl bg-white/5 px-4 py-3 text-muted ring-1 ring-white/10 hover:text-foreground"
              href="/contact"
            >
              تواصل معنا
            </a>
            
          </div>
        </aside>
      </div>
    </div>
  );
}

