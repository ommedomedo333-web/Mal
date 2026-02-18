
import React, { useState, useEffect } from "react";

// SVG face components per mood
function HappyFace() {
    return (
        <g>
            {/* Left eye - wide open, sparkling */}
            <ellipse cx="88" cy="112" rx="14" ry="16" fill="#3a1a00" />
            <ellipse cx="88" cy="112" rx="11" ry="13" fill="#1a0800" />
            <circle cx="83" cy="107" r="4" fill="white" opacity="0.9" />
            <circle cx="81" cy="105" r="2" fill="white" opacity="0.6" />
            {/* Left eye shine */}
            <ellipse cx="93" cy="120" rx="3" ry="2" fill="white" opacity="0.5" />

            {/* Right eye - wide open, sparkling */}
            <ellipse cx="162" cy="112" rx="14" ry="16" fill="#3a1a00" />
            <ellipse cx="162" cy="112" rx="11" ry="13" fill="#1a0800" />
            <circle cx="157" cy="107" r="4" fill="white" opacity="0.9" />
            <circle cx="155" cy="105" r="2" fill="white" opacity="0.6" />
            <ellipse cx="167" cy="120" rx="3" ry="2" fill="white" opacity="0.5" />

            {/* Rosy cheeks - Moved up */}
            <ellipse cx="68" cy="138" rx="16" ry="10" fill="#ff6b35" opacity="0.35" />
            <ellipse cx="182" cy="138" rx="16" ry="10" fill="#ff6b35" opacity="0.35" />

            {/* Big smile - Moved up */}
            <path
                d="M 85 150 Q 125 190 165 150"
                stroke="#3a1a00"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
            />
            {/* Teeth - Moved up */}
            <path
                d="M 93 158 Q 125 185 157 158 Q 125 165 93 158 Z"
                fill="white"
                opacity="0.9"
            />

            {/* Stars / sparkles around */}
            <text x="38" y="90" fontSize="18" fill="#FFD700" opacity="0.9">✦</text>
            <text x="190" y="80" fontSize="14" fill="#FFD700" opacity="0.8">✦</text>
            <text x="195" y="170" fontSize="10" fill="#FFD700" opacity="0.7">✦</text>
        </g>
    );
}

function NeutralFace() {
    return (
        <g>
            {/* Left eye - normal */}
            <ellipse cx="88" cy="115" rx="11" ry="12" fill="#3a1a00" />
            <ellipse cx="88" cy="115" rx="8" ry="9" fill="#1a0800" />
            <circle cx="84" cy="111" r="3" fill="white" opacity="0.8" />

            {/* Right eye - normal */}
            <ellipse cx="162" cy="115" rx="11" ry="12" fill="#3a1a00" />
            <ellipse cx="162" cy="115" rx="8" ry="9" fill="#1a0800" />
            <circle cx="158" cy="111" r="3" fill="white" opacity="0.8" />

            {/* Straight mouth - Moved up */}
            <path
                d="M 95 158 Q 125 160 155 158"
                stroke="#3a1a00"
                strokeWidth="4.5"
                fill="none"
                strokeLinecap="round"
            />
        </g>
    );
}

function SadFace() {
    return (
        <g>
            {/* Left eye - drooping */}
            <ellipse cx="88" cy="118" rx="11" ry="11" fill="#3a1a00" />
            <ellipse cx="88" cy="118" rx="8" ry="8" fill="#1a0800" />
            <circle cx="85" cy="115" r="3" fill="white" opacity="0.8" />

            {/* Left eyebrow drooping inward */}
            <path
                d="M 72 98 Q 88 92 100 97"
                stroke="#5a3000"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
            />

            {/* Right eye - drooping */}
            <ellipse cx="162" cy="118" rx="11" ry="11" fill="#3a1a00" />
            <ellipse cx="162" cy="118" rx="8" ry="8" fill="#1a0800" />
            <circle cx="159" cy="115" r="3" fill="white" opacity="0.8" />

            {/* Right eyebrow drooping inward */}
            <path
                d="M 150 97 Q 162 92 178 98"
                stroke="#5a3000"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
            />

            {/* Frown - Moved up */}
            <path
                d="M 92 165 Q 125 145 158 165"
                stroke="#3a1a00"
                strokeWidth="4.5"
                fill="none"
                strokeLinecap="round"
            />

            {/* Tear drops - left eye */}
            <TearDrop cx={82} baseY={130} delay={0} />
            <TearDrop cx={90} baseY={130} delay={0.4} />

            {/* Tear drops - right eye */}
            <TearDrop cx={156} baseY={130} delay={0.2} />
            <TearDrop cx={164} baseY={130} delay={0.6} />
        </g>
    );
}

