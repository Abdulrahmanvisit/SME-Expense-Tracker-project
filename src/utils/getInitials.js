function getInitials(displayName) {
  const cleaned = typeof displayName === "string" ? displayName.trim() : "";

  if (!cleaned) return "AF";

  const parts = cleaned.split(/\s+/).filter(Boolean).slice(0, 2);
  if (parts.length === 0) return "AF";

  return parts
    .map((part) => part[0].toUpperCase())
    .join("")
    .slice(0, 2);
}

export default getInitials;
