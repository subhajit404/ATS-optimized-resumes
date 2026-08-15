import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import AmbientBg from '../../../components/AmbientBg'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSubmitting(true)
        const res = await handleLogin({ email, password })
        setSubmitting(false)
        if (res.success) {
            navigate('/')
        } else {
            setError(res.error || "Invalid email or password. Please try again.")
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
                    <h1>Welcome <span className="highlight">Back</span></h1>
                    <p>Enter your credentials to access your interview strategy dashboard</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
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
                                placeholder="••••••••"
                                autoComplete="current-password"
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
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>Don't have an account?</span>
                    <Link to="/register">Create an account</Link>
                </div>
            </div>
        </main>
    )
}

export default Login