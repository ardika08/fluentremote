"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  "Akses seumur hidup",
  "Update gratis selamanya",
  "2 AI provider (OpenAI + MAIA)",
  "Bawa API key sendiri",
  "Read & Write mode",
  "Support via email",
];

export function LandingPricing({ price, formatted }: { price: string; formatted: string }) {
  return (
    <section id="harga" className="py-24 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
            <Zap className="w-3.5 h-3.5" />
            Sekali Bayar
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Miliki Workflow-nya,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Bukan Tagihan Bulanannya
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Bayar sekali, pakai selamanya. Tidak ada subscription, tidak ada kejutan tagihan.
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
          <div className="relative rounded-2xl border border-blue-500/30 bg-slate-900/80 backdrop-blur-xl p-8 shadow-2xl shadow-blue-500/10 ring-1 ring-blue-500/20">
            {/* Popular badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <div className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs font-bold shadow-lg shadow-blue-500/30">
                ✨ One-Time Purchase
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
                  <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-slate-300 text-sm">{feat}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Button
              asChild
              size="lg"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-0 shadow-lg shadow-blue-500/20"
            >
              <Link href="/checkout">
                Beli Sekarang — {price}
              </Link>
            </Button>

            <p className="text-center text-xs text-slate-500 mt-3">
              Pembayaran aman via Mayar · Tidak ada auto-renewal
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
