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
  className = "",
}: {
  id?: string;
  variant: "dark" | "light";
  children: React.ReactNode;
  className?: string;
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
        "w-full overflow-hidden",
        variant === "dark" ? dark : light,
        className,
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

/* ------------------------------ Google Rating --------------------------- */
function Stars({ value, outOf = 5 }: { value: number; outOf?: number }) {
  const pct = Math.max(0, Math.min(100, (value / outOf) * 100));
  return (
    <span className="relative inline-block leading-none">
      <span className="text-white/35">{"★★★★★"}</span>
      <span
        className="absolute left-0 top-0 overflow-hidden text-amber-300"
        style={{ width: `${pct}%` }}
        aria-hidden
      >
        {"★★★★★"}
      </span>
    </span>
  );
}

function GoogleRating() {
  return (
    <div
      className={[
        "mt-3 flex items-center justify-between gap-4",
        "rounded-2xl border border-white/12 bg-white/7 px-5 py-4",
        "shadow-[0_18px_60px_rgba(0,0,0,.18)] backdrop-blur",
      ].join(" ")}
    >
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
          Notes Google
        </div>
        <div className="mt-1 flex items-center gap-3">
          <div className="text-sm font-extrabold text-white">4.4</div>
          <div className="text-sm">
            <Stars value={4.4} />
          </div>
        </div>
      </div>

      <div className="shrink-0 rounded-2xl border border-white/12 bg-white/7 px-3 py-2 text-xs font-extrabold text-white/90">
        ★ 4.4
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

    const getTops = () =>
      sectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean)
        .map((el) => (el as HTMLElement).offsetTop);

    let tops = getTops();
    const refresh = () => {
      tops = getTops();
    };

    const getCurrentIndex = () => {
      const y = scroller.scrollTop + scroller.clientHeight * 0.45;
      let idx = 0;
      for (let i = 0; i < tops.length; i++) {
        if (y >= tops[i] - headerH) idx = i;
      }
      return Math.max(0, Math.min(sectionIds.length - 1, idx));
    };

    const scrollToIndex = (idx: number) => {
      const clamped = Math.max(0, Math.min(sectionIds.length - 1, idx));
      const el = document.getElementById(sectionIds[clamped]) as HTMLElement | null;
      if (!el) return;
      const top = el.offsetTop - headerH;
      scroller.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    };

const isInsideRamp = (id: string) => {
  const el = document.getElementById(id) as HTMLElement | null;
  if (!el) return false;

  // zone "scrollable" de la section dans le scroller :
  // de son top aligné (start) jusqu’au moment où le bas de la section arrive en bas du viewport (end)
  const start = el.offsetTop - headerH;
  const end = start + Math.max(1, el.offsetHeight - scroller.clientHeight);

  const y = scroller.scrollTop;

  // petit buffer pour éviter les oscillations au bord
  const BUFFER = 8;
  return y >= start - BUFFER && y <= end + BUFFER;
};


    const onWheel = (e: WheelEvent) => {
      // ✅ pendant les rampes: laissez le scroll natif
      if (
        isInsideRamp("triphero") ||
        isInsideRamp("hero") ||
        isInsideRamp("ideas") ||
        isInsideRamp("hyrox") ||
        isInsideRamp("photo")
      ) {
        return;
      }

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

    const onResize = () => refresh();

    scroller.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize);

    const t = window.setTimeout(refresh, 250);

    return () => {
      window.clearTimeout(t);
      scroller.removeEventListener("wheel", onWheel as any);
      window.removeEventListener("resize", onResize);
    };
  }, [sectionIds, headerH]);

  return scrollerRef;
}

/* ------------------------------ helpers ----------------------------- */
function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function easeOutCubic(t: number) {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3);
}

function rampProgressFor(
  scroller: HTMLDivElement | null,
  el: HTMLElement | null,
  scrollTop: number,
  headerH: number
) {
  if (!scroller || !el) return { progress: 0, h: 1 };
  const start = el.offsetTop - headerH;
  const h = scroller.clientHeight;
  const progress = clamp01((scrollTop - start) / Math.max(1, h));
  return { progress, h };
}

