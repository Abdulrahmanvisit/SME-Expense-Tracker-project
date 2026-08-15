function formatCurrency(amount) {
  const value = Number(amount) || 0
  return `₦${value.toLocaleString()}`
}

export default formatCurrency