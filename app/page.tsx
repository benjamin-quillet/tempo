"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

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

/* ------------------------------ NEW: Sport Photo ---------------------------- */
function SportPhoto({
  src,
  className = "",
  priority = false,
}: {
  src: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-[30px] border border-white/12 bg-white/6",
        "shadow-[0_28px_110px_rgba(0,0,0,.26)] backdrop-blur",
        className,
      ].join(" ")}
    >
      <Image src={src} alt="" fill className="object-cover" priority={priority} />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,24,0),rgba(7,18,24,.55))]" />
      <div className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(900px_260px_at_25%_0%,rgba(255,255,255,.22),transparent_55%)]" />
    </div>
  );
}

/* ------------------------------ NEW: Chapters ------------------------------- */
function Chapter({
  n,
  title,
  desc,
}: {
  n: "01" | "02" | "03";
  title: string;
  desc: string;
}) {
  return (
    <div className="relative">
      {/* big ghost number */}
      <div className="pointer-events-none absolute -top-6 -left-2 text-[72px] font-black leading-none text-white/10">
        {n}
      </div>

      <div className="relative rounded-[26px] border border-white/12 bg-white/7 p-6 shadow-[0_22px_70px_rgba(0,0,0,.16)] backdrop-blur">
        <div className="flex items-baseline justify-between gap-6">
          <div className="text-[11px] font-semibold tracking-widest text-white/60">
            {n}
          </div>
          <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(255,255,255,.20),rgba(255,255,255,0))]" />
        </div>

        <div className="mt-3 text-[18px] font-extrabold text-white">{title}</div>
        <p className="mt-2 text-sm leading-relaxed text-white/74">{desc}</p>
      </div>
    </div>
  );
}

