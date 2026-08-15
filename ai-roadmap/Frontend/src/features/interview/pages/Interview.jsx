import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams, Link } from 'react-router'
import confetti from 'canvas-confetti'
import { 
    ArrowLeft, Code2, MessageSquare, Map, Download, Search, 
    CheckCircle, Circle, Copy, ChevronDown, Sparkles, Target, 
    Award, AlertTriangle, Layers, Loader2, CheckSquare, Square
} from 'lucide-react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import Navbar from '../../../components/Navbar'
import AmbientBg from '../../../components/AmbientBg'
import Toast from '../../../components/Toast'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Deep-Dive', icon: Code2 },
    { id: 'behavioral', label: 'STAR Behavioral', icon: MessageSquare },
    { id: 'roadmap', label: '7-Day Preparation Roadmap', icon: Map },
]

/* ── Circular SVG Score Meter with Animated Dash ── */
const ScoreRing = ({ score = 0 }) => {
    const radius = 54
    const circumference = 2 * Math.PI * radius
    const [displayScore, setDisplayScore] = useState(0)

    useEffect(() => {
        let start = 0
        const end = Math.min(Math.max(score, 0), 100)
        if (end === 0) return
        const duration = 1200
        const stepTime = 20
        const steps = duration / stepTime
        const increment = end / steps

        const timer = setInterval(() => {
            start += increment
            if (start >= end) {
                setDisplayScore(end)
                clearInterval(timer)
            } else {
                setDisplayScore(Math.round(start))
            }
        }, stepTime)

        return () => clearInterval(timer)
    }, [score])

    const strokeDashoffset = circumference - (displayScore / 100) * circumference
    const strokeColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#f43f5e'
    const tier = score >= 80 ? 'high' : score >= 60 ? 'mid' : 'low'
    const tierLabel = score >= 80 ? 'Exceptional Fit' : score >= 60 ? 'Competitive Match' : 'Growth Needed'

    return (
        <div className="score-widget-body">
            <div className="score-circle-wrap">
                <svg viewBox="0 0 130 130">
                    <circle
                        className="score-bg-circle"
                        cx="65"
                        cy="65"
                        r={radius}
                        strokeWidth="8"
                        fill="transparent"
                    />
                    <circle
                        className="score-progress-circle"
                        cx="65"
                        cy="65"
                        r={radius}
                        strokeWidth="8"
                        stroke={strokeColor}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                    />
                </svg>
                <div className="score-center-text">
                    <span className="score-number">{displayScore}%</span>
                    <span className="score-label">Match Score</span>
                </div>
            </div>

            <span className={`score-status-badge score-status-badge--${tier}`}>
                {tierLabel}
            </span>
        </div>
    )
}

