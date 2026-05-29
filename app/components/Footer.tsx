export default function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold">Hyper Reach Academy</div>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            <a className="hover:text-foreground" href="/courses">
              الدورات
            </a>
            <a className="hover:text-foreground" href="/about">
              من نحن
            </a>
            <a className="hover:text-foreground" href="/contact">
              تواصل معنا
            </a>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/5 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Hyper Reach Academy</div>
          
        </div>
      </div>
    </footer>
  );
}

