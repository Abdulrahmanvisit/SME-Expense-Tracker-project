import { useState } from 'react'
import { getProfile, saveProfile } from '../services/profileService'

function getInitials(displayName) {
  const cleaned = displayName?.trim() || 'AF'
  const parts = cleaned.split(/\s+/).filter(Boolean).slice(0, 2)

  if (parts.length === 0) return 'AF'
  return parts.map((part) => part[0].toUpperCase()).join('').slice(0, 2)
}

function Profile() {
  const [profile, setProfile] = useState(() => getProfile())
  const [displayName, setDisplayName] = useState(() => getProfile().displayName)
  const [status, setStatus] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedValue = displayName.trim()
    const updatedProfile = saveProfile({
      ...profile,
      displayName: trimmedValue || profile.displayName,
    })

    setProfile(updatedProfile)
    setDisplayName(updatedProfile.displayName)
    setStatus('Profile updated successfully.')
  }

  const initials = getInitials(displayName || profile.displayName)

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
            className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-lg font-semibold text-white"
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

        <button
          type="submit"
          className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Save profile
        </button>

        {status ? <p className="mt-3 text-sm text-emerald-600">{status}</p> : null}
      </form>
    </section>
  )
}

export default Profile
