"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Zap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

function scrollToSection(id: string, onDone?: () => void) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
    onDone?.();
  }
}

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      if (mobileOpen) setMobileOpen(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { id: "cara-kerja", label: "Cara Kerja" },
    { id: "fitur", label: "Fitur" },
    { id: "harga", label: "Harga" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-fuchsia-400 z-[60] origin-left"
        style={{ scaleX }}
      />

      <nav
        className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
          scrolled
            ? "bg-slate-900/95 backdrop-blur-xl border-white/10"
            : "bg-slate-900/80 backdrop-blur-xl border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-400">
                <Zap className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-300 bg-clip-text text-transparent">
                FluentRemote
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden sm:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden sm:flex items-center gap-3">
              <Button asChild variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <Link href="/sign-in">Masuk</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-violet-500 to-fuchsia-400 hover:from-violet-600 hover:to-fuchsia-500 text-white border-0"
              >
                <Link href="/checkout">Beli Lisensi</Link>
              </Button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="sm:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden overflow-hidden border-t border-white/5"
            >
              <div className="px-4 py-3 space-y-1 bg-slate-900/95 backdrop-blur-xl">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    className="w-full text-left px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                    onClick={() => scrollToSection(link.id, () => setMobileOpen(false))}
                  >
                    {link.label}
                  </button>
                ))}
                <div className="pt-2 pb-1 space-y-2">
                  <Button asChild variant="ghost" className="w-full text-slate-300">
                    <Link href="/sign-in" onClick={() => setMobileOpen(false)}>Masuk</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-400 hover:from-violet-600 hover:to-fuchsia-500 text-white border-0"
                  >
                    <Link href="/checkout" onClick={() => setMobileOpen(false)}>Beli Lisensi</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
