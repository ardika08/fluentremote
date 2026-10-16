"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Languages, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const facts = [
  { title: "Sekali bayar", detail: "Tanpa langganan bulanan" },
  { title: "2 provider AI", detail: "OpenAI & MAIA Router" },
  { title: "API key Anda", detail: "Terenkripsi di server" },
];

export function LandingHero({ price }: { price: string }) {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />
              Ekstensi Chrome untuk pekerja remote
            </div>

            <h1 className="text-balance text-4xl sm:text-5xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-white mb-6">
              Terjemahkan Chat Klien{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-300 bg-clip-text text-transparent">
                Tanpa Putus Alur
              </span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-xl">
              FluentRemote menerjemahkan pesan klien langsung di halaman chat yang Anda buka.
              Tanpa menyalin teks, tanpa berpindah tab.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-violet-500 to-fuchsia-400 hover:from-violet-600 hover:to-fuchsia-500 text-white border-0 shadow-lg shadow-violet-500/25"
              >
                <Link href="/checkout">
                  Beli Lisensi — {price}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
              >
                <a href="#cara-kerja">Lihat Cara Kerja</a>
              </Button>
            </div>

            {/* Fakta produk */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {facts.map((fact) => (
                <div
                  key={fact.title}
                  className="rounded-[14px] border border-white/8 bg-white/3 px-4 py-3 backdrop-blur-sm"
                >
                  <div className="text-sm font-semibold text-white">{fact.title}</div>
                  <div className="mt-0.5 text-xs text-slate-400">{fact.detail}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — mock UI */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Mock chat card */}
            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl shadow-black/40">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/8">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-400 flex items-center justify-center text-white text-sm font-bold">
                  C
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Client_John</div>
                  <div className="text-xs text-slate-400">Upwork · Online</div>
                </div>
                <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/15 border border-violet-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  <span className="text-xs text-violet-300 font-medium">Live</span>
                </div>
              </div>

              {/* Chat bubbles */}
              <div className="space-y-3 mb-4">
                {/* Client message with highlight */}
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white flex-shrink-0 mt-0.5">
                    C
                  </div>
                  <div className="relative">
                    <div className="bg-slate-700/80 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-slate-200 leading-relaxed">
                      Hi! Can you deliver the video by{" "}
                      <span className="bg-violet-500/20 text-violet-300 px-1 rounded">
                        next Thursday
                      </span>{" "}
                      with full color grading?
                    </div>
                    {/* Translation tooltip */}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.3 }}
                      className="absolute -bottom-9 left-0 bg-slate-900 border border-violet-500/30 rounded-lg px-3 py-1.5 text-xs text-violet-300 whitespace-nowrap shadow-lg z-10"
                    >
                      <Languages className="w-3 h-3 inline mr-1.5" />
                      Bisakah kirim video Kamis depan dengan color grading?
                    </motion.div>
                  </div>
                </div>

                {/* Spacer for tooltip */}
                <div className="h-4" />

                {/* My reply */}
                <div className="flex gap-2.5 justify-end">
                  <div className="bg-gradient-to-r from-violet-600/80 to-fuchsia-600/80 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-white leading-relaxed max-w-[80%]">
                    Sure! I'll have it ready by Wednesday EOD with full color grading included.
                  </div>
                </div>
              </div>

              {/* Input bar */}
              <div className="flex items-center gap-2 bg-slate-900/60 rounded-xl px-3 py-2.5 border border-white/8">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400 flex-1">Tulis pesan...</span>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-400 text-white text-xs font-medium">
                  <Languages className="w-3.5 h-3.5" />
                  Terjemahkan
                </button>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              className="absolute -top-4 right-2 sm:-right-4"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="bg-gradient-to-r from-violet-500 to-fuchsia-400 text-white px-4 py-2 rounded-full shadow-lg shadow-violet-500/25 text-sm font-bold whitespace-nowrap">
                AI Powered
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
