"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, MessageSquare, Languages, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0 });
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const fallback = setTimeout(() => setStarted(true), 1500);
    return () => clearTimeout(fallback);
  }, []);

  useEffect(() => {
    if (!isInView && !started) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, started, target]);

  return (
    <span ref={ref} aria-label={`${target.toLocaleString()}${suffix}`}>
      <span aria-hidden="true">{count.toLocaleString()}{suffix}</span>
    </span>
  );
}

const stats = [
  { value: 95, suffix: "%", label: "Lebih cepat balas klien" },
  { value: 2, suffix: " AI", label: "Provider pilihan" },
  { value: 1, suffix: "x bayar", label: "Akses selamanya" },
];

export function LandingHero({ price }: { price: string }) {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />
              Chrome Extension untuk Freelancer Remote
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white mb-6">
              Terjemahkan Chat Klien{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Tanpa Putus Alur
              </span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-xl">
              FluentRemote adalah ekstensi Chrome yang membantu freelancer terjemahkan pesan klien
              langsung di halaman chat — tanpa copy-paste, tanpa tab baru.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-0 shadow-lg shadow-blue-500/25"
              >
                <Link href="/checkout">
                  Mulai Sekarang — {price}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
              >
                <Link href="/settings">Lihat Demo</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/8 bg-white/3 px-4 py-3 backdrop-blur-sm"
                >
                  <div className="text-2xl font-bold text-white">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
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
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-sm font-bold">
                  C
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Client_John</div>
                  <div className="text-xs text-slate-400">Upwork · Online</div>
                </div>
                <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400 font-medium">Live</span>
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
                      <span className="bg-blue-500/20 text-blue-300 px-1 rounded">
                        next Thursday
                      </span>{" "}
                      with full color grading?
                    </div>
                    {/* Translation tooltip */}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.3 }}
                      className="absolute -bottom-9 left-0 bg-slate-900 border border-blue-500/30 rounded-lg px-3 py-1.5 text-xs text-blue-300 whitespace-nowrap shadow-lg z-10"
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
                  <div className="bg-gradient-to-r from-blue-600/80 to-cyan-600/80 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-white leading-relaxed max-w-[80%]">
                    Sure! I'll have it ready by Wednesday EOD with full color grading included. 🎬
                  </div>
                </div>
              </div>

              {/* Input bar */}
              <div className="flex items-center gap-2 bg-slate-900/60 rounded-xl px-3 py-2.5 border border-white/8">
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-500 flex-1">Tulis pesan...</span>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs font-medium">
                  <Languages className="w-3.5 h-3.5" />
                  Terjemahkan
                </button>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              className="absolute -top-4 -right-4"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-4 py-2 rounded-full shadow-lg shadow-emerald-500/25 text-sm font-bold whitespace-nowrap">
                ✨ AI Powered
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