/* ── Interactive Question Card ── */
const QuestionCard = ({ item, index, isPracticed, onTogglePracticed, onCopy }) => {
    const [open, setOpen] = useState(index === 0)

    const handleCopy = (e) => {
        e.stopPropagation()
        const text = `Q: ${item.question}\n\nIntention: ${item.intention}\n\nModel Answer: ${item.answer}`
        navigator.clipboard.writeText(text)
        if (onCopy) onCopy(item.question)
    }

    return (
        <div className={`question-card ${isPracticed ? 'question-card--practiced' : ''}`}>
            <div className="question-card__header" onClick={() => setOpen(o => !o)}>
                <span className="question-card__q-index">Q{index + 1}</span>
                <p className="question-card__title">{item.question}</p>

                <div className="question-card__actions">
                    <button
                        type="button"
                        className={`card-icon-btn ${isPracticed ? 'card-icon-btn--active' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation()
                            onTogglePracticed(index)
                        }}
                        title={isPracticed ? "Mark as pending practice" : "Mark as mastered / practiced"}
                    >
                        {isPracticed ? <CheckCircle size={18} /> : <Circle size={18} />}
                    </button>

                    <button
                        type="button"
                        className="card-icon-btn"
                        onClick={handleCopy}
                        title="Copy question and answer"
                    >
                        <Copy size={16} />
                    </button>

                    <span className={`chevron-icon ${open ? 'chevron-icon--open' : ''}`}>
                        <ChevronDown size={18} />
                    </span>
                </div>
            </div>

            {open && (
                <div className="question-card__body">
                    <div className="answer-block">
                        <span className="answer-block__tag answer-block__tag--intention">
                            <Target size={12} />
                            <span>Interviewer Intention</span>
                        </span>
                        <div className="answer-block__content">
                            {item.intention}
                        </div>
                    </div>

                    <div className="answer-block">
                        <span className="answer-block__tag answer-block__tag--answer">
                            <Sparkles size={12} />
                            <span>Recommended STAR Model Answer</span>
                        </span>
                        <div className="answer-block__content">
                            {item.answer}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

/* ── Interactive 7-Day Roadmap Day Component ── */
const RoadMapDay = ({ day, checkedTasks, onToggleTask }) => {
    return (
        <div className="roadmap-day-card">
            <span className="roadmap-day-card__node" />
            <div className="roadmap-day-card__header">
                <div className="day-title-group">
                    <span className="day-badge">Day {day.day}</span>
                    <h3>{day.focus}</h3>
                </div>
            </div>

            <ul className="roadmap-day-card__tasks">
                {day.tasks.map((task, i) => {
                    const taskId = `d${day.day}-t${i}`
                    const isDone = !!checkedTasks[taskId]
                    return (
                        <li 
                            key={i} 
                            className={isDone ? 'task-done' : ''}
                            onClick={() => onToggleTask(taskId)}
                        >
                            <span className={`task-check-icon ${isDone ? 'task-check-icon--checked' : ''}`}>
                                {isDone ? <CheckSquare size={16} /> : <Square size={16} />}
                            </span>
                            <span>{task}</span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

/* ── Main Interview Dashboard Component ── */
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const [searchQuery, setSearchQuery] = useState('')
    const [practicedMap, setPracticedMap] = useState({})
    const [roadmapTasks, setRoadmapTasks] = useState({})
    const [toastMsg, setToastMsg] = useState('')
    const [downloading, setDownloading] = useState(false)

    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])

    useEffect(() => {
        if (report && report.matchScore >= 80) {
            try {
                confetti({
                    particleCount: 60,
                    spread: 70,
                    origin: { y: 0.6 }
                })
            } catch (e) {
                // confetti fallback
            }
        }
    }, [report])

    const togglePracticed = (idx) => {
        setPracticedMap(prev => {
            const next = { ...prev, [idx]: !prev[idx] }
            return next
        })
    }

    const toggleRoadmapTask = (taskId) => {
        setRoadmapTasks(prev => ({
            ...prev,
            [taskId]: !prev[taskId]
        }))
    }

    const handleDownloadPdf = async () => {
        setDownloading(true)
        setToastMsg("Generating your custom tailored resume PDF...")
        try {
            await getResumePdf(interviewId)
            setToastMsg("Resume PDF downloaded successfully! ✨")
        } catch (err) {
            setToastMsg("Could not download resume PDF. Please retry.")
        } finally {
            setDownloading(false)
        }
    }

    const handleCopyQuestion = () => {
        setToastMsg("Question & Model Answer copied to clipboard! ✨")
    }

    /* Filter questions by search */
    const filteredTechnical = useMemo(() => {
        if (!report?.technicalQuestions) return []
        if (!searchQuery.trim()) return report.technicalQuestions
        const q = searchQuery.toLowerCase()
        return report.technicalQuestions.filter(item => 
            item.question?.toLowerCase().includes(q) ||
            item.intention?.toLowerCase().includes(q) ||
            item.answer?.toLowerCase().includes(q)
        )
    }, [report, searchQuery])

    const filteredBehavioral = useMemo(() => {
        if (!report?.behavioralQuestions) return []
        if (!searchQuery.trim()) return report.behavioralQuestions
        const q = searchQuery.toLowerCase()
        return report.behavioralQuestions.filter(item => 
            item.question?.toLowerCase().includes(q) ||
            item.intention?.toLowerCase().includes(q) ||
            item.answer?.toLowerCase().includes(q)
        )
    }, [report, searchQuery])

    if (loading || !report) {
        return (
            <div className="interview-page">
                <AmbientBg />
                <Navbar />
                <div className="ai-loader-overlay">
                    <div className="ai-loader-card">
                        <div className="radar-container">
                            <div className="radar-pulse" />
                            <div className="radar-ring" />
                            <div className="radar-center">
                                <Loader2 size={20} className="animate-spin" style={{ animation: 'spinSlow 1s linear infinite' }} />
                            </div>
                        </div>
                        <h2>Loading Interview Strategy</h2>
                        <p className="loader-subtitle">Retrieving technical questions, STAR frameworks, and customized roadmap...</p>
                    </div>
                </div>
            </div>
        )
    }

    const currentQuestions = activeNav === 'technical' ? filteredTechnical : filteredBehavioral
    const totalCurrentCount = activeNav === 'technical' ? (report.technicalQuestions?.length || 0) : (report.behavioralQuestions?.length || 0)
    const practicedCount = Object.values(practicedMap).filter(Boolean).length

    return (
        <div className="interview-page">
            <AmbientBg />
            <Navbar />
            <Toast message={toastMsg} onClose={() => setToastMsg("")} />

            <main className="interview-container">
                {/* Header Action Bar */}
                <div className="strategy-header">
                    <div className="strategy-header__left">
                        <button
                            type="button"
                            className="strategy-header__back-btn"
                            onClick={() => navigate('/')}
                            title="Back to Strategy Studio"
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <div className="strategy-header__info">
                            <h1>{report.title || "Custom Interview Strategy"}</h1>
                            <div className="meta-row">
                                <span className="meta-badge">AI Plan</span>
                                <span>Generated on {new Date(report.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>

                    <div className="strategy-header__actions">
                        <button
                            type="button"
                            onClick={handleDownloadPdf}
                            disabled={downloading}
                            className="button primary-button sm-button"
                        >
                            {downloading ? (
                                <>
                                    <Loader2 size={15} style={{ animation: 'spinSlow 1s linear infinite' }} />
                                    <span>Generating PDF...</span>
                                </>
                            ) : (
                                <>
                                    <Download size={15} />
                                    <span>Download Tailored Resume</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* 3-Column Dashboard Layout */}
                <div className="strategy-layout">
                    
                    {/* Left Nav */}
                    <nav className="strategy-nav">
                        <span className="nav-header-label">Strategy Sections</span>

                        {NAV_ITEMS.map((item) => {
                            const IconComponent = item.icon
                            const count = item.id === 'technical' 
                                ? report.technicalQuestions?.length 
                                : item.id === 'behavioral' 
                                ? report.behavioralQuestions?.length 
                                : report.preparationPlan?.length

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={`strategy-nav__item ${activeNav === item.id ? 'strategy-nav__item--active' : ''}`}
                                    onClick={() => {
                                        setActiveNav(item.id)
                                        setSearchQuery('')
                                    }}
                                >
                                    <div className="item-left">
                                        <IconComponent size={16} />
                                        <span>{item.label}</span>
                                    </div>
                                    <span className="item-count">{count}</span>
                                </button>
                            )
                        })}

                        <div className="nav-divider" />
                    </nav>

                    {/* Center Content */}
                    <main className="strategy-content">
                        {/* Toolbar / Search / Controls */}
                        <div className="content-toolbar">
                            <div className="toolbar-left">
                                <h2>
                                    {activeNav === 'technical' && 'Technical Questions'}
                                    {activeNav === 'behavioral' && 'Behavioral STAR Framework'}
                                    {activeNav === 'roadmap' && '7-Day Preparation Plan'}
                                </h2>
                                <span className="tab-badge">
                                    {activeNav === 'roadmap' 
                                        ? `${report.preparationPlan?.length || 0} Days` 
                                        : `${currentQuestions.length} Questions`}
                                </span>
                            </div>

                            {activeNav !== 'roadmap' && (
                                <div className="toolbar-right">
                                    <div className="search-box">
                                        <Search size={14} />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search questions or keywords..."
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mastery Practice Progress Tracker */}
                        {activeNav !== 'roadmap' && (
                            <div className="mastery-tracker">
                                <div className="mastery-tracker__header">
                                    <div className="tracker-title">
                                        <Award size={15} />
                                        <span>Practice Mastery Progress</span>
                                    </div>
                                    <span className="tracker-stats">
                                        {practicedCount} of {totalCurrentCount} Mastered ({Math.round((practicedCount / Math.max(totalCurrentCount, 1)) * 100)}%)
                                    </span>
                                </div>
                                <div className="mastery-tracker__bar">
                                    <div 
                                        className="bar-fill" 
                                        style={{ width: `${(practicedCount / Math.max(totalCurrentCount, 1)) * 100}%` }} 
                                    />
                                </div>
                            </div>
                        )}

                        {/* Question Lists */}
                        {activeNav === 'technical' && (
                            <div className="question-cards-list">
                                {filteredTechnical.map((q, i) => (
                                    <QuestionCard
                                        key={i}
                                        item={q}
                                        index={i}
                                        isPracticed={!!practicedMap[`tech-${i}`]}
                                        onTogglePracticed={() => togglePracticed(`tech-${i}`)}
                                        onCopy={handleCopyQuestion}
                                    />
                                ))}
                            </div>
                        )}

                        {activeNav === 'behavioral' && (
                            <div className="question-cards-list">
                                {filteredBehavioral.map((q, i) => (
                                    <QuestionCard
                                        key={i}
                                        item={q}
                                        index={i}
                                        isPracticed={!!practicedMap[`behav-${i}`]}
                                        onTogglePracticed={() => togglePracticed(`behav-${i}`)}
                                        onCopy={handleCopyQuestion}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Roadmap */}
                        {activeNav === 'roadmap' && (
                            <div className="roadmap-timeline">
                                {report.preparationPlan?.map((day) => (
                                    <RoadMapDay
                                        key={day.day}
                                        day={day}
                                        checkedTasks={roadmapTasks}
                                        onToggleTask={toggleRoadmapTask}
                                    />
                                ))}
                            </div>
                        )}
                    </main>

                    {/* Right Sidebar Assessment */}
                    <aside className="strategy-sidebar">
                        {/* Match Score Widget */}
                        <div className="sidebar-widget">
                            <span className="sidebar-widget__title">Candidate Alignment</span>
                            <ScoreRing score={report.matchScore} />
                        </div>

                        {/* Skill Gaps Widget */}
                        {report.skillGaps && report.skillGaps.length > 0 && (
                            <div className="sidebar-widget">
                                <div className="sidebar-widget__title">
                                    <span>Identified Skill Gaps</span>
                                    <AlertTriangle size={14} color="#f59e0b" />
                                </div>

                                <div className="skill-gaps-container">
                                    {report.skillGaps.map((gap, i) => (
                                        <div 
                                            key={i} 
                                            className={`skill-gap-badge skill-gap-badge--${gap.severity}`}
                                        >
                                            <span>{gap.skill}</span>
                                            <span className="severity-tag">{gap.severity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Summary Stats Widget */}
                        <div className="sidebar-widget">
                            <span className="sidebar-widget__title">Strategy Overview</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                    <span>Technical Questions:</span>
                                    <strong style={{ color: '#ffffff' }}>{report.technicalQuestions?.length || 0}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                    <span>Behavioral Questions:</span>
                                    <strong style={{ color: '#ffffff' }}>{report.behavioralQuestions?.length || 0}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                    <span>Prep Timeline:</span>
                                    <strong style={{ color: '#ffffff' }}>{report.preparationPlan?.length || 0} Days</strong>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    )
}

export default Interview