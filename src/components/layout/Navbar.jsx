import { getProfile } from '../../services/profileService'
import getInitials from '../../utils/getInitials'

const accentStyles = {
  indigo: 'bg-indigo-600 text-white',
  emerald: 'bg-emerald-600 text-white',
  amber: 'bg-amber-500 text-slate-900',
  rose: 'bg-rose-500 text-white',
  slate: 'bg-slate-700 text-white',
}

function Navbar({ isSidebarOpen, onToggleSidebar }) {
  const profile = getProfile()
  const initials = getInitials(profile.displayName)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between gap-3 px-3 sm:px-4 md:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-expanded={isSidebarOpen}
            aria-controls="app-sidebar"
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 md:hidden"
          >
            <span className="text-2xl leading-none">{isSidebarOpen ? '✕' : '☰'}</span>
          </button>

          <span className="truncate text-sm font-semibold tracking-tight text-slate-900 sm:text-lg">
            Ledger <span className="text-indigo-600">ly</span>
          </span>
        </div>

        <div
          role="img"
          aria-label={`Profile avatar for ${profile.businessName}`}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${accentStyles[profile.accentColor] || accentStyles.indigo}`}
        >
          {initials}
        </div>
      </div>
    </header>
  )
}

export default Navbar