"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* -------------------------------- utilities -------------------------------- */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) {
      setShown(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.16 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "opacity-100 translate-y-0",
        "md:transition-all md:duration-700 md:will-change-transform",
        shown ? "md:opacity-100 md:translate-y-0" : "md:opacity-0 md:translate-y-6",
        className
      )}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

/* ------------------------------- Section Shell ------------------------------ */
function SectionShell({
  id,
  children,
  className = "",
  clipOverflow = false,
  hideBottomGlow = false,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  clipOverflow?: boolean;
  hideBottomGlow?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative isolate w-full border-t border-white/6",
        clipOverflow ? "overflow-hidden" : "overflow-visible",
        "bg-[linear-gradient(135deg,rgba(7,18,24,1),rgba(6,28,36,1),rgba(7,18,24,1))]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.28]">
        <div className="absolute -top-56 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,.12),transparent_60%)] blur-3xl" />
        <div className="absolute top-[18%] -left-[220px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(131,199,177,.22),transparent_60%)] blur-3xl" />
        {!hideBottomGlow && (
          <div className="absolute -bottom-[260px] -right-[260px] h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle_at_center,rgba(62,129,190,.22),transparent_62%)] blur-3xl" />
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Cfilter id=%22n%22 x=%220%22 y=%220%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22300%22 height=%22300%22 filter=%22url(%23n)%22 opacity=%220.35%22/%3E%3C/svg%3E')] mix-blend-overlay" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-5">{children}</div>
    </section>
  );
}

/* ------------------------------ Premium UI bits ----------------------------- */
function TopPill({
  children,
  tone = "mint",
}: {
  children: React.ReactNode;
  tone?: "mint" | "blue";
}) {
  const skin =
    tone === "mint"
      ? "border-[#83C7B1]/25 bg-[#83C7B1]/10 text-[#A9E1D0]"
      : "border-[#3E81BE]/25 bg-[#3E81BE]/10 text-[#A9D2F6]";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em]",
        skin
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------ Rating Stars ----------------------------- */
function Stars({
  value,
  outOf = 5,
  baseClass = "text-white/35",
  fillClass = "text-amber-300",
  className = "",
}: {
  value: number;
  outOf?: number;
  baseClass?: string;
  fillClass?: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / outOf) * 100));
  return (
    <span className={cn("relative inline-block leading-none", className)}>
      <span className={baseClass}>{"★★★★★"}</span>
      <span
        className={cn("absolute left-0 top-0 overflow-hidden", fillClass)}
        style={{ width: `${pct}%` }}
        aria-hidden
      >
        {"★★★★★"}
      </span>
    </span>
  );
}

function formatRatingFR(v: number) {
  return v.toFixed(1).replace(".", ",");
}

