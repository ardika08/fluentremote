"use client";

import { motion } from "framer-motion";
import { Download, Key, Settings, Zap } from "lucide-react";

const steps = [
  {
    icon: Zap,
    number: "01",
    title: "Beli Lisensi",
    description: "Beli sekali, pakai selamanya. Tidak ada biaya langganan bulanan.",
    color: "from-blue-500 to-blue-600",
    glow: "bg-blue-500/20",
  },
  {
    icon: Download,
    number: "02",
    title: "Install Extension",
    description: "Pasang FluentRemote dari Chrome Web Store dalam 30 detik.",
    color: "from-cyan-500 to-cyan-600",
    glow: "bg-cyan-500/20",
  },
  {
    icon: Key,
    number: "03",
    title: "Hubungkan Akun",
    description: "Masukkan lisensi key di popup extension. Selesai, langsung aktif.",
    color: "from-violet-500 to-violet-600",
    glow: "bg-violet-500/20",
  },
  {
    icon: Settings,
    number: "04",
    title: "Mulai Terjemahkan",
    description: "Sorot teks di halaman chat mana saja — terjemahan muncul instan.",
    color: "from-emerald-500 to-emerald-600",
    glow: "bg-emerald-500/20",
  },
];

export function LandingHowItWorks() {
  return (
    <section id="cara-kerja" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
            Cara Kerja
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Setup dalam{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              5 Menit
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Dari beli sampai aktif — tidak butuh konfigurasi rumit.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="relative h-full rounded-2xl border border-white/8 bg-slate-900/60 backdrop-blur-sm p-6 hover:border-white/15 transition-colors">
                {/* Step number */}
                <div className="absolute top-4 right-4 text-4xl font-bold text-white/5">
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-lg`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
