import React, { useState, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: 'eager' | 'lazy';
  quality?: number;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  quality = 80,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver>();

  // Convert to WebP format and add quality parameter
  const getOptimizedSrc = (src: string) => {
    if (!src) return '';

    // If it's an external URL, return as is
    if (src.startsWith('http') || src.startsWith('//') || src.startsWith('data:')) {
      return src;
    }

    // For local images, we can add query parameters for optimization
    // In a real app, you might want to use an image CDN or a service like Cloudinary
    return src;
  };

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.getAttribute('data-src');
            if (src) {
              img.src = getOptimizedSrc(src);
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '200px' } // Start loading images 200px before they're in the viewport
    );

    observer.observe(imgRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
    setIsLoading(false);
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      <img
        ref={imgRef}
        data-src={src}
        src={loading === 'eager' ? getOptimizedSrc(src) : ''}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } w-full h-full object-cover`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
}

// Usage example:
// <OptimizedImage
//   src="/path/to/image.jpg"
//   alt="Description"
//   width={800}
//   height={600}
//   className="rounded-lg"
// />