/* ---------------------------------- Page ---------------------------------- */
export default function Home() {
  const APP_STORE_URL = "#";
  const PLAY_STORE_URL = "#";

  const INSTAGRAM_TEMPO_URL = "https://www.instagram.com/jointhetempo.app/";
  const INSTAGRAM_BEN_URL = "https://instagram.com/ben.ontrack";
  const CONTACT_EMAIL = "contact@jointhetempo.app";

  const HEADER_H = 72;

  const sections = ["triphero", "hero", "ideas", "hyrox", "photo", "footer"];
  const scrollerRef = useSnapScroll(sections, HEADER_H);
const getEl = (id: string) => {
  if (typeof window === "undefined") return null; // ✅ build/SSR
  return document.getElementById(id) as HTMLElement | null;
};

  const scrollToId = (id: string) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const el = document.getElementById(id) as HTMLElement | null;
    if (!el) return;
    const top = el.offsetTop - HEADER_H;
    scroller.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  // images
  const HERO = "/appli1.png";
  const APP2 = "/appli2.png";
  const PHOTO1 = "/sports/course1.jpg";
  const HYROX_IMG = "/sports/hyrox1.jpg";
  const S_COURSE2 = "/sports/course2.jpg";

  // Triptyque
  const TRIP_1 = "/Triptique 1.png";
  const TRIP_2 = "/Triptique 2.png";
  const TRIP_3 = "/Triptique 3.png";

  // scroll tracking
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        setScrollTop(scroller.scrollTop);
      });
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    setScrollTop(scroller.scrollTop);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      scroller.removeEventListener("scroll", onScroll as any);
    };
  }, [scrollerRef]);

  // ✅ Trip HERO ramp (tout en haut)
  // FIX CRITIQUE: pour le 1er écran, on NE soustrait PAS le header (sinon progress>0 au top)
  const tripHeroRamp = useMemo(() => {
    const scroller = scrollerRef.current;
    const el = getEl("triphero");
    return rampProgressFor(scroller, el, scrollTop, 0);
  }, [scrollTop, scrollerRef]);

  const tripHeroP = tripHeroRamp.progress;
  const t = easeOutCubic(tripHeroP);

  // déstructuration progressive (t=0 aligné, t=1 explose)
  const t1X = t * -90;
  const t1Y = t * -160;
  const t1R = t * -7.5;
  const t1Z = t * 80;

  const t2X = t * 40;
  const t2Y = t * 260;
  const t2R = t * 6.5;
  const t2Z = t * 140;

  const t3X = t * 110;
  const t3Y = t * -360;
  const t3R = t * -6.0;
  const t3Z = t * 60;

  const tripShadow = 0.12 + t * 0.22;
  const tripRadius = 0;

  // ✅ HERO ramp
  const heroRamp = useMemo(() => {
    const scroller = scrollerRef.current;
    const el = getEl("hero");
    return rampProgressFor(scroller, el, scrollTop, HEADER_H);
  }, [scrollTop, scrollerRef]);

const heroP = heroRamp.progress;
const heroT = easeOutCubic(heroP); // ✅ courbe plus “ciné”

// 🔥 Effet plus marqué
const heroScale = 1.20 - heroT * 0.26;     // 1.20 → 0.94
const heroRotateX = 18 - heroT * 18;       // 18° → 0°
const heroRotateY = -26 + heroT * 26;      // -26° → 0°
const heroTranslateY = heroT * 62;         // 0 → 62px
const heroTranslateX = heroT * -78;        // 0 → -78px
const heroRadius = 72 - heroT * 46;        // 72 → 26

// Ombres (plus profond au début)
const heroShadow = 0.58 - heroT * 0.28;    // 0.58 → 0.30

