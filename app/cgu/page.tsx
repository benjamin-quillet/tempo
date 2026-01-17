"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";

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
function SnapSection({
  id,
  variant,
  children,
}: {
  id?: string;
  variant: "dark" | "light";
  children: React.ReactNode;
}) {
  const dark =
    "bg-[linear-gradient(135deg,rgba(7,18,24,1),rgba(6,28,36,1),rgba(7,18,24,1))]";
  const light =
    "bg-[linear-gradient(135deg,rgba(62,129,190,.96),rgba(83,154,191,.72),rgba(131,199,177,.74))]";

  return (
    <section
      id={id}
      className={[
        "relative isolate",
        "min-h-[100svh] w-full overflow-hidden",
        variant === "dark" ? dark : light,
      ].join(" ")}
    >
      {/* glow premium (subtil) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.28]">
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

/* ------------------------------ Small UI helpers ---------------------------- */
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-2xl border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur">
      {children}
    </span>
  );
}

function GlassCard({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 overflow-hidden rounded-[28px] border border-white/12 bg-white/7 p-7 shadow-[0_24px_80px_rgba(0,0,0,.18)] backdrop-blur"
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-[11px] font-semibold tracking-widest text-white/55">
            {eyebrow}
          </div>
          <h2 className="mt-2 text-xl font-extrabold text-white">{title}</h2>
        </div>
        <a
          href="#top"
          className="shrink-0 rounded-xl border border-white/10 bg-white/7 px-3 py-2 text-xs font-semibold text-white/80 backdrop-blur transition hover:bg-white/12"
        >
          ↑ Haut
        </a>
      </div>

      <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/75">
        {children}
      </div>
    </section>
  );
}

function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="mt-2 list-disc space-y-2 pl-5">{children}</ul>;
}

