import React, { useState, useEffect } from 'react'
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react'
import './toast.scss'

export const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (!message) return
        const timer = setTimeout(() => {
            if (onClose) onClose()
        }, duration)
        return () => clearTimeout(timer)
    }, [message, duration, onClose])

    if (!message) return null

    const iconMap = {
        success: <CheckCircle2 size={16} className="toast-icon" />,
        info: <Info size={16} className="toast-icon" />,
        error: <AlertCircle size={16} className="toast-icon" />
    }

    return (
        <div className="toast-container">
            <div className={`toast-item toast-item--${type}`}>
                {iconMap[type] || iconMap.success}
                <span>{message}</span>
            </div>
        </div>
    )
}

export default Toast
