"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Apa itu FluentRemote?",
    a: "FluentRemote adalah ekstensi Chrome yang menerjemahkan pesan klien langsung di halaman chat Anda, tanpa perlu membuka tab baru atau menyalin teks ke layanan lain.",
  },
  {
    q: "Apakah ini benar-benar bayar sekali?",
    a: "Ya. Anda membayar satu kali dan memperoleh akses permanen, termasuk pembaruan fitur di masa berikutnya. Tidak ada biaya bulanan atau tahunan.",
  },
  {
    q: "AI provider apa yang didukung?",
    a: "FluentRemote mendukung OpenAI (GPT-4o mini) dan MAIA Router. Anda memakai API key milik sendiri, sehingga biaya terjemahan mengikuti tarif provider yang Anda pilih.",
  },
  {
    q: "Apakah riwayat chat saya tersimpan?",
    a: "Tidak. FluentRemote tidak menyimpan isi percakapan Anda. Teks yang diterjemahkan dikirim langsung ke provider AI pilihan Anda dan tidak disimpan di server kami.",
  },
  {
    q: "Platform apa saja yang didukung?",
    a: "FluentRemote bekerja di halaman web apa pun yang Anda buka di Chrome — Upwork, Fiverr, email, Slack, Discord, dan lainnya.",
  },
  {
    q: "Bagaimana cara aktivasi setelah beli?",
    a: "Setelah pembayaran terkonfirmasi, kode lisensi muncul otomatis di halaman Pengaturan akun Anda. Salin kode tersebut ke popup ekstensi, dan aktivasi langsung selesai.",
  },
];

export function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 scroll-mt-20">
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
          <p className="text-slate-400">Masih ada yang kurang jelas? Hubungi kami melalui email.</p>
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
                    ? "border-violet-500/30 bg-violet-500/5"
                    : "border-white/8 bg-slate-900/60 hover:border-white/15"
                }`}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div className="flex items-center justify-between px-5 py-4 gap-4">
                  <span className={`font-medium text-sm sm:text-base ${openIndex === i ? "text-white" : "text-slate-200"}`}>
                    {faq.q}
                  </span>
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${openIndex === i ? "bg-violet-500/20 text-violet-400" : "bg-white/5 text-slate-400"}`}>
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
