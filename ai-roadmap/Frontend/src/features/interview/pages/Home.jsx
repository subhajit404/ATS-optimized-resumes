import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { 
    Sparkles, Briefcase, UserCheck, UploadCloud, FileCheck2, Trash2, 
    Info, ArrowRight, Clock, Plus, Zap, FileText
} from 'lucide-react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import Navbar from '../../../components/Navbar'
import AmbientBg from '../../../components/AmbientBg'
import Toast from '../../../components/Toast'

const SAMPLE_TEMPLATES = [
    {
        title: 'Senior React Engineer',
        jd: 'Senior React Engineer at tech enterprise. Required: React 19, Next.js, TypeScript, State Architecture (Zustand/Redux), High-performance Web Applications, Web Vitals optimization, REST & GraphQL APIs, and leading code reviews.',
        self: '5 years of frontend experience specializing in modern React ecosystem, Next.js, TypeScript, and micro-frontends. Led a team of 4 engineers and improved web application performance scores by 35%.'
    },
    {
        title: 'Full-Stack Node.js Engineer',
        jd: 'Full-Stack Software Engineer. Requirements: Node.js, Express, PostgreSQL/MongoDB, React, Redis caching, Docker containerization, cloud deployment (AWS), and distributed systems design.',
        self: '4+ years building full-stack applications with Node.js, Express, MongoDB, and React. Experienced in scalable RESTful APIs, asynchronous worker queues, and deploying microservices to AWS ECS.'
    },
    {
        title: 'AI / ML Engineer',
        jd: 'AI Application Engineer to build LLM-powered enterprise tooling. Requirements: Python, LangChain, OpenAI/Claude APIs, vector databases (Pinecone/Milvus), RAG architectures, and scalable API services.',
        self: '3 years specializing in Python backend and AI application development with extensive experience in RAG pipelines, prompt engineering, vector search indexing, and LangChain orchestration.'
    }
]

const SKILL_SUGGESTIONS = [
    'React 19 & Next.js',
    'TypeScript',
    'System Architecture',
    'Node.js & Express',
    'Cloud AWS / GCP',
    'REST & GraphQL',
    'Team Mentorship'
]

const LOADER_STEPS = [
    'Parsing target role competencies and core requirements...',
    'Evaluating candidate profile, experience and skills...',
    'Synthesizing deep-dive technical and STAR behavioral questions...',
    'Constructing 7-day tactical mastery roadmap...'
]

