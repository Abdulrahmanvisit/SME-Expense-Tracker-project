import { format, parseISO } from 'date-fns'

function formatDate(dateString, pattern = 'dd MMM yyyy') {
  if (!dateString) return ''
  return format(parseISO(dateString), pattern)
}

export default formatDate