// Reflet “specular” fin (pas un halo)
const heroSpecOpacity = 0.28 - heroT * 0.18; // 0.28 → 0.10
const heroSpecX = (1 - heroT) * -120;        // slide gauche→droite


  // ✅ APPLI2 ramp
  const appRamp = useMemo(() => {
    const scroller = scrollerRef.current;
    const el = getEl("ideas");
    return rampProgressFor(scroller, el, scrollTop, HEADER_H);
  }, [scrollTop, scrollerRef]);

  const appP = appRamp.progress;
  const appScale = 1 - appP * 0.18;
  const appRadius = appP * 34;
  const appShadowOpacity = appP * 0.35;

  // ✅ HYROX ramp
  const hyroxRamp = useMemo(() => {
    const scroller = scrollerRef.current;
    const el = getEl("hyrox");
    return rampProgressFor(scroller, el, scrollTop, HEADER_H);
  }, [scrollTop, scrollerRef]);

  const hyroxP = hyroxRamp.progress;
  const hyroxScale = 1 - hyroxP * 0.18;
  const hyroxRadius = hyroxP * 34;
  const hyroxShadowOpacity = hyroxP * 0.35;

  // ✅ PHOTO ramp
  const photoRamp = useMemo(() => {
    const scroller = scrollerRef.current;
    const el = getEl("photo");
    return rampProgressFor(scroller, el, scrollTop, HEADER_H);
  }, [scrollTop, scrollerRef]);

  const photoP = photoRamp.progress;
  const photoScale = 1 - photoP * 0.18;
  const photoRadius = photoP * 34;
  const photoShadowOpacity = photoP * 0.35;

  // Snap CSS OFF pendant les rampes
  const disableSnapCss =
    tripHeroP < 1 || heroP < 1 || appP < 1 || hyroxP < 1 || photoP < 1;
  const snapClasses = disableSnapCss ? "" : "snap-y snap-mandatory";

  return (
    <div
      ref={scrollerRef}
      className={[
        "snap-root",
        "h-[100svh] overflow-y-auto overflow-x-hidden",
        "scroll-smooth",
        snapClasses,
        "text-white",
      ].join(" ")}
    >
      {/* Header sticky */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-tempo-ink/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <button
            type="button"
            onClick={() => scrollToId("triphero")}
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
              onClick={() => scrollToId("hero")}
              className="hover:text-white"
            >
              L’app
            </button>
            <button
              type="button"
              onClick={() => scrollToId("ideas")}
              className="hover:text-white"
            >
              Communauté
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
              @jointhetempo.app ↗
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

      {/* -------------------------------- TRIPTYQUE HERO (TOP) ------------------------------ */}
      <SnapSection
        id="triphero"
        variant="dark"
        className={[
          // ✅ plus de "page vide" : rampe = 1 écran (sticky) + 1 écran (spacer)
          "min-h-[200svh]",
          // ✅ fond plus foncé, calé sur le bas du triptyque (plus de bleu)
          "bg-[linear-gradient(135deg,rgba(7,18,24,1),rgba(6,28,36,1),rgba(7,18,24,1))]",
        ].join(" ")}
      >
        <div className="sticky z-20" style={{ top: 0, height: "100svh" }}>
          <div className="relative h-full w-full">
            <div
              className="relative h-full w-full overflow-hidden"
              style={{
                borderRadius: `${tripRadius}px`,
                boxShadow: `0 40px 140px rgba(0,0,0,${tripShadow})`,
              }}
            >
              <div
                className="absolute inset-0"
                style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 flex gap-0">
                  {/* 1 */}
                  <div className="relative h-full w-1/3 overflow-hidden">
                    <div
                      className="absolute inset-0"
                      style={{
                        transform: `translate3d(${t1X}px, ${t1Y}px, ${t1Z}px) rotate(${t1R}deg)`,
                        willChange: "transform",
                      }}
                    >
                      <Image
                        src={TRIP_1}
                        alt="Triptique 1"
                        fill
                        priority
                        unoptimized
                        style={{ objectFit: "contain", objectPosition: "top center" }}
                      />
                    </div>
                  </div>

                  {/* 2 */}
                  <div className="relative h-full w-1/3 overflow-hidden">
                    <div
                      className="absolute inset-0"
                      style={{
                        transform: `translate3d(${t2X}px, ${t2Y}px, ${t2Z}px) rotate(${t2R}deg)`,
                        willChange: "transform",
                      }}
                    >
                      <Image
                        src={TRIP_2}
                        alt="Triptique 2"
                        fill
                        priority
                        unoptimized
                        style={{ objectFit: "contain", objectPosition: "top center" }}
                      />
                    </div>
                  </div>

                  {/* 3 */}
                  <div className="relative h-full w-1/3 overflow-hidden">
                    <div
                      className="absolute inset-0"
                      style={{
                        transform: `translate3d(${t3X}px, ${t3Y}px, ${t3Z}px) rotate(${t3R}deg)`,
                        willChange: "transform",
                      }}
                    >
                      <Image
                        src={TRIP_3}
                        alt="Triptique 3"
                        fill
                        priority
                        unoptimized
                        style={{ objectFit: "contain", objectPosition: "top center" }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    opacity: 0.10 + t * 0.22,
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0) 33.2%, rgba(255,255,255,.18) 33.35%, rgba(255,255,255,0) 33.5%, rgba(255,255,255,0) 66.5%, rgba(255,255,255,.18) 66.65%, rgba(255,255,255,0) 66.8%)",
                    mixBlendMode: "overlay",
                  }}
                />

                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,24,.12),rgba(7,18,24,.02),rgba(7,18,24,.55))]" />
              </div>

              {/* ✅ CTA + Notes collés au triptyque (overlay bas) */}
