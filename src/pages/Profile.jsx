import { useMemo, useState } from 'react'
import { getProfile, saveProfile, validAccentColors } from '../services/profileService'
import getInitials from '../utils/getInitials'

const accentStyles = {
  indigo: 'bg-indigo-600 text-white',
  emerald: 'bg-emerald-600 text-white',
  amber: 'bg-amber-500 text-slate-900',
  rose: 'bg-rose-500 text-white',
  slate: 'bg-slate-700 text-white',
}

function Profile() {
  const [profile, setProfile] = useState(() => getProfile())
  const [displayName, setDisplayName] = useState(() => getProfile().displayName)
  const [accentColor, setAccentColor] = useState(() => getProfile().accentColor)
  const [status, setStatus] = useState('')

  const initials = useMemo(() => getInitials(displayName || profile.displayName), [displayName, profile.displayName])

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedValue = displayName.trim()
    const updatedProfile = saveProfile({
      ...profile,
      displayName: trimmedValue || profile.displayName,
      accentColor,
    })

    setProfile(updatedProfile)
    setDisplayName(updatedProfile.displayName)
    setAccentColor(updatedProfile.accentColor)
    setStatus('Profile updated successfully.')
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your public business profile.</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-4">
          <div
            role="img"
            aria-label={`Profile avatar for ${profile.businessName}`}
            className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold ${accentStyles[profile.accentColor] || accentStyles.indigo}`}
          >
            {initials}
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Business</p>
            <h2 className="text-xl font-semibold text-slate-900">{profile.businessName}</h2>
            <p className="text-sm text-slate-500">Display name: {profile.displayName}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="space-y-2">
          <label htmlFor="display-name" className="block text-sm font-medium text-slate-700">
            Display name
          </label>
          <input
            id="display-name"
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Enter your display name"
            aria-label="Display name"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium text-slate-700">Avatar accent</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {validAccentColors.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`Use ${color} accent color`}
                onClick={() => setAccentColor(color)}
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-semibold ${
                  accentColor === color ? 'border-slate-900 ring-2 ring-slate-200' : 'border-transparent'
                } ${accentStyles[color]}`}
              >
                {getInitials(displayName || profile.displayName)}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="mt-5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Save profile
        </button>

        {status ? <p className="mt-3 text-sm text-emerald-600">{status}</p> : null}
      </form>
    </section>
  )
}

export default Profile
