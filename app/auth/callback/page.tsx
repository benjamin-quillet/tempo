"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";

export default function AuthCallbackPage() {
  const [seconds, setSeconds] = useState(4);

  // TODO: remplace par ton deep link réel quand tu l’auras (Tempo://, etc.)
  // Pour l’instant, on renvoie vers la home du site.
  const OPEN_APP_URL = "https://www.jointhetempo.app/";
  const HOME_URL = "https://www.jointhetempo.app/";

  useEffect(() => {
    // petit timer “pro” + auto-redirect soft (optionnel)
    const t = window.setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    const go = window.setTimeout(() => {
      // tu peux commenter ça si tu préfères ne pas auto-redirect
      window.location.href = OPEN_APP_URL;
    }, 4200);

    return () => {
      window.clearInterval(t);
      window.clearTimeout(go);
    };
  }, []);

  const bg =
    "bg-[linear-gradient(135deg,rgba(6,19,28,1),rgba(6,36,47,1),rgba(6,19,28,1))]";

  return (
    <main className={["relative isolate min-h-[100svh] w-full overflow-hidden", bg].join(" ")}>
      {/* glow */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.32]">
        <div className="absolute -top-56 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,.12),transparent_60%)] blur-3xl" />
        <div className="absolute top-[18%] left-[-220px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(87,247,203,.22),transparent_60%)] blur-3xl" />
        <div className="absolute bottom-[-260px] right-[-260px] h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle_at_center,rgba(87,247,203,.18),transparent_62%)] blur-3xl" />
      </div>

      {/* grain */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Cfilter id=%22n%22 x=%220%22 y=%220%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22300%22 height=%22300%22 filter=%22url(%23n)%22 opacity=%220.35%22/%3E%3C/svg%3E')] mix-blend-overlay" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-2xl items-center px-5 py-14">
        <div className="w-full">
          {/* header mini */}
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_14px_40px_rgba(0,0,0,.25)]">
              <Image src="/favicon_tempo.svg" alt="TEMPO" fill className="object-contain p-2" />
            </div>
            <div className="relative h-6 w-[110px] opacity-95">
              <Image src="/logo_tempo.svg" alt="TEMPO" fill className="object-contain" />
            </div>
          </div>

          {/* card */}
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/6 p-8 shadow-[0_24px_90px_rgba(0,0,0,.28)] backdrop-blur">
            <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,.14),transparent_60%)] blur-2xl" />
            <div className="pointer-events-none absolute -left-28 -bottom-28 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(87,247,203,.18),transparent_60%)] blur-2xl" />

            <div className="text-center">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/7 px-4 py-2 text-xs font-extrabold text-white/85">
                ✅ EMAIL CONFIRMÉ
              </div>

              <h1 className="mt-5 text-3xl font-extrabold text-white">
                Ton compte est prêt
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Tu peux maintenant ouvrir Tempo et commencer à matcher des partenaires
                qui te ressemblent.
              </p>

              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <a
                  href={OPEN_APP_URL}
                  className={[
                    "group relative flex items-center justify-center rounded-2xl px-5 py-4",
                    "border border-black/25 bg-[linear-gradient(135deg,rgba(87,247,203,.98),rgba(87,247,203,.62))]",
                    "text-[#06131C] shadow-[0_22px_70px_rgba(87,247,203,.18)]",
                    "font-extrabold transition hover:-translate-y-0.5 active:translate-y-0",
                    "focus:outline-none focus:ring-2 focus:ring-white/30",
                  ].join(" ")}
                >
                  Ouvrir Tempo ↗
                  <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(900px_240px_at_20%_0%,rgba(255,255,255,.35),transparent_50%)]" />
                </a>

                <a
                  href={HOME_URL}
                  className={[
                    "flex items-center justify-center rounded-2xl px-5 py-4",
                    "border border-white/10 bg-white/7 text-white/85 backdrop-blur",
                    "font-extrabold transition hover:bg-white/10",
                    "focus:outline-none focus:ring-2 focus:ring-white/30",
                  ].join(" ")}
                >
                  Retour au site
                </a>
              </div>

              <div className="mt-6 text-xs text-white/50">
                Redirection automatique dans <span className="font-extrabold text-white/70">{seconds}s</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-white/45">
            Si rien ne se passe, clique sur “Ouvrir Tempo”.
          </div>
        </div>
      </div>
    </main>
  );
}
