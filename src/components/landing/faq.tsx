"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Apa itu FluentRemote?",
    a: "FluentRemote adalah ekstensi Chrome yang membantu freelancer dan remote worker menerjemahkan pesan klien langsung di halaman chat — tanpa perlu buka tab baru atau copy-paste ke Google Translate.",
  },
  {
    q: "Apakah ini benar-benar bayar sekali?",
    a: "Ya. Kamu bayar satu kali dan mendapat akses selamanya termasuk semua update di masa depan. Tidak ada biaya bulanan atau tahunan.",
  },
  {
    q: "AI provider apa yang didukung?",
    a: "FluentRemote mendukung OpenAI (GPT-4o mini) dan MAIA Router. Kamu bisa bawa API key sendiri sehingga biaya terjemahan sangat minimal — biasanya kurang dari Rp100 untuk ratusan terjemahan.",
  },
  {
    q: "Apakah riwayat chat saya tersimpan?",
    a: "Tidak. FluentRemote tidak menyimpan isi percakapan kamu. Teks yang diterjemahkan dikirim langsung ke AI provider pilihan kamu dan tidak pernah disimpan di server kami.",
  },
  {
    q: "Platform apa saja yang didukung?",
    a: "FluentRemote bekerja di semua halaman web yang bisa dibuka di Chrome — Upwork, Fiverr, email, Slack, Discord, dan lainnya. Selama ada browser, FluentRemote bisa dipakai.",
  },
  {
    q: "Bagaimana cara aktivasi setelah beli?",
    a: "Setelah pembayaran berhasil, kamu akan mendapat lisensi key via email. Masukkan key tersebut di popup extension FluentRemote dan langsung aktif dalam hitungan detik.",
  },
];

export function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Pertanyaan Umum
          </h2>
          <p className="text-slate-400">Ada yang kurang jelas? Hubungi kami via email.</p>
        </motion.div>

        {/* FAQ items */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div
                className={`rounded-xl border transition-colors cursor-pointer ${
                  openIndex === i
                    ? "border-blue-500/30 bg-blue-500/5"
                    : "border-white/8 bg-slate-900/60 hover:border-white/15"
                }`}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div className="flex items-center justify-between px-5 py-4 gap-4">
                  <span className={`font-medium text-sm sm:text-base ${openIndex === i ? "text-white" : "text-slate-200"}`}>
                    {faq.q}
                  </span>
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${openIndex === i ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-slate-400"}`}>
                    {openIndex === i ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </div>

                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
