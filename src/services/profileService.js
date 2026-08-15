const STORAGE_KEY = "profile";

const defaultProfile = {
  businessName: "Ledgerly",
  displayName: "AF",
  accentColor: "indigo",
};

const validAccentColors = ["indigo", "emerald", "amber", "rose", "slate"];

function getProfile() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...defaultProfile };

    const parsed = JSON.parse(stored);
    const nextAccentColor = validAccentColors.includes(parsed?.accentColor)
      ? parsed.accentColor
      : defaultProfile.accentColor;

    return {
      ...defaultProfile,
      ...parsed,
      displayName:
        typeof parsed?.displayName === "string" && parsed.displayName.trim()
          ? parsed.displayName.trim()
          : defaultProfile.displayName,
      accentColor: nextAccentColor,
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
      accentColor: validAccentColors.includes(profile?.accentColor)
        ? profile.accentColor
        : defaultProfile.accentColor,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProfile));
    return nextProfile;
  } catch {
    return { ...defaultProfile };
  }
}

export { getProfile, saveProfile, defaultProfile, validAccentColors };
