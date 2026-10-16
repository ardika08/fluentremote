"use client";

import { motion } from "framer-motion";
import { Languages, Pen, RefreshCw, Shield, Cpu, Globe } from "lucide-react";

const features = [
  {
    icon: Languages,
    title: "Terjemahan Baca",
    description: "Sorot pesan klien; terjemahan muncul sebagai tooltip tanpa meninggalkan halaman.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: Pen,
    title: "Tulis Ulang Pesan",
    description: "Tulis balasan dalam bahasa Anda, lalu FluentRemote menerjemahkan dan menggantinya sebelum dikirim.",
    color: "text-violet-300",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: RefreshCw,
    title: "Ganti Bahasa Kapan Saja",
    description: "Ganti pasangan bahasa dari popup ekstensi. Perubahan langsung aktif tanpa memuat ulang.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: Cpu,
    title: "Pilih AI Provider",
    description: "Pilih OpenAI GPT-4o mini atau MAIA Router dengan API key milik Anda sendiri.",
    color: "text-violet-300",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: Globe,
    title: "Universal di Semua Platform",
    description: "Bekerja di Upwork, Fiverr, email, dan platform chat lain yang Anda buka di Chrome.",
    color: "text-violet-300",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: Shield,
    title: "Privasi Terjaga",
    description: "API key dienkripsi di server. Tidak ada log percakapan yang disimpan.",
    color: "text-violet-300",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
];

export function LandingFeatures() {
  return (
    <section id="fitur" className="py-20 relative scroll-mt-20">
      {/* Subtle background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-3xl" />
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
            Fitur Inti
          </div>
          <h2 className="text-balance text-3xl sm:text-4xl font-bold text-white mb-4">
            Semua yang Anda Butuhkan untuk{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-300 bg-clip-text text-transparent">
              Kerja Lancar
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Dirancang untuk freelancer yang berkomunikasi dengan klien internasional.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className={`h-full rounded-2xl border ${feat.border} ${feat.bg} p-6 hover:border-opacity-40 transition-all group`}>
                <div className={`w-10 h-10 rounded-xl ${feat.bg} border ${feat.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feat.icon className={`w-5 h-5 ${feat.color}`} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