/* ------------------------------ Premium Buttons ----------------------------- */
function DownloadButton({
  href,
  store,
  showQr = false,
  qrHref,
  ratingValue,
}: {
  href: string;
  store: "appstore" | "play";
  showQr?: boolean;
  qrHref?: string;
  ratingValue?: number;
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

  const qrSrc = useMemo(() => {
    if (!showQr || !qrHref) return "";
    const size = 240;
    const margin = 16;
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=${margin}&data=${encodeURIComponent(
      qrHref
    )}`;
  }, [showQr, qrHref]);

  const ratingTextClass = isApp ? "text-black/70" : "text-white/90";
  const starsBase = isApp ? "text-black/20" : "text-white/35";
  const starsFill = isApp ? "text-amber-500" : "text-amber-300";

  const storeLogoSrc = isApp ? "/logo_apple.png" : "/logo_google.png";
  const storeLogoAlt = isApp ? "Apple App Store" : "Google Play";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "group relative flex items-center justify-between gap-4 rounded-2xl px-4 py-4 sm:px-5",
        "border backdrop-blur",
        "transition hover:-translate-y-0.5 active:translate-y-0",
        "focus:outline-none focus:ring-2 focus:ring-white/30",
        skin
      )}
    >
      <span className="pointer-events-none absolute inset-[1px] rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,.22),rgba(255,255,255,0))] opacity-45" />

      <span className="relative flex min-w-0 items-center gap-3 sm:gap-4">
        <Image
          src={storeLogoSrc}
          alt={storeLogoAlt}
          width={60}
          height={60}
          className={cn(
            "shrink-0 object-contain",
            isApp
              ? "h-11 w-11 sm:h-14 sm:w-14 md:h-16 md:w-16"
              : "h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12",
            isApp ? "opacity-90" : "opacity-95"
          )}
          priority
        />

        <span className="flex min-w-0 flex-col leading-tight">
          <span
            className={cn(
              "text-[10px] font-semibold uppercase tracking-wider sm:text-[11px]",
              isApp ? "text-black/60" : "text-white/60"
            )}
          >
            Télécharger
          </span>

          <span className="text-sm font-extrabold sm:text-base">
            {isApp ? "App Store" : "Google Play"}
          </span>

          {typeof ratingValue === "number" && (
            <span className="mt-2 flex flex-col gap-1">
              <span className={cn("text-xs font-extrabold", ratingTextClass)}>
                {formatRatingFR(ratingValue)}
              </span>
              <span className="text-xs leading-none">
                <Stars value={ratingValue} baseClass={starsBase} fillClass={starsFill} />
              </span>
            </span>
          )}
        </span>
      </span>

      <span className="relative flex items-center gap-3">
        {showQr && qrSrc ? (
          <span
            className={cn(
              "grid place-items-center rounded-2xl bg-white p-1.5",
              "shadow-[0_16px_40px_rgba(0,0,0,.18)]"
            )}
            aria-hidden
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrSrc}
              alt=""
              width={88}
              height={88}
              className="h-[56px] w-[56px] rounded-xl object-contain sm:h-[72px] sm:w-[72px] md:h-[88px] md:w-[88px]"
              loading="lazy"
            />
          </span>
        ) : null}

        <span className="text-sm font-extrabold opacity-80 transition group-hover:opacity-100">
          ↗
        </span>
      </span>

      <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(900px_240px_at_20%_0%,rgba(255,255,255,.35),transparent_50%)]" />
    </a>
  );
}

/* ------------------------------ Helpers ----------------------------- */
function PhoneFrame({
  src,
  alt,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-2 shadow-[0_24px_80px_rgba(0,0,0,.26)] sm:p-3">
      <div className="overflow-hidden rounded-[22px] border border-white/8 bg-[#0b1820]">
        <Image
          src={src}
          alt={alt}
          width={768}
          height={1365}
          className="block h-auto w-full"
          sizes={sizes}
          priority={priority}
          unoptimized
        />
      </div>
    </div>
  );
}

function InstagramCard({
  href,
  handle,
}: {
  href: string;
  handle: string;
}) {
  return (
    <a
      id="join"
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "group relative block h-full scroll-mt-[96px] overflow-hidden rounded-[30px] border border-white/10",
        "bg-[radial-gradient(700px_280px_at_0%_0%,rgba(244,114,182,.20),transparent_55%),radial-gradient(700px_280px_at_100%_0%,rgba(251,191,36,.18),transparent_55%),linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,.02))]",
        "p-6 shadow-[0_24px_80px_rgba(0,0,0,.26)] backdrop-blur transition hover:-translate-y-0.5 md:p-8"
      )}
    >
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_240px_at_20%_0%,rgba(255,255,255,.18),transparent_50%)] opacity-0 transition group-hover:opacity-100" />

      <div className="relative flex h-full flex-col justify-between gap-8">
        <div>
          <TopPill>Instagram</TopPill>

          <div className="mt-6 flex items-center gap-4">
            <Image
              src="/logo_instagram.png"
              alt="Instagram"
              width={64}
              height={64}
              className="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20"
              unoptimized
            />

            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                Rejoins Tempo
              </div>
              <div className="mt-1 text-xl font-extrabold text-white sm:text-2xl">{handle}</div>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/76 sm:text-[17px]">
            Retrouve les dernières nouveautés de la communauté Tempo sur Instagram.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 text-sm font-extrabold text-white/88">
          Voir le compte
          <span className="transition group-hover:translate-x-0.5">↗</span>
        </div>
      </div>
    </a>
  );
}

function ScreensCarousel({
  images,
}: {
  images: Array<{ src: string; alt: string }>;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  const onTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
    touchEndXRef.current = null;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    touchEndXRef.current = e.touches[0]?.clientX ?? null;
  }, []);

  const onTouchEnd = useCallback(() => {
    const startX = touchStartXRef.current;
    const endX = touchEndXRef.current;
    const threshold = 40;

    if (startX === null || endX === null) return;

    const deltaX = startX - endX;

    if (Math.abs(deltaX) < threshold) return;

    if (deltaX > 0) {
      goNext();
    } else {
      goPrev();
    }
  }, [goNext, goPrev]);

  return (
    <div className="rounded-[30px] border border-white/10 bg-[radial-gradient(900px_300px_at_0%_0%,rgba(62,129,190,.18),transparent_55%),linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,.02))] p-4 shadow-[0_24px_80px_rgba(0,0,0,.26)] backdrop-blur sm:p-5 md:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <TopPill tone="blue">Aperçus</TopPill>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.05] text-white sm:text-4xl md:text-5xl">
              Découvre l’app
            </h2>
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-[28px]"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={image.src} className="min-w-full">
                <div className="mx-auto max-w-[340px] sm:max-w-[380px] md:max-w-[420px]">
                  <PhoneFrame
                    src={image.src}
                    alt={image.alt}
                    sizes="(max-width: 768px) 92vw, 420px"
                    priority={index === 0}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={goPrev}
            aria-label="Image précédente"
            className="absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[rgba(7,18,24,.52)] text-xl font-medium text-white/75 backdrop-blur transition hover:bg-[rgba(7,18,24,.72)] hover:text-white md:inline-flex"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Image suivante"
            className="absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[rgba(7,18,24,.52)] text-xl font-medium text-white/75 backdrop-blur transition hover:bg-[rgba(7,18,24,.72)] hover:text-white md:inline-flex"
          >
            ›
          </button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Aller à l’image ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  activeIndex === index ? "w-7 bg-white" : "w-2 bg-white/28 hover:bg-white/45"
                )}
              />
            ))}
          </div>

          <div className="text-sm font-semibold text-white/55">
            {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- Page ---------------------------------- */
export default function Home() {
  const APP_STORE_URL =
    "https://apps.apple.com/fr/app/tempo-partenaires-sportifs/id6758254738";
  const PLAY_STORE_URL =
    "https://play.google.com/store/apps/details?id=com.cinqyou.tempo&hl=fr";

  const APP_STORE_RATING = 5.0;
  const PLAY_STORE_RATING = 5.0;

  const INSTAGRAM_TEMPO_URL = "https://www.instagram.com/jointhetempo.app/";
  const CONTACT_EMAIL = "contact@jointhetempo.app";

  const HEADER_H = 72;

  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollToId = useCallback(
    (id: string) => {
      const scroller = scrollerRef.current;
      const el = document.getElementById(id);
      if (!scroller || !el) return;

      const scrollerRect = scroller.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const currentScrollTop = scroller.scrollTop;
      const rawTop = currentScrollTop + (elRect.top - scrollerRect.top) - HEADER_H - 12;
      const maxTop = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      const top = Math.min(Math.max(0, rawTop), maxTop);

      scroller.scrollTo({ top, behavior: "smooth" });
    },
    [HEADER_H]
  );

  const STORE_1 = "/Images_store_1.jpeg";
  const STORE_2 = "/Images_store_2.jpeg";
  const STORE_3 = "/Images_store_3.jpeg";
  const STORE_4 = "/Images_store_4.jpeg";
  const STORE_5 = "/Images_store_5.jpeg";
  const BANNER = "/Banniere.png";

  const carouselImages = [
    { src: STORE_1, alt: "Aperçu TEMPO 1" },
    { src: STORE_2, alt: "Aperçu TEMPO 2" },
    { src: STORE_3, alt: "Aperçu TEMPO 3" },
    { src: STORE_4, alt: "Aperçu TEMPO 4" },
    { src: STORE_5, alt: "Aperçu TEMPO 5" },
  ];

  return (
    <div
      ref={scrollerRef}
      className={cn(
        "h-svh overflow-y-auto overflow-x-hidden",
        "scroll-smooth text-white overscroll-y-contain",
        "bg-[linear-gradient(135deg,rgba(7,18,24,1),rgba(6,28,36,1),rgba(7,18,24,1))]"
      )}
      style={{ scrollPaddingTop: HEADER_H + 12 }}
    >
      {/* Header sticky */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[rgba(7,18,24,.72)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-5">
          <button
            type="button"
            onClick={() => scrollToId("home")}
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
              <Image src="/logo_tempo.svg" alt="TEMPO" fill className="object-contain" priority />
            </div>
          </button>

          <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            <button type="button" onClick={() => scrollToId("join")} className="hover:text-white">
              Rejoins Tempo
            </button>
            <button type="button" onClick={() => scrollToId("hero")} className="hover:text-white">
              Découvre l&apos;app
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

      {/* -------------------------------- PAGE 1 : HERO BANNIÈRE ------------------------------ */}
      <SectionShell id="home" className="pt-8 pb-14 sm:pt-10 sm:pb-18 md:pt-12 md:pb-20">
        <div className="grid gap-8">
          <Reveal>
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <TopPill>Application sportive</TopPill>

              <h1 className="mt-5 text-4xl font-extrabold leading-[1.03] sm:text-[2.9rem] md:text-6xl">
                Même passion.
                <br />
                Même tempo.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/74 sm:text-[17px]">
                Trouve des partenaires d’entraînement, rejoins des événements sportifs et organise
                tes prochaines sessions.
              </p>
            </div>
          </Reveal>

          <Reveal delayMs={90}>
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_24px_80px_rgba(0,0,0,.28)]">
              <Image
                src={BANNER}
                alt="Bannière TEMPO"
                width={1825}
                height={768}
                priority
                className="block h-auto w-full"
                sizes="100vw"
                unoptimized
              />
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.05fr_.95fr]">
            <Reveal delayMs={120}>
              <InstagramCard href={INSTAGRAM_TEMPO_URL} handle="@jointhetempo.app" />
            </Reveal>

            <Reveal delayMs={150}>
              <div
                id="download"
                className="scroll-mt-[96px] rounded-[30px] border border-white/10 bg-[radial-gradient(900px_300px_at_0%_0%,rgba(62,129,190,.18),transparent_55%),linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,.02))] p-6 shadow-[0_24px_80px_rgba(0,0,0,.26)] backdrop-blur md:p-8"
              >
                <TopPill tone="blue">Téléchargement</TopPill>

                <h2 className="mt-6 text-3xl font-extrabold leading-[1.05] text-white sm:text-4xl">
                  Disponible sur iPhone et Android
                </h2>

                <p className="mt-5 text-base leading-relaxed text-white/76 sm:text-[17px]">
                  Télécharge Tempo depuis l’App Store ou Google Play.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-3">
                  <DownloadButton
                    href={APP_STORE_URL}
                    store="appstore"
                    showQr
                    qrHref={APP_STORE_URL}
                    ratingValue={APP_STORE_RATING}
                  />
                  <DownloadButton
                    href={PLAY_STORE_URL}
                    store="play"
                    showQr
                    qrHref={PLAY_STORE_URL}
                    ratingValue={PLAY_STORE_RATING}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </SectionShell>

      {/* -------------------------------- PAGE 2 : CARROUSEL ------------------------------- */}
      <SectionShell id="hero" className="py-14 sm:py-16 md:py-20">
        <Reveal>
          <ScreensCarousel images={carouselImages} />
        </Reveal>
      </SectionShell>

      {/* -------------------------------- FOOTER ------------------------------ */}
      <SectionShell
        id="footer"
        className="pt-16 pb-0 sm:pt-20 md:pt-24"
        clipOverflow
        hideBottomGlow
      >
        <footer className="pb-0">
          <div className="border-t border-white/10 pt-8 pb-0">
            <Reveal>
              <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
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
                    <Image src="/logo_tempo.svg" alt="TEMPO" fill className="object-contain" />
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-sm text-white/70">
                  <button
                    type="button"
                    onClick={() => scrollToId("join")}
                    className="text-left hover:text-white"
                  >
                    Rejoins Tempo ↗
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToId("hero")}
                    className="text-left hover:text-white"
                  >
                    Découvre l&apos;app ↗
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToId("footer")}
                    className="text-left hover:text-white"
                  >
                    Contact ↗
                  </button>
                </div>

                <div className="flex flex-col gap-2 text-sm text-white/70">
                  <a className="hover:text-white" href={`mailto:${CONTACT_EMAIL}`}>
                    {CONTACT_EMAIL} ↗
                  </a>
                  <a
                    className="hover:text-white"
                    href={INSTAGRAM_TEMPO_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    @jointhetempo.app ↗
                  </a>
                  <button
                    type="button"
                    onClick={() => scrollToId("download")}
                    className="text-left hover:text-white"
                  >
                    Télécharger ↗
                  </button>
                </div>

                <div className="flex flex-col gap-2 text-sm text-white/70">
                  <a className="hover:text-white" href="/cgu">
                    CGU ↗
                  </a>
                  <a className="hover:text-white" href="/privacy">
                    Politique de confidentialité ↗
                  </a>
                  <div className="mt-2 text-xs text-white/45">
                    © {new Date().getFullYear()} TEMPO. Tous droits réservés.
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </footer>
      </SectionShell>
    </div>
  );
}