import Link from "next/link";
import { Zap } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/8 bg-[var(--color-background)]">
      {/* Top separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-400">
                <Zap className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-fuchsia-300 bg-clip-text text-transparent">
                FluentRemote
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Ekstensi Chrome untuk freelancer yang bekerja dengan klien internasional.
            </p>
          </div>

          {/* Produk */}
          <div>
            <div className="text-sm font-semibold text-slate-300 mb-4">Produk</div>
            <ul className="space-y-2.5">
              {[
                { label: "Cara Kerja", href: "#cara-kerja" },
                { label: "Fitur", href: "#fitur" },
                { label: "Harga", href: "#harga" },
                { label: "FAQ", href: "#faq" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Akun */}
          <div>
            <div className="text-sm font-semibold text-slate-300 mb-4">Akun</div>
            <ul className="space-y-2.5">
              {[
                { label: "Masuk", href: "/sign-in" },
                { label: "Daftar", href: "/sign-up" },
                { label: "Beli Lisensi", href: "/checkout" },
                { label: "Pengaturan", href: "/dashboard" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} FluentRemote. Dibuat untuk para freelancer Indonesia.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-xs text-slate-400 hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/sign-in" className="text-xs text-slate-400 hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
