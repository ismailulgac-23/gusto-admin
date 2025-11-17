import React from 'react'
import Alert from '../ui/alert/Alert'

const LoadingContainer = ({ loading, children }) => {
    return (
        <div className="relative">
            {loading && (
                <div
                    className="absolute inset-0 z-50 bg-white/50 dark:bg-gray-900/50 cursor-not-allowed"
                    onClick={(e) => e.preventDefault()}
                />
            )}

            {/* <Alert
                variant="success"
                title="İşlem başarılı"
                message="İşlem başarılı bir şekilde gerçekleştirildi."
                showLink={false}
            />
            <Alert
                variant="error"
                title="İşlem başarısız"
                message="İşlem başarısız bir şekilde gerçekleştirildi."
                showLink={false}
            />
            <Alert
                variant="warning"
                title="İşlem uyarısı"
                message="İşlem uyarısı bir şekilde gerçekleştirildi."
                showLink={false}
            /> */}
            <div
                className={`${loading ? 'pointer-events-none' : ''}`}
                onClick={(e) => loading && e.preventDefault()}
            >
                {children}
            </div>
        </div>
    )
}

export default LoadingContainer