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
  const siteTitle = 'Louder Fellowship - Rehoboth Discipleship Global Ministries';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDescription = 'Official website for Louder Fellowship and Rehoboth Discipleship Global Ministries led by Prophet Ezekiel Kayondo. God speaks LOUDER.';
  const metaDescription = description || defaultDescription;
  const defaultKeywords = 'Rehoboth, discipleship, global ministries, Prophet Ezekiel Kayondo, Louder Fellowship, prophetic ministry, church Kampala Uganda, soul winning, equipping saints, Christian ministry, born again fellowship';
  const metaKeywords = keywords || defaultKeywords;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={ogType} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
};

export default SEO;
