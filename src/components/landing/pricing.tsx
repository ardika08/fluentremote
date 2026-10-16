"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  "Akses seumur hidup",
  "Pembaruan fitur & keamanan gratis",
  "2 provider AI: OpenAI & MAIA Router",
  "API key milik Anda sendiri",
  "Mode baca & tulis",
  "Dukungan via email",
];

export function LandingPricing({ price, formatted }: { price: string; formatted: string }) {
  return (
    <section id="harga" className="py-20 relative scroll-mt-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-4">
            <Zap className="w-3.5 h-3.5" />
            Harga
          </div>
          <h2 className="text-balance text-3xl sm:text-4xl font-bold text-white mb-4">
            Miliki Workflow-nya,{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-300 bg-clip-text text-transparent">
              Bukan Tagihan Bulanannya
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Bayar sekali, pakai selamanya. Tanpa langganan, tanpa tagihan berulang.
          </p>
        </motion.div>

        {/* Pricing card */}
        <motion.div
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative rounded-2xl border border-violet-500/30 bg-slate-900/80 backdrop-blur-xl p-8 shadow-2xl shadow-violet-500/10 ring-1 ring-violet-500/20">
            {/* Popular badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <div className="px-4 py-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 text-white text-xs font-bold shadow-lg shadow-violet-500/30">
                Sekali bayar
              </div>
            </div>

            {/* Price */}
            <div className="text-center mb-8 pt-2">
              <div className="text-5xl font-bold text-white mb-1">{formatted}</div>
              <div className="text-slate-400 text-sm">Bayar sekali · Akses selamanya</div>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {features.map((feat) => (
                <li key={feat} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-violet-500/15 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-violet-300" />
                  </div>
                  <span className="text-slate-300 text-sm">{feat}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Button
              asChild
              size="lg"
              className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-400 hover:from-violet-600 hover:to-fuchsia-500 text-white border-0 shadow-lg shadow-violet-500/20"
            >
              <Link href="/checkout">
                Beli Sekarang — {price}
              </Link>
            </Button>

            <p className="text-center text-xs text-slate-400 mt-3">
              Pembayaran aman via Mayar · Tanpa perpanjangan otomatis
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
