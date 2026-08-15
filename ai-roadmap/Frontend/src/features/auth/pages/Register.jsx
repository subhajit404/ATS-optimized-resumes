import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Sparkles, User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import AmbientBg from '../../../components/AmbientBg'

const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const { loading, handleRegister } = useAuth()
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.")
            return
        }
        setSubmitting(true)
        const res = await handleRegister({ username, email, password })
        setSubmitting(false)
        if (res.success) {
            navigate("/")
        } else {
            setError(res.error || "Registration failed. Please try again.")
        }
    }

    return (
        <main className="auth-page">
            <AmbientBg />

            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo-badge">
                        <Sparkles size={24} />
                    </div>
                    <h1>Create <span className="highlight">Account</span></h1>
                    <p>Start generating tailored AI interview strategies today</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Full Name or Handle</label>
                        <div className="input-wrapper">
                            <User size={18} className="input-icon" />
                            <input
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Alex Mercer"
                                autoComplete="name"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                type="email"
                                id="email"
                                name="email"
                                placeholder="name@company.com"
                                autoComplete="email"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Minimum 6 characters"
                                autoComplete="new-password"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        className="button primary-button auth-submit-btn"
                        type="submit"
                        disabled={submitting || loading}
                    >
                        {submitting || loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" style={{ animation: 'spinSlow 1s linear infinite' }} />
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            <>
                                <span>Get Started Free</span>
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>Already have an account?</span>
                    <Link to="/login">Sign in</Link>
                </div>
            </div>
        </main>
    )
}

export default Register