import React from 'react';
import { OptimizedImage } from './OptimizedImage';

export function HeroImage({
  src,
  alt,
  className = '',
  priority = false,
  sizes = '100vw',
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>) {
  // In a production environment, you would generate different image sizes
  // and use the srcset attribute for responsive images
  // For now, we'll use the OptimizedImage component we created earlier

  return (
    <div className={`relative w-full ${className}`}>
      <OptimizedImage
        src={src}
        alt={alt}
        width={1920}
        height={1080}
        className="w-full h-auto max-h-[80vh] object-cover"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        {...props}
      />
    </div>
  );
}
