"use client";

import { motion } from "framer-motion";
import { Languages, Pen, RefreshCw, Shield, Cpu, Globe } from "lucide-react";

const features = [
  {
    icon: Languages,
    title: "Terjemahan Baca",
    description: "Sorot pesan klien — terjemahan muncul langsung sebagai tooltip tanpa meninggalkan halaman.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Pen,
    title: "Tulis Ulang Pesan",
    description: "Draft balasan dalam bahasa sendiri, FluentRemote menerjemahkan dan mengganti teks sebelum kirim.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    icon: RefreshCw,
    title: "Ganti Bahasa Kapan Saja",
    description: "Klik di popup untuk ganti pasangan bahasa. Perubahan langsung aktif tanpa reload.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: Cpu,
    title: "Pilih AI Provider",
    description: "Pakai OpenAI GPT-4o mini atau MAIA Router. Bawa API key sendiri, hemat biaya.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: Globe,
    title: "Universal di Semua Platform",
    description: "Bekerja di Upwork, Fiverr, email, atau platform chat mana saja selama ada browser.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: Shield,
    title: "Privasi Terjaga",
    description: "API key dienkripsi di server. Tidak ada log percakapan yang disimpan.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
];

export function LandingFeatures() {
  return (
    <section id="fitur" className="py-24 relative">
      {/* Subtle background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-4">
            Fitur Inti
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Semua yang Kamu Butuhkan untuk{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Kerja Lancar
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Dirancang khusus untuk freelancer yang sering berkomunikasi dengan klien internasional.
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