/* ---------------------------------- Page ---------------------------------- */
export default function CGUPage() {
  const APP_NAME = "TEMPO";
  const CONTACT_EMAIL = "contact@tempo.app";
  const INSTAGRAM_TEMPO_URL = "https://instagram.com/tempo";
  const LAST_UPDATE = "12 janvier 2026";

  const toc = useMemo(
    () => [
      { id: "objet", label: "Objet" },
      { id: "acces", label: "Accès & Compte" },
      { id: "fonctionnement", label: "Fonctionnement du service" },
      { id: "regles", label: "Règles & Modération" },
      { id: "ip", label: "Propriété intellectuelle" },
      { id: "responsabilite", label: "Responsabilité" },
      { id: "suspension", label: "Suspension / Résiliation" },
      { id: "modifs", label: "Modifications" },
      { id: "droit", label: "Droit applicable" },
      { id: "contact", label: "Contact" },
    ],
    []
  );

  return (
    <div className="min-h-[100svh] text-white">
      {/* Header sticky (même vibe que ta home) */}
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

          <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            <a className="hover:text-white" href="/privacy">
              Confidentialité ↗
            </a>
            <a className="hover:text-white" href={`mailto:${CONTACT_EMAIL}`}>
              Contact ↗
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={INSTAGRAM_TEMPO_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-xl border border-white/10 bg-white/7 px-3 py-2 text-xs font-semibold text-white/85 backdrop-blur transition hover:bg-white/12 md:inline-flex"
            >
              @tempo ↗
            </a>
            <a
              href="/"
              className="rounded-xl border border-white/10 bg-white/8 px-3 py-2 text-xs font-extrabold text-white shadow-[0_16px_45px_rgba(0,0,0,.20)] backdrop-blur transition hover:bg-white/12"
            >
              Retour accueil ↗
            </a>
          </div>
        </div>
      </header>

      <SnapSection id="top" variant="dark">
        <div className="mx-auto max-w-6xl px-5 py-10 md:py-12">
          <Reveal>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr,360px] md:items-start">
              {/* Hero */}
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <Pill>CGU</Pill>
                  <Pill>Dernière mise à jour : {LAST_UPDATE}</Pill>
                </div>

                <h1 className="mt-5 text-3xl font-extrabold leading-tight md:text-4xl">
                  Conditions Générales d’Utilisation
                </h1>

                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/75">
                  Les présentes CGU définissent les règles d’utilisation de {APP_NAME}.
                  En créant un compte ou en utilisant l’application, vous acceptez ces conditions.
                </p>

                <div className="mt-6 flex flex-wrap gap-3 text-sm">
                  <a
                    href="/privacy"
                    className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white/85 backdrop-blur transition hover:bg-white/12"
                  >
                    Lire la Politique de confidentialité ↗
                  </a>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white/85 backdrop-blur transition hover:bg-white/12"
                  >
                    {CONTACT_EMAIL} ↗
                  </a>
                </div>
              </div>

              {/* Sommaire */}
              <div className="rounded-[28px] border border-white/12 bg-white/7 p-6 shadow-[0_24px_80px_rgba(0,0,0,.18)] backdrop-blur">
                <div className="text-[11px] font-semibold tracking-widest text-white/55">
                  SOMMAIRE
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  {toc.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/80 transition hover:bg-white/12 hover:text-white"
                    >
                      {s.label} ↘
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Sections */}
          <div className="mt-10 grid grid-cols-1 gap-5">
            <Reveal delayMs={80}>
              <GlassCard id="objet" eyebrow="01" title="Objet">
                <p>
                  {APP_NAME} est une application qui facilite la mise en relation entre sportifs
                  et la participation à des activités (ex. partenaires d’entraînement, événements).
                </p>
                <p>
                  Les présentes CGU encadrent l’accès et l’usage du service, ainsi que les règles
                  applicables à la communauté.
                </p>
              </GlassCard>
            </Reveal>

            <Reveal delayMs={120}>
              <GlassCard id="acces" eyebrow="02" title="Accès au service & Compte">
                <p>
                  Pour accéder à certaines fonctionnalités, la création d’un compte est nécessaire.
                  Vous vous engagez à fournir des informations exactes et à jour.
                </p>

                {/* ✅ ajout : âge minimum 18 ans (et suppression de l'ancien "option") */}
                <p className="font-semibold text-white/85">
                  Condition d’âge
                </p>
                <p>
                  L’accès et l’utilisation de {APP_NAME} sont réservés aux personnes âgées d’au moins{" "}
                  <span className="font-semibold text-white">18 ans</span>.
                  En créant un compte, vous déclarez et garantissez avoir 18 ans ou plus.
                </p>

                <Ul>
                  <li>Vous êtes responsable de la confidentialité de vos identifiants.</li>
                  <li>Vous ne devez pas usurper l’identité d’un tiers.</li>
                  <li>Vous ne devez pas utiliser le service à des fins frauduleuses ou illégales.</li>
                </Ul>
              </GlassCard>
            </Reveal>

            <Reveal delayMs={160}>
              <GlassCard id="fonctionnement" eyebrow="03" title="Fonctionnement du service">
                <p>
                  {APP_NAME} propose notamment : la découverte de profils, la messagerie,
                  et/ou la création/participation à des entraînements et événements.
                </p>
                <p>
                  Les fonctionnalités peuvent évoluer. Certaines options peuvent être réservées
                  à une version premium si tu le mets en place.
                </p>
              </GlassCard>
            </Reveal>

            <Reveal delayMs={200}>
              <GlassCard id="regles" eyebrow="04" title="Règles de conduite & Modération">
                <p>
                  Nous voulons une communauté saine. Certains contenus ou comportements peuvent conduire
                  à des actions de modération (suppression, limitation, suspension, bannissement).
                </p>
                <p className="font-semibold text-white/85">Interdictions (exemples) :</p>
                <Ul>
                  <li>Harcèlement, menaces, propos haineux/discriminatoires, violence.</li>
                  <li>Contenus illégaux, diffamatoires, trompeurs ou portant atteinte aux droits de tiers.</li>
                  <li>Spam, sollicitations commerciales agressives, tentatives de fraude.</li>
                  <li>Partage de coordonnées privées d’autrui sans consentement.</li>
                </Ul>
              </GlassCard>
            </Reveal>

            <Reveal delayMs={240}>
              <GlassCard id="ip" eyebrow="05" title="Propriété intellectuelle">
                <p>
                  La marque, le logo, l’interface, les textes et éléments graphiques de {APP_NAME}
                  sont protégés. Toute reproduction non autorisée est interdite.
                </p>
                <p>
                  Vous conservez vos droits sur les contenus que vous publiez, mais vous accordez à {APP_NAME}
                  une licence nécessaire à l’exploitation du service (hébergement, affichage, diffusion dans l’app).
                </p>
              </GlassCard>
            </Reveal>

            <Reveal delayMs={280}>
              <GlassCard id="responsabilite" eyebrow="06" title="Responsabilité">
                <p>
                  {APP_NAME} met en œuvre des efforts raisonnables pour assurer le bon fonctionnement du service,
                  sans garantir une disponibilité continue ou l’absence d’erreurs.
                </p>
                <Ul>
                  <li>
                    {APP_NAME} n’est pas responsable des comportements des utilisateurs ni des échanges entre eux.
                  </li>
                  <li>
                    Les entraînements/rencontres se font sous votre responsabilité (prudence, choix du lieu, etc.).
                  </li>
                </Ul>
              </GlassCard>
            </Reveal>

            <Reveal delayMs={320}>
              <GlassCard id="suspension" eyebrow="07" title="Suspension / Résiliation">
                <p>
                  En cas de non-respect des CGU ou de risque pour la communauté, {APP_NAME} peut
                  suspendre ou supprimer un compte, avec ou sans préavis selon la gravité.
                </p>
                <p>
                  Vous pouvez également supprimer votre compte (selon les fonctionnalités disponibles)
                  et demander l’effacement de vos données conformément au RGPD (voir Confidentialité).
                </p>
              </GlassCard>
            </Reveal>

            <Reveal delayMs={360}>
              <GlassCard id="modifs" eyebrow="08" title="Modifications des CGU">
                <p>
                  Nous pouvons mettre à jour ces CGU. La date de mise à jour est indiquée en haut de page.
                  En cas de modification substantielle, nous pourrons vous en informer via l’application
                  ou par email.
                </p>
              </GlassCard>
            </Reveal>

            <Reveal delayMs={400}>
              <GlassCard id="droit" eyebrow="09" title="Droit applicable & Litiges">
                <p>
                  Les présentes CGU sont soumises au droit français, sous réserve des dispositions d’ordre public.
                </p>
              </GlassCard>
            </Reveal>

            <Reveal delayMs={440}>
              <GlassCard id="contact" eyebrow="10" title="Contact">
                <p>
                  Pour toute question relative aux CGU, contactez-nous :{" "}
                  <a className="underline hover:text-white" href={`mailto:${CONTACT_EMAIL}`}>
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </GlassCard>
            </Reveal>
          </div>

          {/* Footer mini */}
          <div className="mt-10 border-t border-white/10 pt-8">
            <Reveal>
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    <Image
                      src="/favicon_tempo.svg"
                      alt="TEMPO"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="relative h-6 w-[104px] opacity-95">
                    <Image
                      src="/logo_tempo.svg"
                      alt="TEMPO"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-sm text-white/70">
                  <a className="hover:text-white" href="/">
                    Accueil ↗
                  </a>
                  <a className="hover:text-white" href="/privacy">
                    Politique de confidentialité ↗
                  </a>
                  <a className="hover:text-white" href={`mailto:${CONTACT_EMAIL}`}>
                    {CONTACT_EMAIL} ↗
                  </a>
                </div>

                <div className="text-xs text-white/45">
                  © {new Date().getFullYear()} {APP_NAME}. Tous droits réservés.
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </SnapSection>
    </div>
  );
}
