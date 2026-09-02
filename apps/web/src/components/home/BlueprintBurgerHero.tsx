"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Flame,
  Activity,
  Award,
  Sparkles,
  Zap,
  Layers,
  Compass,
  CheckCircle2,
} from "lucide-react";

interface BlueprintSpec {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  category: string;
  side: "left" | "right";
  // Target node coordinates on 760x600 SVG canvas (calibrated for burger-flow)
  targetX: number;
  targetY: number;
  // Card anchor coordinates on 760x600 SVG canvas
  cardAnchorX: number;
  cardAnchorY: number;
  // CSS absolute positions for the compact card
  cardStyle: React.CSSProperties;
  // SVG connector path
  pathD: string;
}

const BLUEPRINT_SPECS: BlueprintSpec[] = [
  {
    id: "top-bun",
    code: "SPEC // 01",
    category: "THE CROWN",
    title: "TOASTED BRIOCHE",
    subtitle: "Golden Sesame Crown • Charred Glaze",
    side: "left",
    targetX: 410,
    targetY: 105,
    cardAnchorX: 200,
    cardAnchorY: 50,
    cardStyle: { left: "3%", top: "3%" },
    pathD: "M 200 50 H 290 L 410 105",
  },
  {
    id: "greens",
    code: "SPEC // 02",
    category: "THE CRUNCH",
    title: "CRISP ONIONS & PICKLES",
    subtitle: "Fresh White Rings • Crinkle Dill Pickles",
    side: "right",
    targetX: 510,
    targetY: 175,
    cardAnchorX: 630,
    cardAnchorY: 130,
    cardStyle: { right: "0%", top: "14%" },
    pathD: "M 630 130 H 565 L 510 175",
  },
  {
    id: "cheese",
    code: "SPEC // 03",
    category: "THE MELT",
    title: "VINE TOMATO & CHEDDAR",
    subtitle: "Ruby Red Slices • Molten Cheddar Sheet",
    side: "left",
    targetX: 335,
    targetY: 285,
    cardAnchorX: 195,
    cardAnchorY: 290,
    cardStyle: { left: "2%", top: "42%" },
    pathD: "M 195 290 H 265 L 335 285",
  },
  {
    id: "patty",
    code: "SPEC // 04",
    category: "THE HEART",
    title: "FIRE-SEARED ANGUS",
    subtitle: "450°F Cast-Iron Sear • Coarse Sea Salt",
    side: "right",
    targetX: 495,
    targetY: 375,
    cardAnchorX: 635,
    cardAnchorY: 330,
    cardStyle: { right: "0%", top: "45%" },
    pathD: "M 635 330 H 560 L 495 375",
  },
  {
    id: "heel",
    code: "SPEC // 05",
    category: "THE FOUNDATION",
    title: "GREENS & SAUCED HEEL",
    subtitle: "Crisp Frilled Leaf • Toasted Heel Bun",
    side: "right",
    targetX: 445,
    targetY: 510,
    cardAnchorX: 630,
    cardAnchorY: 520,
    cardStyle: { right: "0%", top: "75%" },
    pathD: "M 630 520 H 530 L 445 510",
  },
];

