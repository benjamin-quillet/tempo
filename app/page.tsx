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
        "relative isolate snap-start",
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

/* ------------------------------ Premium Buttons ----------------------------- */
function DownloadButton({
  href,
  store,
}: {
  href: string;
  store: "appstore" | "play";
}) {
  const isApp = store === "appstore";

  const skin = isApp
    ? [
        "border-black/25",
        "text-[#071218]",
        "bg-[linear-gradient(135deg,rgba(131,199,177,.98),rgba(131,199,177,.58))]",
        "shadow-[0_22px_70px_rgba(131,199,177,.24)]",
      ].join(" ")
    : [
        "border-white/14",
        "text-white",
        "bg-[linear-gradient(135deg,rgba(62,129,190,.98),rgba(83,154,191,.58))]",
        "shadow-[0_22px_70px_rgba(62,129,190,.22)]",
      ].join(" ");

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={[
        "group relative flex items-center justify-between gap-4 rounded-2xl px-5 py-4",
        "border backdrop-blur",
        "transition hover:-translate-y-0.5 active:translate-y-0",
        "focus:outline-none focus:ring-2 focus:ring-white/30",
        skin,
      ].join(" ")}
    >
      <span className="pointer-events-none absolute inset-[1px] rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,.22),rgba(255,255,255,0))] opacity-45" />

      <span className="relative flex items-center gap-4">
        <span
          className={[
            "relative grid h-10 w-10 place-items-center rounded-xl",
            "border shadow-[0_16px_40px_rgba(0,0,0,.18)]",
            isApp ? "border-black/20 bg-white/55" : "border-white/14 bg-white/10",
          ].join(" ")}
        >
          <span
            className={[
              "h-2.5 w-2.5 rounded-full",
              isApp ? "bg-black/60" : "bg-white/75",
            ].join(" ")}
          />
        </span>

        <span className="flex flex-col leading-tight">
          <span
            className={[
              "text-[11px] font-semibold uppercase tracking-wider",
              isApp ? "text-black/60" : "text-white/60",
            ].join(" ")}
          >
            Télécharger
          </span>
          <span className="text-sm font-extrabold">
            {isApp ? "App Store" : "Google Play"}
          </span>
        </span>
      </span>

      <span className="relative text-sm font-extrabold opacity-80 transition group-hover:opacity-100">
        ↗
      </span>

      <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(900px_240px_at_20%_0%,rgba(255,255,255,.35),transparent_50%)]" />
    </a>
  );
}

/* -------------------------------- Idea Cards -------------------------------- */
function IdeaCard({
  index,
  title,
  desc,
}: {
  index: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-white/12 bg-white/7 p-7 shadow-[0_24px_80px_rgba(0,0,0,.18)] backdrop-blur transition hover:-translate-y-1 hover:border-white/20">
      <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,.14),transparent_60%)] blur-2xl" />
      <div className="pointer-events-none absolute -left-32 -bottom-32 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(131,199,177,.18),transparent_60%)] blur-2xl" />

      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-widest text-white/55">
            {index}
          </div>
          <div className="mt-2 text-xl font-extrabold text-white">{title}</div>
          <p className="mt-3 text-sm leading-relaxed text-white/72">{desc}</p>
        </div>

        <div className="shrink-0">
          <div className="rounded-2xl border border-white/12 bg-white/7 px-3 py-2 text-sm font-extrabold text-white/85">
            {index}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Algo / Tech panel --------------------------- */
