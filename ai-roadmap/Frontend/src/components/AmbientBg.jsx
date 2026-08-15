import React from 'react'

export const AmbientBg = () => {
    return (
        <div className="ambient-bg" aria-hidden="true">
            <div className="ambient-bg__grid" />
            <div className="ambient-bg__orb ambient-bg__orb--1" />
            <div className="ambient-bg__orb ambient-bg__orb--2" />
            <div className="ambient-bg__orb ambient-bg__orb--3" />
        </div>
    )
}

export default AmbientBg
