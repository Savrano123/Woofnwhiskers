import { useState, useEffect } from 'react';

export default function StaticImage({ src, fallbackSrc, alt, className, style, ...props }) {
  // Determine the appropriate fallback based on the context
  const defaultFallback = src && src.includes('/pets/')
    ? '/images/placeholder-pet.jpg'
    : (src && src.includes('/carousel/')
      ? '/images/carousel/default.jpg'
      : '/images/placeholder-product.jpg');

  const [imgSrc, setImgSrc] = useState(fallbackSrc || defaultFallback);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Pre-check if the image exists
  useEffect(() => {
    if (src && !hasError) {
      // Create a new Image object to check if the image loads
      const img = new Image();
      img.onload = () => {
        setImgSrc(src);
        setIsLoading(false);
      };
      img.onerror = () => {
        console.log(`Static image failed to load during pre-check: ${src}, using fallback: ${fallbackSrc || defaultFallback}`);
        setImgSrc(fallbackSrc || defaultFallback);
        setHasError(true);
        setIsLoading(false);
      };
      img.src = src;
    } else {
      setIsLoading(false);
    }
  }, [src, fallbackSrc, defaultFallback, hasError]);

  const handleError = () => {
    if (!hasError) {
      console.log(`Static image failed to load: ${src}, using fallback: ${fallbackSrc || defaultFallback}`);
      setImgSrc(fallbackSrc || defaultFallback);
      setHasError(true);
    }
  };

  return (
    <>
      {isLoading && (
        <div className={className} style={{
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style
        }}>
          <div>Loading...</div>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt || 'Image'}
        onError={handleError}
        className={className}
        style={{
          objectFit: 'cover',
          display: isLoading ? 'none' : 'block',
          ...style
        }}
        {...props}
      />
    </>
  );
}