function TechPanel() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-white/7 p-7 shadow-[0_24px_80px_rgba(0,0,0,.16)] backdrop-blur">
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(62,129,190,.22),transparent_62%)] blur-2xl" />
      <div className="pointer-events-none absolute -left-24 -bottom-24 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(131,199,177,.22),transparent_62%)] blur-2xl" />
      <div className="pointer-events-none absolute left-[22%] top-[-70px] h-[220px] w-[220px] rotate-12 rounded-[44px] bg-[linear-gradient(135deg,rgba(131,199,177,.18),rgba(255,255,255,.06))] blur-xl" />

      <div className="flex flex-col gap-2">
        <div className="text-[11px] font-semibold tracking-widest text-white/60">
          ALGORITHME DE POINTE
        </div>
        <div className="text-2xl font-extrabold text-white">
          Moins de swipe, plus de séances.
        </div>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-white/75">
          Nos ingénieurs ont élaboré un algorithme qui te permet de rencontrer les
          meilleurs profils — en tenant compte de ton sport, ton niveau, tes
          objectifs, et de vos centres d’intérêts communs.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-white/12 bg-white/7 p-4">
            <div className="text-xs text-white/55">Swipes inutiles</div>
            <div className="mt-1 text-lg font-extrabold text-white">↘ x3</div>
          </div>
          <div className="rounded-2xl border border-white/12 bg-white/7 p-4">
            <div className="text-xs text-white/55">Temps pour trouver un binôme</div>
            <div className="mt-1 text-lg font-extrabold text-white">↘ 3 jours</div>
          </div>
          <div className="rounded-2xl border border-white/12 bg-white/7 p-4">
            <div className="text-xs text-white/55">Taux de réponse</div>
            <div className="mt-1 text-lg font-extrabold text-white">↗ 64%</div>
          </div>
          <div className="rounded-2xl border border-white/12 bg-white/7 p-4">
            <div className="text-xs text-white/55">Séances planifiées</div>
            <div className="mt-1 text-lg font-extrabold text-white">↗ +38%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Reviews Marquee ----------------------------- */