<div className="absolute inset-x-0 bottom-12 sm:bottom-34">
                {/* petit dégradé pour lisibilité */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,rgba(7,18,24,0),rgba(7,18,24,.75))]" />
                <div className="relative px-5 pb-6">
                  <div className="mx-auto max-w-6xl">
                    <div
                      id="download"
                      className="grid scroll-mt-[84px] grid-cols-1 gap-3 sm:grid-cols-2"
                    >
                      <DownloadButton href={APP_STORE_URL} store="appstore" />
                      <DownloadButton href={PLAY_STORE_URL} store="play" />
                    </div>

                    <GoogleRating />
                  </div>
                </div>
              </div>

              <div className="absolute left-5 top-5 rounded-2xl border border-white/14 bg-white/10 px-3 py-2 text-xs font-extrabold text-white/90 backdrop-blur">
                Trouve ton prochain partenaire d'entrainement
              </div>
            </div>
          </div>
        </div>

        {/* ✅ spacer = 1 écran pile -> plus de “page vide” */}
        <div className="h-[100svh]" />
      </SnapSection>

      {/* -------------------------------- HERO (texte + appli1) ------------------------------- */}
      <SnapSection id="hero" variant="dark" className="min-h-[120svh]">
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
            </div>

            <Reveal className="md:justify-self-end" delayMs={160}>
              <div className="relative">
<div
  className="relative overflow-hidden"
  style={{
    borderRadius: `${heroRadius}px`,
    transform: `perspective(950px) rotateX(${heroRotateX}deg) rotateY(${heroRotateY}deg) translateX(${heroTranslateX}px) translateY(${heroTranslateY}px) scale(${heroScale})`,
    transformOrigin: "55% 35%",
    willChange: "transform, border-radius",
    // ✅ IMPORTANT : rien d’autre
  }}
>
  <Image
    src={HERO}
    alt="Aperçu TEMPO"
    width={1400}
    height={1000}
    className="block h-auto w-full object-cover"
    priority
    unoptimized
  />
