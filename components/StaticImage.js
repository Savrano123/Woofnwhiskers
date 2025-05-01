import { useState, useEffect } from 'react';

export default function StaticImage({ src, fallbackSrc, alt, className, style, ...props }) {
  const [imgSrc, setImgSrc] = useState(fallbackSrc || '/images/placeholder-product.jpg');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (src && !hasError) {
      setImgSrc(src);
    }
  }, [src, hasError]);

  const handleError = () => {
    if (!hasError) {
      console.log(`Static image failed to load: ${src}, using fallback: ${fallbackSrc}`);
      setImgSrc(fallbackSrc || '/images/placeholder-product.jpg');
      setHasError(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt || 'Image'}
      onError={handleError}
      className={className}
      style={{ objectFit: 'cover', ...style }}
      {...props}
    />
  );
}