const Home = () => {
    const { loading, generateReport, reports, getReports } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [resumeFile, setResumeFile] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [toastMsg, setToastMsg] = useState("")
    const [loaderStep, setLoaderStep] = useState(0)
    const resumeInputRef = useRef()
    const navigate = useNavigate()

    useEffect(() => {
        getReports()
    }, [])

    useEffect(() => {
        let interval
        if (loading) {
            setLoaderStep(0)
            interval = setInterval(() => {
                setLoaderStep(prev => (prev < LOADER_STEPS.length - 1 ? prev + 1 : prev))
            }, 5000)
        }
        return () => clearInterval(interval)
    }, [loading])

    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        const file = e.dataTransfer?.files?.[0]
        if (file) {
            setResumeFile(file)
            setToastMsg(`Uploaded ${file.name}`)
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setResumeFile(file)
            setToastMsg(`Uploaded ${file.name}`)
        }
    }

    const handleRemoveFile = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setResumeFile(null)
        if (resumeInputRef.current) {
            resumeInputRef.current.value = ""
        }
    }

    const handleApplyTemplate = (tmpl) => {
        setJobDescription(tmpl.jd)
        setSelfDescription(tmpl.self)
        setToastMsg(`Loaded template: ${tmpl.title}`)
    }

    const handleAddSkillTag = (tag) => {
        setSelfDescription(prev => {
            const trimmed = prev.trim()
            return trimmed ? `${trimmed}, ${tag}` : `Proficient in ${tag}`
        })
    }

    const handleGenerateReport = async () => {
        if (!resumeFile && !selfDescription.trim()) {
            setToastMsg("Please upload your resume (PDF) or provide a quick self-description.")
            return
        }
        if (!jobDescription.trim()) {
            setToastMsg("Please provide the target job description.")
            return
        }
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        if (data && data._id) {
            navigate(`/interview/${data._id}`)
        }
    }

    return (
        <div className="home-page">
            <AmbientBg />
            <Navbar />
            <Toast message={toastMsg} onClose={() => setToastMsg("")} />

            {/* AI Multi-Stage Generation Loader */}
            {loading && (
                <div className="ai-loader-overlay">
                    <div className="ai-loader-card">
                        <div className="radar-container">
                            <div className="radar-pulse" />
                            <div className="radar-ring" />
                            <div className="radar-center">
                                <Sparkles size={20} />
                            </div>
                        </div>

                        <div>
                            <h2 className="loader-title">Synthesizing Strategy Plan</h2>
                            <p className="loader-subtitle">Our AI model is generating your personalized interview roadmap</p>
                        </div>

                        <div className="loader-steps">
                            {LOADER_STEPS.map((step, idx) => (
                                <div 
                                    key={idx} 
                                    className={`step-item ${idx <= loaderStep ? 'step-item--active' : ''}`}
                                >
                                    <span className="step-dot" />
                                    <span>{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <main className="home-container">
                {/* Hero Header */}
                <section className="home-hero">
                    <div className="home-hero__badge">
                        <Sparkles size={14} />
                        <span>AI-Powered Career Intelligence</span>
                    </div>

                    <h1>
                        Supercharge Your Next <span className="highlight">Interview Strategy</span>
                    </h1>

                    <p>
                        Paste the target job description and upload your resume or profile. We'll generate targeted technical questions, STAR behavioral frameworks, and a custom 7-day preparation roadmap.
                    </p>

                    {/* Quick Sample Template Chips */}
                    <div className="sample-templates">
                        <span className="sample-templates__label">Quick Fill:</span>
                        {SAMPLE_TEMPLATES.map((tmpl, i) => (
                            <button
                                key={i}
                                type="button"
                                className="sample-templates__chip"
                                onClick={() => handleApplyTemplate(tmpl)}
                            >
                                <Zap size={12} />
                                <span>{tmpl.title}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Main Studio Card */}
                <div className="studio-card">
                    <div className="studio-card__body">
                        
                        {/* Left Panel - Job Description */}
                        <div className="studio-panel">
                            <div className="studio-panel__header">
                                <div className="header-left">
                                    <div className="panel-icon-wrap">
                                        <Briefcase size={16} />
                                    </div>
                                    <h2>Target Job Description</h2>
                                </div>
                                <span className="badge-pill badge-pill--required">Required</span>
                            </div>

                            <div className="textarea-wrapper">
                                <textarea
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    value={jobDescription}
                                    placeholder={`Paste the job posting description here...\ne.g. 'Senior Frontend Engineer: React 19, TypeScript, scalable architecture, automated testing, and web performance optimization...'`}
                                    maxLength={5000}
                                />
                                <span className="char-counter">{jobDescription.length} / 5000</span>
                            </div>
                        </div>

                        {/* Middle Divider */}
                        <div className="studio-card__divider" />

                        {/* Right Panel - Profile & Resume */}
                        <div className="studio-panel">
                            <div className="studio-panel__header">
                                <div className="header-left">
                                    <div className="panel-icon-wrap">
                                        <UserCheck size={16} />
                                    </div>
                                    <h2>Candidate Profile</h2>
                                </div>
                                <span className="badge-pill badge-pill--recommended">High Accuracy</span>
                            </div>

                            {/* Dropzone */}
                            <div className="dropzone-container">
                                <div className="dropzone-label">
                                    <span>Upload Resume</span>
                                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>PDF or DOCX</span>
                                </div>

                                <label
                                    htmlFor="resumeInput"
                                    className={`dropzone-box ${isDragging ? 'dropzone-box--active' : ''} ${resumeFile ? 'dropzone-box--selected' : ''}`}
                                    onDragOver={handleDragOver}
                                    onDragEnter={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    {resumeFile ? (
                                        <>
                                            <div className="dropzone-icon dropzone-icon--success">
                                                <FileCheck2 size={22} />
                                            </div>
                                            <div className="dropzone-file-info">
                                                <span>{resumeFile.name}</span>
                                                <button 
                                                    type="button" 
                                                    className="file-remove-btn"
                                                    onClick={handleRemoveFile}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            <span className="dropzone-hint">{(resumeFile.size / 1024).toFixed(1)} KB &bull; Ready for analysis</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="dropzone-icon">
                                                <UploadCloud size={22} />
                                            </div>
                                            <span className="dropzone-title">
                                                {isDragging ? 'Drop your resume file here' : 'Click to browse or drag & drop'}
                                            </span>
                                            <span className="dropzone-hint">Supports PDF & DOCX up to 5MB</span>
                                        </>
                                    )}
                                    <input
                                        ref={resumeInputRef}
                                        onChange={handleFileChange}
                                        type="file"
                                        id="resumeInput"
                                        accept=".pdf,.docx"
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>

                            {/* Subtle OR Divider */}
                            <div className="subtle-or-divider">
                                <span>OR ADD SUMMARY</span>
                            </div>

                            {/* Self-Description with Quick Skill Tags */}
                            <div className="self-description-group">
                                <div className="self-desc-header">
                                    <label htmlFor="selfDescInput">Quick Experience Summary</label>
                                </div>
                                <div className="textarea-wrapper" style={{ marginTop: '0.4rem' }}>
                                    <textarea
                                        id="selfDescInput"
                                        className="textarea-wrapper--short"
                                        value={selfDescription}
                                        onChange={(e) => setSelfDescription(e.target.value)}
                                        placeholder="Briefly describe your key skills, years of experience, and notable achievements if not attaching a resume..."
                                    />
                                </div>

                                <div className="quick-skill-tags">
                                    {SKILL_SUGGESTIONS.map((skill, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            className="skill-tag-pill"
                                            onClick={() => handleAddSkillTag(skill)}
                                        >
                                            <Plus size={10} />
                                            <span>{skill}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="studio-info-box">
                                <Info size={16} />
                                <p>
                                    Either a <strong>Resume</strong> or <strong>Experience Summary</strong> is used to formulate tailored questions and score your match alignment.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card Footer */}
                    <div className="studio-card__footer">
                        <div className="footer-status">
                            <span className="pulse-dot" />
                            <span>AI Strategy Engine Ready &bull; ~20s generation</span>
                        </div>

                        <button
                            type="button"
                            onClick={handleGenerateReport}
                            className="button primary-button generate-cta-btn"
                        >
                            <Sparkles size={16} />
                            <span>Generate My Interview Strategy</span>
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Recent Reports Section */}
                {reports && reports.length > 0 && (
                    <section className="recent-section">
                        <div className="recent-section__header">
                            <h2>My Recent Interview Strategies</h2>
                            <span className="reports-count">{reports.length} Plans</span>
                        </div>

                        <div className="reports-grid">
                            {reports.map((item) => {
                                const scoreTier = item.matchScore >= 80 ? 'high' : item.matchScore >= 60 ? 'mid' : 'low'
                                return (
                                    <div
                                        key={item._id}
                                        className="report-card"
                                        onClick={() => navigate(`/interview/${item._id}`)}
                                    >
                                        <div className="report-card-top">
                                            <h3>{item.title || 'Untitled Strategy'}</h3>
                                            <span className={`score-pill score-pill--${scoreTier}`}>
                                                {item.matchScore}% Match
                                            </span>
                                        </div>

                                        <div className="report-card-bottom">
                                            <span className="report-date">
                                                {new Date(item.createdAt).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                            <span className="card-arrow">
                                                <ArrowRight size={16} />
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                )}
            </main>

            <footer className="page-footer">
                <a href="#terms">Privacy & Security</a>
                <a href="#terms">Terms of Service</a>
                <a href="#help">Documentation</a>
            </footer>
        </div>
    )
}

export default Home