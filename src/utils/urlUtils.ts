/**
 * Generate a SEO-friendly slug from a tool name
 */
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Generate a tool URL with SEO-friendly slug
 */
export const generateToolUrl = (id: string, name: string): string => {
  const slug = generateSlug(name)
  return `/tools/${slug}`
}