/* ------------------------------ Algo / Tech panel --------------------------- */
function TechPanel() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-white/7 p-6 shadow-[0_22px_70px_rgba(0,0,0,.14)] backdrop-blur">
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(62,129,190,.22),transparent_62%)] blur-2xl" />
      <div className="pointer-events-none absolute -left-24 -bottom-24 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(131,199,177,.22),transparent_62%)] blur-2xl" />
      <div className="pointer-events-none absolute left-[22%] top-[-70px] h-[220px] w-[220px] rotate-12 rounded-[44px] bg-[linear-gradient(135deg,rgba(131,199,177,.18),rgba(255,255,255,.06))] blur-xl" />

      <div className="flex flex-col gap-2">
        <div className="text-[11px] font-semibold tracking-widest text-white/60">
          MATCHING SPORTIF
        </div>

        <div className="text-[22px] font-extrabold leading-tight text-white">
          Un algorithme pensé pour l’entraînement.
        </div>

        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-white/75">
          Sport, rythme et objectifs : Tempo propose des profils cohérents basés sur un
          algorithme de matching avancé.
        </p>
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

  const GOOGLE_FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSdbD-0gYEpuSPiReYmy4j7BvSonc79vUeElfJwsYlAErfENGQ/viewform?usp=dialog";

  const INSTAGRAM_TEMPO_URL = "https://instagram.com/tempo";
  const INSTAGRAM_BEN_URL = "https://instagram.com/ben.ontrack";
  const CONTACT_EMAIL = "contact@jointhetempo.app";

  const HEADER_H = 72;

  const sections = ["top", "ideas", "team", "footer"];
  const scrollerRef = useSnapScroll(sections, HEADER_H);

  const scrollToId = (id: string) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const el = document.getElementById(id);
    if (!el) return;

    const top = el.offsetTop - HEADER_H;
    scroller.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  const APP2 = "/appli2.png";

  // ✅ tes sports dans /public/sports
  const S_COURSE2 = "/sports/course2.jpg";
  const S_COURSE1 = "/sports/course1.jpg";
  const S_HYROX = "/sports/hyrox1.jpg";
  const S_ESCALADE = "/sports/escalade2.jpg";
  const S_MUSCU = "/sports/muscu1.jpg";
  const S_VELO = "/sports/velo1.jpg";
  const S_TENNIS = "/sports/tennis1.jpg";
  const S_PILATE = "/sports/pilate1.jpg";
  const S_ATHLE = "/sports/athletisme1.jpg";

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
              onClick={() => scrollToId("ideas")}
              className="hover:text-white"
            >
              L’app
            </button>
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
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-90 bg-[radial-gradient(1100px_520px_at_20%_18%,rgba(131,199,177,.22),transparent_60%)]" />
          <div className="absolute inset-0 opacity-90 bg-[radial-gradient(980px_520px_at_70%_35%,rgba(62,129,190,.20),transparent_60%)]" />
        </div>

        <div
          className="mx-auto flex max-w-6xl items-center px-5 pb-10"
          style={{ paddingTop: HEADER_H }}
        >
          <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
            <div className="relative">
              <Reveal>
                <h1 className="text-4xl font-extrabold leading-[1.03] md:text-5xl">
                  <span className="block">Trouve des sportifs</span>

                  <span className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-2">
                    <span className="leading-none">qui suivent</span>
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
                  Tempo repose sur un{" "}
                  <span className="font-semibold text-white">
                    algorithme de matching avancé
                  </span>{" "}
                  conçu pour le sport : il combine ta{" "}
                  <span className="font-semibold text-white">pratique</span>, ton{" "}
                  <span className="font-semibold text-white">rythme</span>, tes{" "}
                  <span className="font-semibold text-white">objectifs</span> et tes{" "}
                  <span className="font-semibold text-white">
                    habitudes d’entraînement
                  </span>{" "}
                  pour proposer des rencontres réellement pertinentes.
                </p>
              </Reveal>

              <Reveal delayMs={220}>
                <div
                  id="download"
                  className="mt-8 grid scroll-mt-[84px] grid-cols-1 gap-3 sm:grid-cols-2"
                >
                  <DownloadButton href={APP_STORE_URL} store="appstore" />
                  <DownloadButton href={PLAY_STORE_URL} store="play" />
                </div>
              </Reveal>

              <Reveal delayMs={265}>
                <a
                  href={GOOGLE_FORM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={[
                    "mt-4 inline-flex w-full items-center justify-between gap-4",
                    "rounded-2xl border border-white/12 bg-white/7 px-5 py-4",
                    "shadow-[0_18px_60px_rgba(0,0,0,.18)] backdrop-blur",
                    "transition hover:-translate-y-0.5 hover:bg-white/9 active:translate-y-0",
                    "focus:outline-none focus:ring-2 focus:ring-white/30",
                  ].join(" ")}
                >
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-white/60">
                      Début de Tempo
                    </span>
                    <span className="mt-1 block text-sm font-extrabold text-white">
                      Donne ton avis (1 min) — on construit l’app avec toi
                    </span>
                    <span className="mt-1 block text-sm text-white/70">
                      Aide-nous à comprendre tes attentes.
                    </span>
                  </span>

                  <span className="shrink-0 rounded-2xl border border-white/12 bg-white/7 px-3 py-2 text-sm font-extrabold text-white/90">
                    ↗
                  </span>
                </a>
              </Reveal>
            </div>

            <Reveal className="md:justify-self-end" delayMs={160}>
              <div className="relative">
                <div className="absolute -inset-10 rounded-[44px] bg-[radial-gradient(circle_at_35%_22%,rgba(131,199,177,.22),transparent_62%)] blur-2xl" />
                <div className="absolute -inset-10 rounded-[44px] bg-[radial-gradient(circle_at_75%_65%,rgba(62,129,190,.18),transparent_62%)] blur-2xl" />

                <div className="relative overflow-hidden rounded-[44px] border border-white/12 bg-white/5 shadow-[0_30px_120px_rgba(0,0,0,.42)]">
                  <div className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(180deg,rgba(255,255,255,.10),transparent_45%)]" />
                  <Image
                    src="/appli1.png"
                    alt="Aperçu TEMPO"
                    width={1400}
                    height={1000}
                    className="h-auto w-full object-cover"
                    priority
                    unoptimized
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </SnapSection>

      {/* -------------------------------- IDEAS (light) ------------------------------ */}
      <SnapSection id="ideas" variant="light">
        {/* magazine background: très discret */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.10]">
          <Image src={S_ATHLE} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,18,24,.78),rgba(7,18,24,.40),rgba(7,18,24,.78))]" />
        </div>

        <div className="mx-auto flex min-h-[calc(100svh-72px)] max-w-6xl flex-col px-5 pb-12 pt-16 md:pt-20">
          <Reveal>
            <div className="max-w-3xl">
              <h2 className="text-3xl font-extrabold text-white">
                Une app construite pour la compatibilité sportive.
              </h2>
              <p className="mt-2 text-sm text-white/80">
                Le matching s’appuie sur ta pratique et ton rythme pour proposer des
                rencontres qui ont du sens.
              </p>
            </div>
          </Reveal>

          {/* ✅ NEW LAYOUT : magazine spread */}
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
            {/* LEFT: big photo + stack */}
            <Reveal className="lg:col-span-5">
              <div className="grid h-full grid-cols-2 gap-4">
                <SportPhoto
                  src={APP2}
                  className="col-span-2 min-h-[260px] lg:min-h-[360px]"
                  priority
                />

                <SportPhoto src={S_HYROX} className="min-h-[180px]" />
                <SportPhoto src={S_TENNIS} className="min-h-[180px]" />

                <SportPhoto
                  src={S_VELO}
                  className="col-span-2 min-h-[170px] hidden md:block"
                />
              </div>
            </Reveal>

            {/* RIGHT: chapters (not rail, not rectangles look) */}
            <div className="lg:col-span-7">
              <div className="flex h-full flex-col">
                <Reveal delayMs={80}>
                  <div className="grid grid-cols-1 gap-5">
                    <Chapter
                      n="01"
                      title="Des recommandations vraiment sport."
                      desc="Course, HYROX, cross-training… Tempo comprend ton contexte (niveau, objectifs, habitudes) pour te montrer les bons profils."
                    />
                    <Chapter
                      n="02"
                      title="Ce qui vous rapproche, au-delà du sport."
                      desc="Centres d’intérêt, routines, préférences : de quoi démarrer une discussion naturelle."
                    />
                    <Chapter
                      n="03"
                      title="Communauté & événements."
                      desc="Rejoins des sessions près de toi, crée des entraînements, progresse en équipe."
                    />
                  </div>
                </Reveal>

                <Reveal delayMs={170}>
                  <div className="mt-6">
                    <TechPanel />
                  </div>
                </Reveal>

                <div className="mt-6 text-sm text-white/75">
                  <button
                    type="button"
                    onClick={() => scrollToId("team")}
                    className="inline-flex items-center gap-2 hover:text-white"
                  >
                    Voir l’équipe <span className="opacity-80">↗</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SnapSection>

      {/* -------------------------------- TEAM (dark) -------------------------------- */}
      <SnapSection id="team" variant="dark">
        <div className="mx-auto flex min-h-[calc(100svh-72px)] max-w-6xl flex-col justify-center px-5 py-12">
          <Reveal>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-stretch">
              <div className="md:col-span-5">
                <div className="relative h-[320px] overflow-hidden rounded-[36px] border border-white/10 bg-white/5 shadow-[0_26px_90px_rgba(0,0,0,.32)] md:h-full">
                  <Image src={S_ESCALADE} alt="" fill className="object-cover" />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,24,.10),rgba(7,18,24,.70))]" />
                </div>
              </div>

              <div className="md:col-span-7">
                <div className="rounded-[36px] border border-white/10 bg-white/6 p-8 shadow-[0_22px_80px_rgba(0,0,0,.22)] backdrop-blur">
                  <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
                    <div className="md:col-span-2">
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
                        “Je passais énormément de temps à m’entraîner et je croisais rarement
                        des personnes avec le même rythme. Tempo est né de cette idée : un
                        matching qui comprend réellement ta pratique et ta manière de
                        t’entraîner.”
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative h-[150px] overflow-hidden rounded-[26px] border border-white/10 bg-white/5 shadow-[0_28px_90px_rgba(0,0,0,.30)]">
                          <Image src={S_COURSE1} alt="" fill className="object-cover" />
                          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,24,0),rgba(7,18,24,.55))]" />
                        </div>
                        <div className="relative h-[150px] overflow-hidden rounded-[26px] border border-white/10 bg-white/5 shadow-[0_28px_90px_rgba(0,0,0,.30)]">
                          <Image src={S_MUSCU} alt="" fill className="object-cover" />
                          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,24,0),rgba(7,18,24,.55))]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => scrollToId("footer")}
                    className="text-sm text-white/75 hover:text-white"
                  >
                    Contact <span className="opacity-80">↘</span>
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </SnapSection>

      {/* -------------------------------- FOOTER (dark) ------------------------------ */}
      <SnapSection id="footer" variant="dark">
        {/* ✅ footer background = course2 */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.14]">
          <Image src={S_COURSE2} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,24,.70),rgba(7,18,24,.90))]" />
        </div>

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