function TearDrop({ cx, baseY, delay }: { cx: number, baseY: number, delay: number }) {
    return (
        <>
            <style>{`
        @keyframes tearFall {
          0%   { transform: translateY(0px); opacity: 0.9; }
          80%  { transform: translateY(55px); opacity: 0.7; }
          100% { transform: translateY(65px); opacity: 0; }
        }
        .tear-${cx}-${delay.toString().replace(".", "")} {
          animation: tearFall 1.6s ease-in infinite;
          animation-delay: ${delay}s;
        }
      `}</style>
            <g className={`tear-${cx}-${delay.toString().replace(".", "")}`}>
                <ellipse
                    cx={cx}
                    cy={baseY}
                    rx="3"
                    ry="5"
                    fill="#7ecef4"
                    opacity="0.85"
                />
                <path
                    d={`M ${cx - 3} ${baseY + 2} Q ${cx} ${baseY + 10} ${cx + 3} ${baseY + 2}`}
                    fill="#7ecef4"
                    opacity="0.75"
                />
            </g>
        </>
    );
}

interface OrangeMascotProps {
    mood: 'happy' | 'neutral' | 'sad';
    animating?: boolean;
    children?: React.ReactNode;
}

export default function OrangeMascot({ mood, animating = false, children }: OrangeMascotProps) {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                transition: "transform 0.2s ease, opacity 0.2s ease",
                transform: animating ? "scale(0.95)" : "scale(1)",
                opacity: animating ? 0.8 : 1,
                filter: `drop-shadow(0 20px 60px rgba(255,154,0,0.4))`,
                position: 'relative'
            }}
        >
            <svg
                viewBox="0 0 250 270"
                className="w-full h-full absolute inset-0 z-0"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
            >
                <defs>
                    {/* Orange body gradient */}
                    <radialGradient id="orangeBody" cx="40%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#ffdd77" />
                        <stop offset="35%" stopColor="#ffaa00" />
                        <stop offset="75%" stopColor="#e07000" />
                        <stop offset="100%" stopColor="#b85000" />
                    </radialGradient>

                    {/* Peel texture overlay */}
                    <filter id="peelTexture">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.65"
                            numOctaves="3"
                            result="noise"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="noise"
                            scale="3"
                            xChannelSelector="R"
                            yChannelSelector="G"
                        />
                    </filter>

                    {/* Soft shadow */}
                    <filter id="bodyShadow" x="-10%" y="-10%" width="120%" height="130%">
                        <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#7a3500" floodOpacity="0.4" />
                    </filter>

                    {/* Mood-based glow */}
                    <filter id="moodGlow">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Orange body */}
                <ellipse
                    cx="125"
                    cy="145"
                    rx="120"
                    ry="130"
                    fill="url(#orangeBody)"
                    filter="url(#bodyShadow)"
                />

                {/* Peel texture layer */}
                <ellipse
                    cx="125"
                    cy="145"
                    rx="120"
                    ry="130"
                    fill="url(#orangeBody)"
                    opacity="0.3"
                    filter="url(#peelTexture)"
                />

                {/* Highlight shine */}
                <ellipse cx="90" cy="70" rx="38" ry="28" fill="white" opacity="0.13" />
                <ellipse cx="82" cy="66" rx="18" ry="12" fill="white" opacity="0.1" />

                {/* Stem */}
                <path
                    d="M 125 15 Q 122 5 118 0"
                    stroke="#4a7a20"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    transform="translate(0, 10)"
                />
                {/* Calyx (star leaves) */}
                <g transform="translate(125, 25)">
                    {[0, 72, 144, 216, 288].map((angle, i) => (
                        <path
                            key={i}
                            d={`M 0 0 L ${6 * Math.cos((angle * Math.PI) / 180)} ${6 * Math.sin((angle * Math.PI) / 180)} L ${3 * Math.cos(((angle + 36) * Math.PI) / 180)} ${3 * Math.sin(((angle + 36) * Math.PI) / 180)} Z`}
                            fill="#5a9a28"
                            opacity="0.9"
                        />
                    ))}
                    <circle cx="0" cy="0" r="3.5" fill="#3a7a15" />
                </g>

                {/* Mood face - Positioned higher */}
                <g transform="translate(0, -50) scale(0.9) translate(15, 15)">
                    {mood === "happy" && <HappyFace />}
                    {mood === "neutral" && <NeutralFace />}
                    {mood === "sad" && <SadFace />}
                </g>
            </svg>
            {/* Content Overlay */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
}