function ReviewPill({
  name,
  meta,
  quote,
}: {
  name: string;
  meta: string;
  quote: string;
}) {
  return (
    <div
      className={[
        "mx-2 inline-flex w-[340px] shrink-0 flex-col justify-between rounded-3xl border border-black/10 p-6 backdrop-blur",
        "shadow-[0_18px_60px_rgba(0,0,0,.12)]",
        "bg-white/80",
      ].join(" ")}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-[#071218]">{name}</div>
            <div className="mt-1 text-xs text-black/55">{meta}</div>
          </div>
          <div className="text-xs text-black/40">Avis</div>
        </div>
        <div className="mt-4 text-sm leading-relaxed text-black/70">“{quote}”</div>
      </div>
      <div className="mt-4 text-xs text-black/45">↗</div>
    </div>
  );
}

function ReviewsMarquee() {
  const items = useMemo(
    () => [
      {
        name: "Camille",
        meta: "Running • Paris",
        quote:
          "J’ai trouvé une partenaire en 48h. On s’entraîne 2x/semaine, c’est devenu naturel.",
      },
      {
        name: "Mehdi",
        meta: "HYROX • Lyon",
        quote:
          "Enfin une app où je ne swipe pas au hasard. Les profils proposés sont cohérents.",
      },
      {
        name: "Sarah",
        meta: "Cross-training • Bordeaux",
        quote:
          "Les événements m’ont remise dans le rythme. Et la vibe est vraiment saine.",
      },
      {
        name: "Thomas",
        meta: "Cycling • Lille",
        quote:
          "Même niveau + intérêts communs : on roule ensemble le week-end, hyper simple.",
      },
      {
        name: "Inès",
        meta: "Running • Toulouse",
        quote:
          "Objectifs + centres d’intérêts : ça filtre direct. Moins de blabla, plus de séances.",
      },
    ],
    []
  );

  const loop = [...items, ...items];

  return (
    <div className="mt-8">
      {/* ✅ bandeau BLANC (comme tu veux) + dynamique avec formes */}
      <div className="relative overflow-hidden rounded-[34px] border border-black/10 bg-white/70 p-4 shadow-[0_26px_90px_rgba(0,0,0,.12)] backdrop-blur">
        {/* formes colorées tempo */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(131,199,177,.40),transparent_62%)] blur-3xl" />
        <div className="pointer-events-none absolute -right-28 -bottom-28 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(62,129,190,.38),transparent_62%)] blur-3xl" />
        <div className="pointer-events-none absolute left-[35%] top-[-70px] h-[240px] w-[240px] rotate-12 rounded-[52px] bg-[linear-gradient(135deg,rgba(62,129,190,.18),rgba(131,199,177,.18))] blur-2xl" />

        {/* zone interne */}
        <div className="relative overflow-hidden rounded-[26px] border border-black/10 bg-white/55">
          {/* fades latéraux (blanc) */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-28 bg-[linear-gradient(to_right,rgba(255,255,255,.95),transparent)]" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-28 bg-[linear-gradient(to_left,rgba(255,255,255,.95),transparent)]" />

          <div
            className={[
              "flex w-max items-stretch py-5",
              "[animation-duration:38s] [animation-timing-function:linear] [animation-iteration-count:infinite]",
              "hover:[animation-play-state:paused]",
            ].join(" ")}
            style={{ animationName: "tempo-marquee" }}
          >
            {loop.map((it, idx) => (
              <ReviewPill key={`${it.name}-${idx}`} {...it} />
            ))}
          </div>
        </div>

        <style jsx global>{`
          @keyframes tempo-marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </div>
    </div>
  );
}

/* ------------------------------ Snap Scrolling ------------------------------ */
function useSnapScroll(sectionIds: string[], headerH: number) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const lockRef = useRef(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const getCurrentIndex = () => {
      const y = scroller.scrollTop;
      const h = scroller.clientHeight;
      const idx = Math.round(y / h);
      return Math.max(0, Math.min(sectionIds.length - 1, idx));
    };

    const scrollToIndex = (idx: number) => {
      const clamped = Math.max(0, Math.min(sectionIds.length - 1, idx));
      const targetId = sectionIds[clamped];
      const el = document.getElementById(targetId);
      if (!el) return;

      // ✅ IMPORTANT: pour éviter que le sticky header masque le début de section
      const top = el.offsetTop - headerH;

      scroller.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    };

    const onWheel = (e: WheelEvent) => {
      if (lockRef.current) return;
      if (Math.abs(e.deltaY) < 12) return;

      e.preventDefault();
      lockRef.current = true;

      const dir = e.deltaY > 0 ? 1 : -1;
      const idx = getCurrentIndex();
      scrollToIndex(idx + dir);

      window.setTimeout(() => {
        lockRef.current = false;
      }, 650);
    };

    scroller.addEventListener("wheel", onWheel, { passive: false });
    return () => scroller.removeEventListener("wheel", onWheel as any);
  }, [sectionIds, headerH]);

  return scrollerRef;
}

/* ---------------------------------- Page ---------------------------------- */
export default function Home() {
  const APP_STORE_URL = "#";
  const PLAY_STORE_URL = "#";

  const INSTAGRAM_TEMPO_URL = "https://instagram.com/tempo";
  const INSTAGRAM_BEN_URL = "https://instagram.com/ben.ontrack";
  const CONTACT_EMAIL = "contact@tempo.app";

  const HEADER_H = 72;

  const sections = ["top", "ideas", "reviews", "team", "footer"];
  const scrollerRef = useSnapScroll(sections, HEADER_H);

  // ✅ helper: scroll interne (dans le scroller), avec offset header
  const scrollToId = (id: string) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const el = document.getElementById(id);
    if (!el) return;

    const top = el.offsetTop - HEADER_H;
    scroller.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  return (
    <div
      ref={scrollerRef}
      className={[
        "snap-root",
        "h-[100svh] overflow-y-auto overflow-x-hidden",
        "scroll-smooth snap-y snap-mandatory",
        "text-white",
      ].join(" ")}
    >
      {/* Header sticky */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-tempo-ink/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          {/* ✅ on évite le hash #top (qui joue avec l'URL et peut créer des comportements bizarres dans un scroller interne) */}
          <button
            type="button"
            onClick={() => scrollToId("top")}
            className="flex items-center gap-3"
          >
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
          </button>

          <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            <button
              type="button"
              onClick={() => scrollToId("team")}
              className="hover:text-white"
            >
              L’équipe
            </button>
            <button
              type="button"
              onClick={() => scrollToId("footer")}
              className="hover:text-white"
            >
              Contact
            </button>
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

            {/* ✅ FIX bug: on n'utilise plus href="#download" -> on scroll en interne avec offset header */}
            <button
              type="button"
              onClick={() => scrollToId("download")}
              className="rounded-xl border border-white/10 bg-white/8 px-3 py-2 text-xs font-extrabold text-white shadow-[0_16px_45px_rgba(0,0,0,.20)] backdrop-blur transition hover:bg-white/12"
            >
              Télécharger ↗
            </button>
          </div>
        </div>
      </header>

      {/* -------------------------------- HERO (dark) ------------------------------- */}
      <SnapSection id="top" variant="dark">
        <div
          className="mx-auto flex max-w-6xl items-center px-5 pb-10"
          style={{ paddingTop: HEADER_H }}
        >
          <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
            <div>
              <Reveal>
                <h1 className="text-4xl font-extrabold leading-[1.03] md:text-5xl">
                  <span className="block">Trouve des partenaires</span>

                  <span className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-2">
                    <span className="leading-none">qui matchent</span>
                    <span className="leading-none text-white/90">ton</span>

                    <span className="relative inline-flex items-center leading-none">
                      <Image
                        src="/logo_tempo.svg"
                        alt="TEMPO"
                        width={140}
                        height={30}
                        className="h-[1em] w-auto opacity-95"
                        priority
                      />
                    </span>

                    <span className="leading-none text-white/80">.</span>
                  </span>
                </h1>
              </Reveal>

              <Reveal delayMs={130}>
                <p className="mt-7 max-w-xl text-base leading-relaxed text-white/78">
                  TEMPO te connecte aux{" "}
                  <span className="font-semibold text-white">bons partenaires</span>{" "}
                  en fonction de ton{" "}
                  <span className="font-semibold text-white">sport</span>,{" "}
                  <span className="font-semibold text-white">niveau</span>,{" "}
                  <span className="font-semibold text-white">objectifs</span>,{" "}
                  <span className="font-semibold text-white">
                    centres d’intérêts
                  </span>{" "}
                  et <span className="font-semibold text-white">vibe</span>.
                </p>
              </Reveal>

              <Reveal delayMs={220}>
                {/* ✅ FIX: scroll-margin-top pour tous les navigateurs + fallback */}
                <div
                  id="download"
                  className="mt-8 grid scroll-mt-[84px] grid-cols-1 gap-3 sm:grid-cols-2"
                >
                  <DownloadButton href={APP_STORE_URL} store="appstore" />
                  <DownloadButton href={PLAY_STORE_URL} store="play" />
                </div>
              </Reveal>

              <Reveal delayMs={300}>
                <div className="mt-7 rounded-3xl border border-white/10 bg-white/6 p-5 shadow-[0_18px_60px_rgba(0,0,0,.18)] backdrop-blur">
                  <div className="text-sm font-extrabold text-white">
                    Moins de swipe. Plus d’entraînement.
                  </div>
                  <div className="mt-2 text-sm text-white/70">
                    Nos ingénieurs ont élaboré un algorithme qui te permet de rencontrer
                    les meilleurs profils.
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal className="md:justify-self-end" delayMs={160}>
              <div className="relative">
                <div className="absolute -inset-8 rounded-[34px] bg-[linear-gradient(135deg,rgba(131,199,177,.18),rgba(62,129,190,.14))] blur-2xl" />
                <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/5 shadow-[0_22px_80px_rgba(0,0,0,.28)]">
                  <Image
                    src="/écran1.png"
                    alt="Aperçu TEMPO"
                    width={1400}
                    height={1000}
                    className="h-auto w-full object-cover"
                    priority
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </SnapSection>

      {/* -------------------------------- IDEAS (light) ------------------------------ */}
      <SnapSection id="ideas" variant="light">
        <div className="mx-auto flex min-h-[calc(100svh-72px)] max-w-6xl flex-col justify-center px-5 py-12">
          <Reveal>
            <div className="max-w-3xl">
              <h2 className="text-3xl font-extrabold text-white">
                Une app conçue pour matcher juste.
              </h2>
              <p className="mt-2 text-sm text-white/80">
                Un algorithme de pointe pour te connecter aux bons partenaires — et passer
                rapidement à la séance.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            <Reveal>
              <IdeaCard
                index="01"
                title="Rencontre le bon ou la bonne partenaire sportif."
                desc="Des recommandations précises selon ton sport, ton niveau et tes objectifs — pour éviter le swipe inutile."
              />
            </Reveal>

            <Reveal delayMs={90}>
              <IdeaCard
                index="02"
                title="Centres d’intérêts communs."
                desc="Sports + objectifs + passions : tu connectes avec des profils compatibles, pas juste “dispo”."
              />
            </Reveal>

            <Reveal delayMs={180}>
              <IdeaCard
                index="03"
                title="Communauté & événements."
                desc="Rejoins des sessions près de toi, crée des entraînements, progresse en équipe."
              />
            </Reveal>
          </div>

          <Reveal delayMs={220}>
            <div className="mt-8">
              <TechPanel />
            </div>
          </Reveal>

          <div className="mt-8 text-sm text-white/75">
            <button
              type="button"
              onClick={() => scrollToId("reviews")}
              className="inline-flex items-center gap-2 hover:text-white"
            >
              Découvrir les avis <span className="opacity-80">↗</span>
            </button>
          </div>
        </div>
      </SnapSection>

      {/* -------------------------------- REVIEWS (light) ----------------------------- */}
      <SnapSection id="reviews" variant="light">
        <div className="mx-auto flex min-h-[calc(100svh-72px)] max-w-6xl flex-col justify-center px-5 py-12">
          <Reveal>
            <h2 className="text-3xl font-extrabold text-white">
              Ils ont trouvé leur tempo
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-white/80">
              Des retours simples : des profils cohérents, des discussions utiles, et des
              séances qui se font.
            </p>
          </Reveal>

          <Reveal delayMs={120}>
            <ReviewsMarquee />
          </Reveal>

          <div className="mt-10 text-sm text-white/80">
            <button
              type="button"
              onClick={() => scrollToId("team")}
              className="inline-flex items-center gap-2 hover:text-white"
            >
              Voir l’équipe <span className="opacity-80">↘</span>
            </button>
          </div>
        </div>
      </SnapSection>

      {/* -------------------------------- TEAM (dark) -------------------------------- */}
      <SnapSection id="team" variant="dark">
        <div className="mx-auto flex min-h-[calc(100svh-72px)] max-w-6xl flex-col justify-center px-5 py-12">
          <Reveal>
            <div className="rounded-[36px] border border-white/10 bg-white/6 p-8 shadow-[0_22px_80px_rgba(0,0,0,.22)] backdrop-blur">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
                <div>
                  <h2 className="text-3xl font-extrabold">L’équipe</h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Une app construite par des sportifs pour des sportifs.
                  </p>

                  <div className="mt-6 flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      <Image
                        src="/benjamin.JPEG"
                        alt="Benjamin"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Benjamin</div>
                      <div className="mt-1 text-xs text-white/65">
                        Créateur • passionné de sport
                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/70">
                        <a
                          href={INSTAGRAM_BEN_URL}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-white"
                        >
                          @ben.ontrack ↗
                        </a>
                      </div>
                    </div>
                  </div>

                  <p className="mt-6 text-sm leading-relaxed text-white/75">
                    “Je passais tellement de temps à m’entraîner que je n’avais plus vraiment
                    l’occasion de rencontrer du monde. Je voulais une app qui me fasse gagner
                    du temps, et qui me connecte à des partenaires pertinents — niveau,
                    objectifs, et passions.”
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -inset-6 rounded-[34px] bg-[linear-gradient(135deg,rgba(131,199,177,.18),rgba(62,129,190,.16))] blur-2xl" />
                  <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/5">
                    <div className="p-7">
                      <div className="text-[11px] font-semibold tracking-widest text-white/55">
                        BUILDING TEMPO
                      </div>

                      <div className="mt-3 text-2xl font-extrabold text-white">
                        Un matching qui fonctionne vraiment.
                      </div>

                      <div className="mt-3 text-sm text-white/70">
                        L’objectif : t’aider à trouver rapidement un binôme compatible.
                      </div>

                      <div className="mt-7 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white/12 bg-white/7 p-4">
                          <div className="text-xs text-white/55">
                            Temps pour trouver un binôme
                          </div>
                          <div className="mt-1 text-lg font-extrabold text-white">↘ 3 jours</div>
                        </div>
                        <div className="rounded-2xl border border-white/12 bg-white/7 p-4">
                          <div className="text-xs text-white/55">Swipes inutiles</div>
                          <div className="mt-1 text-lg font-extrabold text-white">↘ x3</div>
                        </div>
                        <div className="rounded-2xl border border-white/12 bg-white/7 p-4">
                          <div className="text-xs text-white/55">Taux de réponse en DM</div>
                          <div className="mt-1 text-lg font-extrabold text-white">↗ 64%</div>
                        </div>
                        <div className="rounded-2xl border border-white/12 bg-white/7 p-4">
                          <div className="text-xs text-white/55">Séances créées / semaine</div>
                          <div className="mt-1 text-lg font-extrabold text-white">↗ +38%</div>
                        </div>
                      </div>

                      <div className="mt-6 text-xs text-white/55" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </SnapSection>

      {/* -------------------------------- FOOTER (dark) ------------------------------ */}
      <SnapSection id="footer" variant="dark">
        <footer className="mx-auto flex min-h-[calc(100svh-72px)] max-w-6xl flex-col justify-center px-5 py-12">
          <Reveal>
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              <div>
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

                <div className="mt-6 text-sm text-white/70">
                  Contact :{" "}
                  <a
                    className="font-semibold text-white hover:underline"
                    href={`mailto:${CONTACT_EMAIL}`}
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>

                <div className="mt-3 text-sm text-white/70">
                  Instagram :{" "}
                  <a
                    className="font-semibold text-white hover:underline"
                    href={INSTAGRAM_TEMPO_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    @tempo ↗
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => scrollToId("top")}
                  className="text-left text-white/70 hover:text-white"
                >
                  Accueil ↗
                </button>
                <button
                  type="button"
                  onClick={() => scrollToId("reviews")}
                  className="text-left text-white/70 hover:text-white"
                >
                  Avis ↗
                </button>
                <button
                  type="button"
                  onClick={() => scrollToId("team")}
                  className="text-left text-white/70 hover:text-white"
                >
                  L’équipe ↗
                </button>
                <button
                  type="button"
                  onClick={() => scrollToId("download")}
                  className="text-left text-white/70 hover:text-white"
                >
                  Télécharger ↗
                </button>
              </div>

              <div className="flex flex-col gap-3 text-sm">
                <a className="text-white/70 hover:text-white" href="/cgu">
                  CGU ↗
                </a>
                <a className="text-white/70 hover:text-white" href="/privacy">
                  Politique de confidentialité ↗
                </a>

                <div className="mt-2 text-xs text-white/45">
                  © {new Date().getFullYear()} TEMPO. Tous droits réservés.
                </div>
              </div>
            </div>
          </Reveal>
        </footer>
      </SnapSection>
    </div>
  );
}
