import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Carousel({ slides = [], autoplaySpeed = 5000, isLoading = false }) {
  console.log('Carousel component received slides:', slides);

  // Create default slides if none are provided
  const defaultSlides = [
    {
      title: 'Find Your Perfect Pet Companion',
      description: 'Discover a wide selection of pets, accessories, and food at WoofnWhiskers.',
      imageUrl: '/images/carousel/slide1.jpg',
      buttonText: 'Browse Pets',
      buttonLink: '/pets',
      secondaryButtonText: 'Contact Us',
      secondaryButtonLink: '/contact'
    },
    {
      title: 'Premium Pet Accessories',
      description: 'High-quality beds, toys, and more to keep your pets happy and comfortable.',
      imageUrl: '/images/carousel/slide2.jpg',
      buttonText: 'Shop Accessories',
      buttonLink: '/accessories'
    },
    {
      title: 'Nutritious Pet Food',
      description: 'Healthy and delicious food options for all types of pets.',
      imageUrl: '/images/carousel/slide3.jpg',
      buttonText: 'Explore Food',
      buttonLink: '/food',
      secondaryButtonText: 'Nutrition Guide',
      secondaryButtonLink: '/nutrition'
    }
  ];

  // Use provided slides or default slides
  const slidesToUse = slides && slides.length > 0 ? slides : defaultSlides;
  console.log('Using slides:', slidesToUse);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slideCount = slidesToUse.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // Autoplay functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoplaySpeed);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, autoplaySpeed]);

  // Pause autoplay when user interacts with carousel
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Always render something, even if no slides are provided
  if (!slidesToUse || slidesToUse.length === 0) {
    console.error('No slides available for carousel');
    return (
      <div className="bg-blue-50 p-10 text-center">
        <p className="text-gray-500">Carousel slides not available</p>
      </div>
    );
  }

  return (
    <div
      className="relative bg-blue-50 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative h-[500px] md:h-[600px]">
        {slidesToUse.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="absolute inset-0 z-0">
              <Image
                src={slide.imageUrl || '/images/carousel/slide1.jpg'}
                alt={slide.title}
                layout="fill"
                objectFit="cover"
                priority={index === 0}
                className="brightness-[0.85]"
                onError={() => {
                  console.error(`Failed to load image: ${slide.imageUrl}`);
                }}
              />
            </div>

            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-xl text-white">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                    {slide.title}
                  </h2>
                  <p className="text-lg mb-6 drop-shadow-md">
                    {slide.description}
                  </p>
                  {slide.buttonText && slide.buttonLink && (
                    <Link href={slide.buttonLink}>
                      <a className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                        {slide.buttonText}
                      </a>
                    </Link>
                  )}
                  {slide.secondaryButtonText && slide.secondaryButtonLink && (
                    <Link href={slide.secondaryButtonLink}>
                      <a className="inline-block ml-4 bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition">
                        {slide.secondaryButtonText}
                      </a>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 rounded-full p-2 backdrop-blur-sm transition-all"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 rounded-full p-2 backdrop-blur-sm transition-all"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center space-x-2">
        {slidesToUse.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white w-6'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
