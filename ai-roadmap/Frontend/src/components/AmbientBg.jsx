import React from 'react'

export const AmbientBg = () => {
    return (
        <div className="ambient-bg" aria-hidden="true">
            {/* Noise grain overlay — same technique as Luminous Labs */}
            <svg className="ambient-bg__noise" xmlns="http://www.w3.org/2000/svg">
                <filter id="noise">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.65"
                        numOctaves="3"
                        stitchTiles="stitch"
                    />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noise)" />
            </svg>

            <div className="ambient-bg__grid" />
            <div className="ambient-bg__orb ambient-bg__orb--1" />
            <div className="ambient-bg__orb ambient-bg__orb--2" />
            <div className="ambient-bg__orb ambient-bg__orb--3" />
            {/* Extra orb for more depth — matches the 4-orb composition on LL */}
            <div className="ambient-bg__orb ambient-bg__orb--4" />
        </div>
    )
}

export default AmbientBg
