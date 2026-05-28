import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords, 
  ogImage, 
  ogType = 'website' 
}) => {
  const siteTitle = 'Louder Fellowship - Rehoboth Ministries';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDescription = 'Official website for Louder Fellowship and Rehoboth Discipleship Global Ministries led by Prophet Ezekiel Kayondo. God speaks LOUDER.';
  const metaDescription = description || defaultDescription;
  const defaultKeywords = 'Rehoboth, Louder Fellowship, children ministry, children\'s church, Prophet Ezekiel Kayondo, devotions, testimonies, Christian ministry, discipleship';
  const metaKeywords = keywords || defaultKeywords;
  const siteUrl = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : 'https://louderfellowship.org';
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={siteUrl + (title ? `/${title.replace(/\s+/g,'-').toLowerCase()}` : '/') } />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="en_US" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:site" content="@LouderFellowship" />
      <meta name="twitter:creator" content="@ProphetEzekiel" />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {/* Structured data */}
      <script type="application/ld+json">
        {`{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "name": "Louder Fellowship & Rehoboth Ministries",
              "url": "${siteUrl}",
              "logo": "${siteUrl}/logo.png",
              "sameAs": ["https://facebook.com/louderfellowship","https://twitter.com/louderfellowship"]
            },
            {
              "@type": "WebSite",
              "url": "${siteUrl}",
              "name": "${siteTitle}",
              "description": "${metaDescription}",
              "publisher": {"@type": "Organization","name":"Louder Fellowship"}
            }
          ]
        }`}
      </script>
    </Helmet>
  );
};

export default SEO;
