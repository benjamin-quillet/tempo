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
export default function PrivacyPage() {
  const APP_NAME = "TEMPO";
  const CONTACT_EMAIL = "contact@jointhetempo.app";
  const INSTAGRAM_TEMPO_URL = "https://www.instagram.com/jointhetempo.app/";
  const LAST_UPDATE = "12 janvier 2026";

  // 👉 adapte ça à ton stack réel (ex: Supabase, Expo push, etc.)
  const HOSTING_NOTE =
    "Le service s’appuie sur des prestataires techniques (hébergement, bases de données, envoi de notifications) pour fonctionner.";

  const toc = useMemo(
    () => [
      { id: "intro", label: "Qui sommes-nous ?" },
      { id: "donnees", label: "Données traitées" },
      { id: "finalites", label: "Finalités" },
      { id: "bases", label: "Bases légales" },
      { id: "partage", label: "Partage & prestataires" },
      { id: "conservation", label: "Durées de conservation" },
      { id: "droits", label: "Vos droits (RGPD)" },
      { id: "cookies", label: "Cookies & traceurs" },
      { id: "securite", label: "Sécurité" },
      { id: "contact", label: "Contact" },
    ],
    []
  );

  return (
    <div className="min-h-[100svh] text-white">
      {/* Header sticky */}
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
            <a className="hover:text-white" href="/cgu">
              CGU ↗
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
              @jointhetempo.app ↗
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
                  <Pill>CONFIDENTIALITÉ</Pill>
                  <Pill>Dernière mise à jour : {LAST_UPDATE}</Pill>
                </div>

                <h1 className="mt-5 text-3xl font-extrabold leading-tight md:text-4xl">
                  Politique de confidentialité
                </h1>

                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/75">
                  Cette politique explique quelles données {APP_NAME} traite, pourquoi,
                  combien de temps, et comment exercer vos droits conformément au RGPD.
                </p>

                <div className="mt-6 flex flex-wrap gap-3 text-sm">
                  <a
                    href="/cgu"
                    className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white/85 backdrop-blur transition hover:bg-white/12"
                  >
                    Lire les CGU ↗
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
              <GlassCard id="intro" eyebrow="01" title="Qui sommes-nous ?">
                <p>
                  {APP_NAME} met à disposition une application facilitant la mise en relation
                  entre sportifs et la participation à des activités.
                </p>
                <p>
                  Pour toute question liée à la protection des données, vous pouvez écrire à{" "}
                  <a className="underline hover:text-white" href={`mailto:${CONTACT_EMAIL}`}>
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </GlassCard>
            </Reveal>

            <Reveal delayMs={120}>
              <GlassCard id="donnees" eyebrow="02" title="Données personnelles traitées">
                <p>Selon vos usages, {APP_NAME} peut traiter :</p>
                <Ul>
                  <li>
                    <span className="font-semibold text-white/85">Données de compte</span>{" "}
                    (email, identifiant utilisateur, informations de connexion/authentification).
                  </li>
                  <li>
                    <span className="font-semibold text-white/85">Données de profil</span>{" "}
                    (pseudo/prénom, photo(s), description, sports pratiqués, niveau, objectifs).
                  </li>
                  <li>
                    <span className="font-semibold text-white/85">Préférences & critères</span>{" "}
                    (préférences de recherche/matching, filtres, centres d’intérêt si renseignés).
                  </li>
                  <li>
                    <span className="font-semibold text-white/85">Messagerie</span>{" "}
                    (messages envoyés/reçus, métadonnées techniques : date/heure, identifiants des échanges).
                  </li>
                  <li>
                    <span className="font-semibold text-white/85">Événements / communauté</span>{" "}
                    (événements créés, participation, demandes d’accès, liste des participants).
                  </li>
                  <li>
                    <span className="font-semibold text-white/85">Localisation</span>{" "}
                    (ville/zone et/ou coordonnées GPS si vous l’activez) pour proposer des profils/événements à proximité.
                  </li>
                  <li>
                    <span className="font-semibold text-white/85">Notifications</span>{" "}
                    (jeton de notification “push” et préférences de notification).
                  </li>
                  <li>
                    <span className="font-semibold text-white/85">Sécurité & modération</span>{" "}
                    (signalements, éléments nécessaires à la lutte anti-fraude/anti-spam, logs de modération si applicable).
                  </li>
                  <li>
                    <span className="font-semibold text-white/85">Données techniques</span>{" "}
                    (logs, informations appareil/navigateur, adresse IP, diagnostics, mesures d’audience si activées sur le site vitrine).
                  </li>
                </Ul>
              </GlassCard>
            </Reveal>

            <Reveal delayMs={160}>
              <GlassCard id="finalites" eyebrow="03" title="Finalités">
                <p>Nous traitons ces données pour :</p>
                <Ul>
                  <li>Fournir le service (matching, messagerie, événements).</li>
                  <li>Personnaliser l’expérience (pertinence des profils proposés).</li>
                  <li>Assurer la sécurité (anti-fraude, anti-spam, modération).</li>
                  <li>Support et communication (répondre aux demandes, notifications).</li>
                </Ul>
              </GlassCard>
            </Reveal>

            <Reveal delayMs={200}>
              <GlassCard id="bases" eyebrow="04" title="Bases légales (RGPD)">
                <Ul>
                  <li>
                    <span className="font-semibold text-white/85">Exécution du contrat</span> : fournir le service et ses fonctionnalités.
                  </li>
                  <li>
                    <span className="font-semibold text-white/85">Intérêt légitime</span> : sécurité, prévention des abus, amélioration du service.
                  </li>
                  <li>
                    <span className="font-semibold text-white/85">Consentement</span> : fonctionnalités optionnelles (ex. localisation précise, certains traceurs).
                  </li>
                  <li>
                    <span className="font-semibold text-white/85">Obligation légale</span> : si applicable (ex. réponse à une demande des autorités compétentes).
                  </li>
                </Ul>
              </GlassCard>
            </Reveal>

            <Reveal delayMs={240}>
              <GlassCard id="partage" eyebrow="05" title="Partage & prestataires">
                <p>{HOSTING_NOTE}</p>
                <p>
                  Ces prestataires n’agissent que sur instruction de {APP_NAME} et pour les besoins du service
                  (hébergement, notifications, analytics si activés, etc.).
                </p>
                <p>
                  Certains prestataires peuvent être situés hors UE. Le cas échéant, des garanties appropriées
                  sont mises en place (ex. clauses contractuelles types), lorsque requis.
                </p>
              </GlassCard>
            </Reveal>

            <Reveal delayMs={280}>
              <GlassCard id="conservation" eyebrow="06" title="Durées de conservation (principes)">
                <p>
                  Nous conservons les données pendant une durée proportionnée aux finalités :
                </p>
                <Ul>
                  <li>Données de compte : tant que votre compte est actif, puis suppression/archivage selon obligations légales.</li>
                  <li>Données de messagerie/événements : tant que nécessaire au fonctionnement (et selon vos réglages et usages).</li>
                  <li>Logs techniques : durée limitée pour sécurité et diagnostic.</li>
                </Ul>
              </GlassCard>
            </Reveal>

            <Reveal delayMs={320}>
              <GlassCard id="droits" eyebrow="07" title="Vos droits (RGPD)">
                <p>Vous disposez notamment des droits suivants :</p>
                <Ul>
                  <li>Accès, rectification, effacement.</li>
                  <li>Limitation et opposition (selon conditions).</li>
                  <li>Portabilité (selon conditions).</li>
                  <li>Retrait du consentement à tout moment (si applicable).</li>
                </Ul>
                <p>
                  Pour exercer vos droits :{" "}
                  <a className="underline hover:text-white" href={`mailto:${CONTACT_EMAIL}`}>
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
                <p>
                  Vous avez également le droit d’introduire une réclamation auprès de la{" "}
                  <span className="font-semibold text-white/85">CNIL</span>.
                </p>
              </GlassCard>
            </Reveal>

            <Reveal delayMs={360}>
              <GlassCard id="cookies" eyebrow="08" title="Cookies & traceurs">
                <p>
                  Sur le site vitrine, des cookies/traceurs peuvent être utilisés pour :
                  fonctionnement, mesure d’audience, amélioration des performances.
                </p>
                <p>
                  Lorsque la réglementation l’exige, un bandeau de consentement permet de gérer vos choix.
                </p>
              </GlassCard>
            </Reveal>

            <Reveal delayMs={400}>
              <GlassCard id="securite" eyebrow="09" title="Sécurité">
                <p>
                  {APP_NAME} met en place des mesures techniques et organisationnelles raisonnables
                  pour protéger vos données (contrôles d’accès, chiffrement lorsque pertinent, etc.).
                </p>
              </GlassCard>
            </Reveal>

            <Reveal delayMs={440}>
              <GlassCard id="contact" eyebrow="10" title="Contact">
                <p>
                  Questions / demandes :{" "}
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
                  <a className="hover:text-white" href="/cgu">
                    CGU ↗
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
