"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingFloatingCTA({ price }: { price: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Bottom CTA bar */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/8 bg-slate-900/95 backdrop-blur-xl px-4 py-3"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-300 font-medium">FluentRemote</span>
                <span className="text-slate-500 text-sm">— Terjemahan instan untuk freelancer</span>
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white border border-white/10"
                >
                  <a href="#harga">Lihat Harga</a>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-0 shadow-lg shadow-blue-500/20"
                >
                  <Link href="/checkout">Beli — {price}</Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Scroll to top */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-20 right-5 z-50 w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shadow-lg"
            aria-label="Scroll ke atas"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </>
      )}
    </AnimatePresence>
  );
}
