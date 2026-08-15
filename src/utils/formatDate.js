import { format, parseISO, isValid } from "date-fns";

function formatDate(dateString, pattern = "dd MMM yyyy") {
  if (!dateString) return "";
  const parsed = parseISO(dateString);
  if (!isValid(parsed)) return "";
  return format(parsed, pattern);
}

export default formatDate;
