export default function NoInternet() {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div
      className="font-sans min-h-screen bg-[#FFFFFF1A] flex items-center justify-center px-4"
      style={{
        background: `
        radial-gradient(ellipse at top, rgba(255, 107, 0, 0.06) 0%, transparent 50%),
        radial-gradient(ellipse at bottom right, rgba(255, 107, 0, 0.05) 0%, transparent 50%),
        rgb(0, 0, 0)
      `,
      }}
    >
      <div className="text-center max-w-md mx-auto">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.111 16.5a2.5 2.5 0 0 1 2.5 2.5m0-21C6.033 2 2 6.033 2 11m20 0c0 4.967-4.033 9-9 9m9-9H2m13.5 5.889a2.5 2.5 0 0 0-5 0"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight">
          No internet
        </h1>
        <p className="text-xl md:text-2xl font-light text-white/60 mb-8">
          please fix your broke ahh network first
        </p>

        {/* Error Details */}
        <p className="text-sm text-white/40 mb-12 font-light">
          It looks like you've lost your internet connection. Check your network and try again.
        </p>

        {/* Retry Button */}
        <button
          onClick={handleRetry}
          className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-light hover:shadow-lg transition-all duration-200 hover:from-orange-600 hover:to-orange-700"
        >
          Retry Connection
        </button>
      </div>
    </div>
  )
}
