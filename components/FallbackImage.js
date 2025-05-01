import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function FallbackImage({ src, fallbackSrc, alt, ...props }) {
  const [imgSrc, setImgSrc] = useState(fallbackSrc || '/images/placeholder-product.jpg');
  const [hasError, setHasError] = useState(false);

  // Use useEffect to set the image source after component mounts
  useEffect(() => {
    // If src is valid and we haven't had an error yet, try to use it
    if (src && !hasError) {
      setImgSrc(src);
    }
  }, [src, hasError]);

  const handleError = () => {
    if (!hasError) {
      console.log(`Image failed to load: ${src}, using fallback: ${fallbackSrc}`);
      setImgSrc(fallbackSrc || '/images/placeholder-product.jpg');
      setHasError(true);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt || 'Image'}
      onError={handleError}
      unoptimized={true} // Disable image optimization for this image
      {...props}
    />
  );
}
