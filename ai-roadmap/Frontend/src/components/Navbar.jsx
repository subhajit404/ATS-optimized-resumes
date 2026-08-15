import React, { useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router'
import { Sparkles, LogOut } from 'lucide-react'
import { useAuth } from '../features/auth/hooks/useAuth'
import './navbar.scss'

export const Navbar = () => {
    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()
    const navRef = useRef(null)

    /* Luminous Labs-style: slide in from top + blur-in on mount */
    useEffect(() => {
        const el = navRef.current
        if (!el) return
        // Brief delay lets browser paint first so the animation is visible
        requestAnimationFrame(() => {
            el.classList.add('app-navbar--visible')
        })
    }, [])

    const onLogout = async () => {
        await handleLogout()
        navigate('/login')
    }

    return (
        <header className="app-navbar" ref={navRef}>
            <div className="app-navbar__container">
                <Link to="/" className="app-navbar__brand">
                    <div className="brand-logo">
                        <Sparkles size={18} />
                    </div>
                    <div className="brand-title">
                        Prep<span>Pulse</span>
                    </div>
                    <span className="brand-badge">AI 2.0</span>
                </Link>

                <div className="app-navbar__actions">
                    {user && (
                        <>
                            <div className="app-navbar__user-pill">
                                <div className="avatar">
                                    {(user.username || user.email || 'U')[0].toUpperCase()}
                                </div>
                                <span className="user-name">
                                    {user.username || user.email?.split('@')[0] || 'Member'}
                                </span>
                            </div>

                            <button 
                                onClick={onLogout} 
                                className="app-navbar__logout-btn" 
                                title="Sign out of account"
                            >
                                <LogOut size={14} />
                                <span>Logout</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Navbar
