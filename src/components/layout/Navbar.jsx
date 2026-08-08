function Navbar({ isSidebarOpen, onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-expanded={isSidebarOpen}
            aria-controls="app-sidebar"
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 md:hidden"
          >
            <span className="text-2xl leading-none">{isSidebarOpen ? '✕' : '☰'}</span>
          </button>

          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Ledger <span className="text-indigo-600">ly</span>
          </span>
        </div>

        <div
          role="img"
          aria-label="Signed in user avatar"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white"
        >
          AF
        </div>
      </div>
    </header>
  )
}

export default Navbar