</div>


              </div>
            </Reveal>
          </div>
        </div>
      </SnapSection>

      {/* -------------------------------- APPLI2 (light) — DÉZOOM ------------------------------ */}
      <SnapSection id="ideas" variant="light" className="min-h-[200svh]">
        <div
          className="sticky z-20"
          style={{ top: HEADER_H, height: `calc(100svh - ${HEADER_H}px)` }}
        >
          <div className="relative h-full w-full">
            <div
              className="relative h-full w-full overflow-hidden"
              style={{
                borderRadius: `${appRadius}px`,
                transform: `scale(${appScale})`,
                transformOrigin: "50% 30%",
                boxShadow: `0 30px 120px rgba(0,0,0,${appShadowOpacity})`,
                willChange: "transform, border-radius, box-shadow",
              }}
            >
              <Image
                src={APP2}
                alt="Aperçu app"
                fill
                className="object-cover"
                priority
                unoptimized
              />

              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,24,.25),rgba(7,18,24,.04),rgba(7,18,24,.45))]" />

              <div className="absolute left-5 top-5 rounded-2xl border border-white/14 bg-white/10 px-3 py-2 text-xs font-extrabold text-white/90 backdrop-blur">
                Communauté sportive engagée
              </div>

              <div className="absolute bottom-6 left-5 right-5">
                <div className="max-w-xl">
                  <div className="mt-2 text-[26px] font-extrabold leading-tight text-white md:text-[34px]">
                    Des événements sportifs près de chez toi
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-white/78">
                    Trouve et rejoins des entraînements adaptés à ton niveau et à ton rythme 
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[120svh]" />
      </SnapSection>

      {/* -------------------------------- HYROX (light) — DÉZOOM ------------------------------ */}
      <SnapSection id="hyrox" variant="light" className="min-h-[200svh]">
        <div
          className="sticky z-20"
          style={{ top: HEADER_H, height: `calc(100svh - ${HEADER_H}px)` }}
        >
          <div className="relative h-full w-full">
            <div
              className="relative h-full w-full overflow-hidden"
              style={{
                borderRadius: `${hyroxRadius}px`,
                transform: `scale(${hyroxScale})`,
                transformOrigin: "50% 30%",
                boxShadow: `0 30px 120px rgba(0,0,0,${hyroxShadowOpacity})`,
                willChange: "transform, border-radius, box-shadow",
              }}
            >
              <Image
                src={HYROX_IMG}
                alt="HYROX"
                fill
                className="object-cover"
                priority
                unoptimized
              />

              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,24,.22),rgba(7,18,24,.06),rgba(7,18,24,.55))]" />

              <div className="absolute left-5 top-5 rounded-2xl border border-white/14 bg-white/10 px-3 py-2 text-xs font-extrabold text-white/90 backdrop-blur">
                Une plateforme multisports
              </div>

              <div className="absolute bottom-6 left-5 right-5">
                <div className="max-w-xl">
                  <div className="mt-2 text-[26px] font-extrabold leading-tight text-white md:text-[34px]">
                    Course, vélo, danse, basket, etc.
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-white/78">
                    Quelque soit ton sport, Tempo est là.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[120svh]" />
      </SnapSection>

      {/* -------------------------------- FEED (light) — DÉZOOM + ENCADRÉ BENJAMIN ------------------------------ */}
      <SnapSection id="photo" variant="light" className="min-h-[200svh]">
        <div
          className="sticky z-20"
          style={{ top: HEADER_H, height: `calc(100svh - ${HEADER_H}px)` }}
        >
          <div className="relative h-full w-full">
            <div
              className="relative h-full w-full overflow-hidden"
              style={{
                borderRadius: `${photoRadius}px`,
                transform: `scale(${photoScale})`,
                transformOrigin: "50% 30%",
                boxShadow: `0 30px 120px rgba(0,0,0,${photoShadowOpacity})`,
                willChange: "transform, border-radius, box-shadow",
              }}
            >
              <Image
                src={PHOTO1}
                alt="Course"
                fill
                className="object-cover"
                priority
                unoptimized
              />

              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,24,.18),rgba(7,18,24,.06),rgba(7,18,24,.58))]" />

              <div className="absolute left-5 top-5 rounded-2xl border border-white/14 bg-white/10 px-3 py-2 text-xs font-extrabold text-white/90 backdrop-blur">
                Centres d'intérêt partagés
              </div>

              <div className="absolute bottom-6 left-5 right-5">
                <div className="max-w-2xl">
                  <div className="mt-2 text-[26px] font-extrabold leading-tight text-white md:text-[34px]">
                    Le partenaire qui TE ressemble.
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-white/78">
                    Faire du sport à deux, c'est bien. <br /> Faire du sport avec quelqu'un avec qui tu as des centres d'intérêts commun, c'est mieux.
                  </p>

                  <Reveal delayMs={120}>
                    <div className="mt-5 w-full max-w-xl rounded-[28px] border border-white/14 bg-white/10 p-5 shadow-[0_22px_80px_rgba(0,0,0,.22)] backdrop-blur">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-white/12 bg-white/10">
                          <Image
                            src="/benjamin.JPEG"
                            alt="Benjamin"
                            fill
                            className="object-cover"
                            priority
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <div className="text-sm font-extrabold text-white">
                              Benjamin
                            </div>
                            <span className="text-xs text-white/55">•</span>
                            <div className="text-xs font-semibold text-white/70">
                              Créateur • passionné de sport
                            </div>
                          </div>

                          <div className="mt-1">
                            <a
                              href={INSTAGRAM_BEN_URL}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold text-white/75 hover:text-white"
                            >
                              @ben.ontrack ↗
                            </a>
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-relaxed text-white/78">
                        “Je passais énormément de temps à m’entraîner et je croisais rarement des
                        personnes avec le même rythme. Tempo est né de cette idée : un matching
                        pertinent qui me permet de rencontrer des personnes autant passionnées de sport que moi et qui partagent les mêmes valeurs.”
                      </p>
                    </div>
                  </Reveal>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => scrollToId("footer")}
                      className="rounded-2xl border border-white/14 bg-white/10 px-4 py-2 text-xs font-extrabold text-white/85 backdrop-blur transition hover:bg-white/14"
                    >
                      Contact ↘
                    </button>
                    <a
                      href={INSTAGRAM_TEMPO_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-white/70 hover:text-white"
                    >
                      Voir le compte Tempo ↗
                    </a>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 opacity-[0.22] bg-[radial-gradient(900px_420px_at_50%_10%,rgba(255,255,255,.16),transparent_55%)]" />
            </div>
          </div>
        </div>

        <div className="h-[120svh]" />
      </SnapSection>

      {/* -------------------------------- FOOTER (dark) ------------------------------ */}
      <SnapSection id="footer" variant="dark" className="min-h-[100svh]">
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
                    @jointhetempo.app ↗
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => scrollToId("triphero")}
                  className="text-left text-white/70 hover:text-white"
                >
                  Accueil ↗
                </button>
                <button
                  type="button"
                  onClick={() => scrollToId("ideas")}
                  className="text-left text-white/70 hover:text-white"
                >
                  Communauté ↗
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