export default function BlueprintBurgerHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSpec, setActiveSpec] = useState<string | null>(null);

  // 3D Interactive Mouse Gyro Tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    damping: 25,
    stiffness: 100,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    damping: 25,
    stiffness: 100,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setActiveSpec(null);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] flex flex-col justify-center pt-28 pb-16 overflow-hidden bg-brand-dark select-none"
    >
      {/* ========================================================================= */}
      {/* 1. FUTURISTIC ENGINEERING BLUEPRINT BACKGROUND MATRIX */}
      {/* ========================================================================= */}
      {/* Precision Blueprint Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:176px_176px] pointer-events-none" />

      {/* Atmospheric Warm Backlight Spotlight positioned behind the centered burger area */}
      <div className="absolute top-1/2 right-8 sm:right-16 -translate-y-1/2 -mt-12 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] bg-gradient-to-tr from-brand-red/25 via-brand-yellow/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Background Architectural Metadata (Desktop) */}
      <div className="hidden xl:flex absolute top-32 right-12 z-0 flex-col items-end gap-1 font-mono text-[10px] text-white/20 uppercase tracking-widest pointer-events-none">
        <span className="flex items-center gap-1.5 text-brand-yellow/50 font-bold">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>BURGER // SYS-001 [CALIBRATING]</span>
        </span>
        <span>PLATFORM: 450°F CAST-IRON PLATFORM</span>
        <span>ANGUS BEEF • DOUBLE PATTY • BRIOCHE • CHEDDAR</span>
        <span>100% FRESH • NEVER FROZEN</span>
      </div>

      <div className="hidden xl:flex absolute bottom-8 left-12 z-0 flex-col gap-1 font-mono text-[10px] text-white/20 uppercase tracking-widest pointer-events-none">
        <span>SEAR LABS ARCHITECTURE // REV. 2.0</span>
        <span>TOLERANCE: ±0.01mm • LACY CRUST REACTION</span>
      </div>

      {/* Large Outlined Background Watermark "SMASH" */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none opacity-5">
        <span className="font-display font-black text-[18vw] leading-none text-transparent text-stroke-white tracking-tighter uppercase block">
          SMASH
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* ========================================================================= */}
        {/* 2. TOP ANNOUNCEMENT BADGE */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center justify-center lg:justify-start mb-4 sm:mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-brand-dark-surface/90 border border-brand-yellow/30 backdrop-blur-xl shadow-surface-elevated">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-ping" />
            <span className="font-mono text-[10px] sm:text-xs text-brand-yellow font-bold uppercase tracking-widest">
              SYSTEM 001 // 450°F SMASH PLATFORM
            </span>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* 3. MAIN HERO COMPOSITION (LEFT COPY + RIGHT-ALIGNED BURGER BLUEPRINT) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          {/* ======================================================================= */}
          {/* LEFT COLUMN: EDITORIAL BRAND MESSAGE & CTAs */}
          {/* ======================================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left items-center lg:items-start z-20">
            {/* Balanced Editorial Headline */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
            >
              <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] xl:text-[4.2rem] tracking-tight leading-[0.95] text-brand-cream uppercase select-none">
                <span className="block text-brand-cream hover:text-brand-red transition-colors">
                  THE PERFECT
                </span>
                <span className="block text-stroke text-transparent hover:text-stroke-red transition-all">
                  SMASH.
                </span>
              </h1>
            </motion.div>

            {/* Subheadline: ENGINEERED AT 450°F */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
              className="mt-3 sm:mt-4 flex items-center justify-center lg:justify-start gap-2.5 group cursor-default"
            >
              <div className="w-6 sm:w-8 h-[2px] bg-brand-yellow transition-all group-hover:w-10" />
              <h2 className="font-mono font-bold text-xs sm:text-sm md:text-base text-brand-yellow uppercase tracking-wider flex items-center gap-2">
                <span>ENGINEERED AT 450°F.</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-yellow/60 group-hover:translate-x-1 transition-transform" />
              </h2>
            </motion.div>

            {/* Supporting Sentence */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
              className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-brand-cream/75 font-body max-w-md mx-auto lg:mx-0 leading-relaxed"
            >
              Every layer suspended in culinary precision. Golden toasted sesame
              brioche, crisp onion rings, vine-ripened tomatoes, molten cheddar
              drape, and 450°F fire-seared Angus beef.
            </motion.p>

            {/* Technical Specification Metric Bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="grid grid-cols-3 gap-2 sm:gap-3 my-4 sm:my-6 py-3 sm:py-4 border-y border-white/10 w-full max-w-md"
            >
              <div className="flex flex-col items-center lg:items-start">
                <span className="font-mono font-black text-xl sm:text-2xl lg:text-3xl text-brand-cream">
                  450°F
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono text-brand-yellow uppercase tracking-wider">
                  SEAR TEMP
                </span>
              </div>
              <div className="flex flex-col items-center lg:items-start border-x border-white/10 px-2 sm:px-3">
                <span className="font-mono font-black text-xl sm:text-2xl lg:text-3xl text-brand-cream">
                  18-MO
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                  AGED CHEDDAR
                </span>
              </div>
              <div className="flex flex-col items-center lg:items-start pl-1 sm:pl-2">
                <span className="font-mono font-black text-xl sm:text-2xl lg:text-3xl text-brand-cream">
                  100%
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono text-brand-red uppercase tracking-wider">
                  PRIME ANGUS
                </span>
              </div>
            </motion.div>

            {/* Dual Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-4 pt-1 w-full sm:w-auto"
            >
              <Link
                href="/customizer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-full bg-brand-red hover:bg-brand-red-hover text-brand-cream font-display font-bold text-xs sm:text-sm tracking-wider uppercase shadow-brand-glow transition-all active:scale-95 group"
              >
                <span className="whitespace-nowrap">BUILD YOUR BURGER</span>
                <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 group-hover:translate-x-1.5 transition-transform" />
              </Link>

              <Link
                href="/menu"
                className="w-full sm:w-auto flex items-center justify-center px-5 sm:px-7 py-3 sm:py-3.5 rounded-full bg-brand-dark-surface hover:bg-white/10 border border-white/15 text-brand-cream font-display font-bold text-xs sm:text-sm tracking-wider uppercase transition-colors"
              >
                <span className="whitespace-nowrap">EXPLORE THE MENU</span>
              </Link>
            </motion.div>
          </div>

          {/* ======================================================================= */}
          {/* RIGHT COLUMN: DESKTOP-ONLY BURGER BLUEPRINT HUD COMPOSITION */}
          {/* ======================================================================= */}
          <div className="hidden lg:flex lg:col-span-7 relative items-center justify-end min-h-[680px] lg:min-h-[720px] pl-0 lg:pl-4">
            {/* =================================================================== */}
            {/* UNIFIED VECTOR CONNECTOR SVG CANVAS (760x680 Desktop Precision HUD) */}
            {/* =================================================================== */}
            <svg
              viewBox="0 0 760 680"
              className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-15"
            >
              <defs>
                {/* Active Glowing Line Gradient */}
                <linearGradient
                  id="activeLineGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#FFA700" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#E6392E" stopOpacity="1" />
                  <stop offset="100%" stopColor="#FFA700" stopOpacity="0.9" />
                </linearGradient>

                {/* Subtle Idle Connector Gradient */}
                <linearGradient
                  id="idleLineGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#FFA700" stopOpacity="0.4" />
                </linearGradient>

                {/* Glow Filter */}
                <filter
                  id="goldGlow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 450°F HUD Bridge Line connecting from the top widget to the Patty */}
              <path
                d="M 630 35 L 575 180 L 495 375"
                fill="none"
                stroke="#FFA700"
                strokeWidth="1.5"
                strokeDasharray="4 6"
                strokeOpacity="0.45"
              />

              {/* Dynamic Connector Lines between Specification Cards and Burger Targets */}
              {BLUEPRINT_SPECS.map((spec) => {
                const isHovered = activeSpec === spec.id;

                return (
                  <g key={`svg-path-${spec.id}`}>
                    {/* Base Precision Line */}
                    <path
                      d={spec.pathD}
                      fill="none"
                      stroke={
                        isHovered
                          ? "url(#activeLineGrad)"
                          : "url(#idleLineGrad)"
                      }
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter={isHovered ? "url(#goldGlow)" : undefined}
                      className="transition-all duration-300"
                    />

                    {/* Animated Photon Pulse along the Connector Line */}
                    <path
                      d={spec.pathD}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth={isHovered ? 3 : 2}
                      strokeDasharray="6 24"
                      className="animate-pulse"
                      strokeOpacity={isHovered ? 0.95 : 0.4}
                    />

                    {/* Card Anchor Endpoint Node (Card Origin) */}
                    <circle
                      cx={spec.cardAnchorX}
                      cy={spec.cardAnchorY}
                      r={isHovered ? 4 : 2.5}
                      fill={isHovered ? "#FFA700" : "#FFFFFF"}
                      className="transition-all duration-300"
                    />

                    {/* Target Pinpoint on the Burger */}
                    <g
                      transform={`translate(${spec.targetX}, ${spec.targetY})`}
                    >
                      <circle
                        cx="0"
                        cy="0"
                        r={isHovered ? 6 : 4}
                        fill={isHovered ? "#FFA700" : "#09090B"}
                        stroke={isHovered ? "#FFFFFF" : "#FFA700"}
                        strokeWidth={isHovered ? 2.5 : 1.5}
                        className="transition-all duration-300"
                      />
                      {/* Concentric Radar Ping */}
                      <circle
                        cx="0"
                        cy="0"
                        r={isHovered ? 13 : 8}
                        fill="none"
                        stroke="#FFA700"
                        strokeWidth="1"
                        strokeOpacity={isHovered ? 0.8 : 0.4}
                        className="animate-ping"
                      />
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* Central Master Burger Frame (Enlarged & Top Space Filled) with 3D Mouse Parallax */}
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="relative w-[340px] sm:w-[460px] md:w-[530px] lg:w-[600px] xl:w-[640px] h-[400px] sm:h-[530px] md:h-[610px] lg:h-[680px] flex items-center justify-center will-change-transform z-10 lg:translate-x-0 lg:-translate-y-8"
            >
              {/* Diffuse Ground Shadow */}
              <div className="absolute -bottom-2 w-[300px] sm:w-[440px] md:w-[520px] h-[35px] rounded-full bg-black/95 blur-2xl pointer-events-none z-0" />

              {/* High-Resolution Cutout of the Provided Flying Burger Image */}
              <div className="relative w-full h-full filter drop-shadow-[0_30px_60px_rgba(0,0,0,0.9)] hover:scale-[1.01] transition-transform duration-500">
                <Image
                  src="/burger/hero-burger.png"
                  alt="Engineered Double Smashed Cheeseburger at 450°F"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 600px, 680px"
                  className="object-contain pointer-events-none"
                />
              </div>
            </motion.div>

            {/* =================================================================== */}
            {/* 4. COMPACT & SLEEK TECHNICAL SPECIFICATION CARDS (Desktop Blueprint HUD) */}
            {/* =================================================================== */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none z-25">
              {BLUEPRINT_SPECS.map((spec) => {
                const isHovered = activeSpec === spec.id;

                return (
                  <motion.div
                    key={`card-${spec.id}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={spec.cardStyle}
                    onMouseEnter={() => setActiveSpec(spec.id)}
                    onMouseLeave={() => setActiveSpec(null)}
                    className={`absolute z-30 pointer-events-auto cursor-pointer transition-all duration-300 max-w-[145px] p-2 rounded-xl border backdrop-blur-md shadow-surface-elevated ${
                      isHovered
                        ? "bg-brand-dark-elevated border-brand-yellow shadow-[0_8px_25px_rgba(255,167,0,0.3)] scale-105"
                        : "bg-brand-dark-surface/85 border-white/15 hover:border-white/35 hover:bg-brand-dark-elevated"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-mono text-[7.5px] font-bold text-brand-yellow uppercase tracking-widest flex items-center gap-1">
                        <span
                          className={`w-1 h-1 rounded-full ${isHovered ? "bg-brand-yellow animate-ping" : "bg-brand-yellow/60"}`}
                        />
                        <span>{spec.code}</span>
                      </span>
                      <span className="text-[7px] font-mono text-white/40 uppercase">
                        {spec.category}
                      </span>
                    </div>

                    <h4 className="font-display font-black text-[10.5px] text-brand-cream uppercase tracking-tight leading-tight">
                      {spec.title}
                    </h4>

                    <p className="text-[8.5px] font-body text-brand-cream/65 leading-tight mt-0.5">
                      {spec.subtitle}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
