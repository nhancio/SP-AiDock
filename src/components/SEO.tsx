import React, { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
}

const SEO: React.FC<SEOProps> = ({
  title = 'AiDock - Discover the Best AI Tools',
  description = 'Discover and explore the best AI tools for your needs. Browse, compare, and find the perfect AI solution for your projects.',
  keywords = 'AI tools, artificial intelligence, machine learning, automation, productivity tools',
  image = '/og-image.jpg',
  url = 'https://aidockapp.netlify.app',
  type = 'website'
}) => {
  useEffect(() => {
    // Update document title
    document.title = title

    // Helper function to update or create meta tags
    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name'
      let meta = document.querySelector(`meta[${attribute}="${property}"]`) as HTMLMetaElement
      
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attribute, property)
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    // Helper function to update or create link tags
    const updateLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement
      
      if (!link) {
        link = document.createElement('link')
        link.rel = rel
        document.head.appendChild(link)
      }
      link.href = href
    }

    // Basic Meta Tags
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)
    updateMetaTag('author', 'Nhancio Technologies Private Limited')
    
    // Open Graph / Facebook
    updateMetaTag('og:type', type, true)
    updateMetaTag('og:url', url, true)
    updateMetaTag('og:title', title, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:image', image, true)
    updateMetaTag('og:site_name', 'AiDock', true)
    
    // Twitter
    updateMetaTag('twitter:card', 'summary_large_image', true)
    updateMetaTag('twitter:url', url, true)
    updateMetaTag('twitter:title', title, true)
    updateMetaTag('twitter:description', description, true)
    updateMetaTag('twitter:image', image, true)
    
    // Mobile Optimization
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=5.0')
    updateMetaTag('theme-color', '#3B82F6')
    
    // Additional SEO
    updateMetaTag('robots', 'index, follow')
    updateMetaTag('googlebot', 'index, follow')
    
    // Canonical URL
    updateLinkTag('canonical', url)
    
    // Favicon
    updateLinkTag('icon', '/favicon.ico')
    updateLinkTag('apple-touch-icon', '/apple-touch-icon.png')
    
    // Additional favicon sizes
    const favicon32 = document.querySelector('link[rel="icon"][sizes="32x32"]') as HTMLLinkElement
    if (!favicon32) {
      const link32 = document.createElement('link')
      link32.rel = 'icon'
      link32.type = 'image/png'
      link32.sizes = '32x32'
      link32.href = '/favicon-32x32.png'
      document.head.appendChild(link32)
    }
    
    const favicon16 = document.querySelector('link[rel="icon"][sizes="16x16"]') as HTMLLinkElement
    if (!favicon16) {
      const link16 = document.createElement('link')
      link16.rel = 'icon'
      link16.type = 'image/png'
      link16.sizes = '16x16'
      link16.href = '/favicon-16x16.png'
      document.head.appendChild(link16)
    }
  }, [title, description, keywords, image, url, type])

  // This component doesn't render anything visible
  return null
}

export default SEO
