// app/reset-password/page.tsx
"use client";

export const dynamic = "force-dynamic";
// (optionnel) export const revalidate = 0;

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* --------------------------------- Reveal --------------------------------- */
type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
};

function Reveal({ children, className = "", delayMs = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.18 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={[
        "transition-all duration-700 will-change-transform",
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className,
      ].join(" ")}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

/* ------------------------------- Section Shell ------------------------------ */
function SnapSection({ children }: { children: React.ReactNode }) {
  const dark =
    "bg-[linear-gradient(135deg,rgba(7,18,24,1),rgba(6,28,36,1),rgba(7,18,24,1))]";

  return (
    <section
      className={[
        "relative isolate",
        "min-h-[100svh] w-full overflow-hidden",
        dark,
      ].join(" ")}
    >
      {/* glow premium (subtil) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.30]">
        <div className="absolute -top-56 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,.12),transparent_60%)] blur-3xl" />
        <div className="absolute top-[18%] left-[-220px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(131,199,177,.22),transparent_60%)] blur-3xl" />
        <div className="absolute bottom-[-260px] right-[-260px] h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle_at_center,rgba(62,129,190,.22),transparent_62%)] blur-3xl" />
      </div>

      {/* grain discret */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Cfilter id=%22n%22 x=%220%22 y=%220%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22300%22 height=%22300%22 filter=%22url(%23n)%22 opacity=%220.35%22/%3E%3C/svg%3E')] mix-blend-overlay" />

      <div className="relative">{children}</div>
    </section>
  );
}

/* ---------------------------------- UI ---------------------------------- */
function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "password",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "password" | "text";
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-[11px] font-semibold tracking-widest text-white/55">
        {label}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        autoComplete={autoComplete}
        className={[
          "w-full rounded-2xl px-4 py-3",
          "border border-white/12 bg-white/7 text-white",
          "placeholder:text-white/35",
          "shadow-[0_18px_60px_rgba(0,0,0,.16)] backdrop-blur",
          "outline-none transition",
          "focus:border-white/22 focus:ring-2 focus:ring-white/20",
        ].join(" ")}
      />
    </label>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
  loading,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        "group relative w-full overflow-hidden rounded-2xl px-5 py-4",
        "border border-black/20",
        "bg-[linear-gradient(135deg,rgba(131,199,177,.98),rgba(131,199,177,.58))]",
        "text-[#071218] shadow-[0_22px_70px_rgba(131,199,177,.22)]",
        "font-extrabold",
        "transition hover:-translate-y-0.5 active:translate-y-0",
        "disabled:opacity-60 disabled:hover:translate-y-0",
        "focus:outline-none focus:ring-2 focus:ring-white/25",
      ].join(" ")}
    >
      <span className="pointer-events-none absolute inset-[1px] rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,.22),rgba(255,255,255,0))] opacity-45" />
      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black/70" />
            <span>En cours…</span>
          </>
        ) : (
          children
        )}
      </span>
      <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(900px_240px_at_20%_0%,rgba(255,255,255,.35),transparent_50%)]" />
    </button>
  );
}

/* ------------------------------ Helper messages ----------------------------- */
function Banner({
  kind,
  title,
  desc,
}: {
  kind: "info" | "success" | "error";
  title: string;
  desc?: string;
}) {
  const skin =
    kind === "success"
      ? "border-emerald-200/20 bg-emerald-200/10 text-emerald-50"
      : kind === "error"
      ? "border-red-200/20 bg-red-200/10 text-red-50"
      : "border-white/12 bg-white/7 text-white";

  return (
    <div
      className={[
        "rounded-3xl border p-5 shadow-[0_18px_60px_rgba(0,0,0,.16)] backdrop-blur",
        skin,
      ].join(" ")}
    >
      <div className="text-sm font-extrabold">{title}</div>
      {!!desc && <div className="mt-1 text-sm opacity-80">{desc}</div>}
    </div>
  );
}

