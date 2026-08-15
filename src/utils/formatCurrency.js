function formatCurrency(amount) {
  return `₦${Number(amount).toLocaleString()}`;
}

export default formatCurrency;
