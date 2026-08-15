import categories from '../data/categories'

function getCategoryLabel(categoryId) {
  return categories.find((c) => c.id === categoryId)?.label ?? 'Uncategorized'
}

export default getCategoryLabel