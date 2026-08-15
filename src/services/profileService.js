const STORAGE_KEY = "profile";

const defaultProfile = {
  businessName: "Ledgerly",
  displayName: "AF",
};

function getProfile() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...defaultProfile };

    const parsed = JSON.parse(stored);
    return {
      ...defaultProfile,
      ...parsed,
      displayName:
        typeof parsed?.displayName === "string" && parsed.displayName.trim()
          ? parsed.displayName.trim()
          : defaultProfile.displayName,
    };
  } catch {
    return { ...defaultProfile };
  }
}

function saveProfile(profile) {
  try {
    const nextProfile = {
      ...defaultProfile,
      ...profile,
      displayName:
        typeof profile?.displayName === "string" && profile.displayName.trim()
          ? profile.displayName.trim()
          : defaultProfile.displayName,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProfile));
    return nextProfile;
  } catch {
    return { ...defaultProfile };
  }
}

export { getProfile, saveProfile, defaultProfile };