/* ---------------------------------- Page ---------------------------------- */
export default function ResetPasswordPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // ✅ Crée le client au runtime + fallback si env manquantes
  const supabase: SupabaseClient | null = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) return null;
    return createClient(url, anon);
  }, []);

  const [hydrating, setHydrating] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{
    kind: "info" | "success" | "error";
    title: string;
    desc?: string;
  } | null>(null);

  useEffect(() => {
    const run = async () => {
      // ✅ si env manquantes, on ne casse pas le build, on affiche un message
      if (!supabase) {
        setMsg({
          kind: "error",
          title: "Configuration manquante",
          desc:
            "Ajoute NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans Vercel (Production), puis redeploy.",
        });
        setHasRecoverySession(false);
        setHydrating(false);
        return;
      }

      setMsg({
        kind: "info",
        title: "Vérification du lien…",
        desc: "On prépare la page de réinitialisation.",
      });

      try {
        const url = new URL(window.location.href);

        // 1) hash tokens => setSession
        if (url.hash && url.hash.includes("access_token=")) {
          const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
          const access_token = hashParams.get("access_token");
          const refresh_token = hashParams.get("refresh_token");

          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (error) throw error;

            url.hash = "";
            window.history.replaceState({}, "", url.toString());
          }
        }

        // 2) PKCE code => exchangeCodeForSession
        const code = sp.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;

          url.searchParams.delete("code");
          window.history.replaceState({}, "", url.toString());
        }

        // 3) check session
        const { data } = await supabase.auth.getSession();
        const ok = !!data.session;
        setHasRecoverySession(ok);

        if (ok) {
          setMsg({
            kind: "info",
            title: "Choisis ton nouveau mot de passe",
            desc: "Entre un mot de passe solide, puis confirme-le.",
          });
        } else {
          setMsg({
            kind: "error",
            title: "Lien invalide ou expiré",
            desc:
              "Demande un nouvel email de réinitialisation depuis l’app Tempo, puis réessaie.",
          });
        }
      } catch (e: any) {
        setHasRecoverySession(false);
        setMsg({
          kind: "error",
          title: "Impossible de valider le lien",
          desc: e?.message ?? "Erreur inconnue.",
        });
      } finally {
        setHydrating(false);
      }
    };

    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // sp est volontairement ignoré (Next SearchParams stable en pratique)

  const canSubmit = useMemo(() => {
    if (!supabase) return false;
    if (!hasRecoverySession) return false;
    if (pwd.length < 8) return false;
    if (pwd !== pwd2) return false;
    return true;
  }, [supabase, hasRecoverySession, pwd, pwd2]);

  const onSubmit = async () => {
    if (!supabase) return;
    if (!canSubmit) return;

    setLoading(true);
    setMsg(null);

    try {
      const { error } = await supabase.auth.updateUser({ password: pwd });
      if (error) throw error;

      await supabase.auth.signOut();

      setMsg({
        kind: "success",
        title: "Mot de passe mis à jour ✅",
        desc:
          "Tu peux retourner dans l’app Tempo et te connecter avec ton nouveau mot de passe.",
      });
    } catch (e: any) {
      setMsg({
        kind: "error",
        title: "Échec de la réinitialisation",
        desc: e?.message ?? "Impossible de mettre à jour le mot de passe.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100svh] w-full text-white">
      {/* Header simple (comme ton site) */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-tempo-ink/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="/" className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-[0_14px_40px_rgba(0,0,0,.25)]">
              <Image
                src="/favicon_tempo.svg"
                alt="TEMPO"
                fill
                className="object-contain p-1.5"
                priority
              />
            </div>

            <div className="relative h-6 w-[92px] opacity-95">
              <Image
                src="/logo_tempo.svg"
                alt="TEMPO"
                fill
                className="object-contain"
                priority
              />
            </div>
          </a>

          <a
            href="/"
            className="rounded-xl border border-white/10 bg-white/8 px-3 py-2 text-xs font-extrabold text-white shadow-[0_16px_45px_rgba(0,0,0,.20)] backdrop-blur transition hover:bg-white/12"
          >
            Retour ↗
          </a>
        </div>
      </header>

      <SnapSection>
        <div className="mx-auto flex min-h-[calc(100svh-72px)] max-w-6xl items-center px-5 py-12">
          <div className="mx-auto w-full max-w-xl">
            <Reveal>
              <div className="relative">
                <div className="absolute -inset-8 rounded-[34px] bg-[linear-gradient(135deg,rgba(131,199,177,.18),rgba(62,129,190,.14))] blur-2xl" />
                <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/6 p-8 shadow-[0_22px_80px_rgba(0,0,0,.22)] backdrop-blur">
                  <div className="text-[11px] font-semibold tracking-widest text-white/55">
                    TEMPO • RESET
                  </div>

                  <h1 className="mt-3 text-3xl font-extrabold leading-tight">
                    Nouveau mot de passe
                  </h1>

                  <p className="mt-2 text-sm text-white/70">
                    Définis un nouveau mot de passe pour ton compte Tempo.
                  </p>

                  <div className="mt-6 flex flex-col gap-4">
                    {!!msg && (
                      <Reveal delayMs={80}>
                        <Banner kind={msg.kind} title={msg.title} desc={msg.desc} />
                      </Reveal>
                    )}

                    {!hydrating && hasRecoverySession && (
                      <>
                        <Reveal delayMs={120}>
                          <Field
                            label="MOT DE PASSE"
                            value={pwd}
                            onChange={setPwd}
                            placeholder="6 caractères minimum"
                            type="password"
                            autoComplete="new-password"
                          />
                        </Reveal>

                        <Reveal delayMs={160}>
                          <Field
                            label="CONFIRMATION"
                            value={pwd2}
                            onChange={setPwd2}
                            placeholder="Retape ton mot de passe"
                            type="password"
                            autoComplete="new-password"
                          />
                        </Reveal>

                        <Reveal delayMs={200}>
                          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
                            <div className="font-extrabold text-white">
                              Conseils rapides
                            </div>
                            <ul className="mt-2 list-disc space-y-1 pl-5">
                              <li>6+ caractères</li>
                              <li>Majuscules + minuscules + chiffres + caractère spécial</li>
                              <li>Évite les mots de passe réutilisés</li>
                            </ul>
                          </div>
                        </Reveal>

                        <Reveal delayMs={240}>
                          <PrimaryButton
                            onClick={onSubmit}
                            disabled={!canSubmit}
                            loading={loading}
                          >
                            Mettre à jour le mot de passe ↗
                          </PrimaryButton>

                          <div className="mt-3 text-center text-xs text-white/45">
                            Si ça échoue, regénère un email “mot de passe oublié” dans l’app.
                          </div>
                        </Reveal>
                      </>
                    )}

                    {!hydrating && !hasRecoverySession && (
                      <Reveal delayMs={140}>
                        <div className="mt-2 flex flex-col gap-3">
                          <a
                            href="/"
                            className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-center text-sm font-extrabold text-white backdrop-blur transition hover:bg-white/12"
                          >
                            Retour au site ↗
                          </a>

                          <button
                            type="button"
                            onClick={() => router.push("/")}
                            className="text-center text-xs text-white/55 hover:text-white"
                          >
                            Revenir à l’accueil
                          </button>
                        </div>
                      </Reveal>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delayMs={260}>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/45">
                <a className="hover:text-white" href="/cgu">
                  CGU ↗
                </a>
                <span className="opacity-40">•</span>
                <a className="hover:text-white" href="/privacy">
                  Confidentialité ↗
                </a>
                <span className="opacity-40">•</span>
                <span>© {new Date().getFullYear()} TEMPO</span>
              </div>
            </Reveal>
          </div>
        </div>
      </SnapSection>
    </div>
  );
}
