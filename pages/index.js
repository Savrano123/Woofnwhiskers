import Head from 'next/head';
import { useState, useEffect } from 'react';

// Components
import Header from '../components/Header';
import Carousel from '../components/Carousel';
import PetShowcase from '../components/PetShowcase';
import ProductShowcase from '../components/ProductShowcase';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';
import LeadCollectionForm from '../components/LeadCollectionForm';

export default function Home({ featuredPets, featuredProducts, initialCarouselSlides }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [carouselSlides, setCarouselSlides] = useState(initialCarouselSlides || []);
  const [isLoadingCarousel, setIsLoadingCarousel] = useState(false);

  // Fetch carousel slides on the client side
  useEffect(() => {
    const fetchCarouselSlides = async () => {
      setIsLoadingCarousel(true);
      try {
        // Use the direct API endpoint to bypass any caching
        const response = await fetch('/api/carousel-direct');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched carousel slides on client side:', data);
          if (data && data.length > 0) {
            setCarouselSlides(data);
          }
        }
      } catch (error) {
        console.error('Error fetching carousel slides:', error);
      } finally {
        setIsLoadingCarousel(false);
      }
    };

    fetchCarouselSlides();
  }, []);

  return (
    <div>
      <Head>
        <title>WoofnWhiskers - Dwarka, New Delhi</title>
        <meta name="description" content="Find your perfect pet companion and accessories at WoofnWhiskers in Dwarka, New Delhi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <Carousel slides={carouselSlides} isLoading={isLoadingCarousel} />
        <SearchBar onSearch={setSearchQuery} />
        <PetShowcase pets={featuredPets} />
        <ProductShowcase products={featuredProducts} />
        <LeadCollectionForm />
      </main>

      <Footer />
    </div>
  );
}

// This would be replaced with actual API calls
export async function getStaticProps() {
  // Fetch settings
  let settings = null;
  try {
    // In a real production environment, we would use an absolute URL
    // For local development, we'll use the Node.js API directly
    const { db } = require('../lib/db');
    const settingsData = db.getAll('settings');

    if (settingsData && settingsData.length > 0) {
      settings = settingsData[0];
    } else {
      // Default settings if none exist
      settings = {
        general: {
          storeName: 'WoofnWhiskers',
          storeAddress: 'Sector 12, Dwarka, New Delhi',
          storePhones: ['+91 123 456 7890'],
          storeEmail: 'info@woofnwhiskers.com',
          businessHours: 'Monday - Friday: 10:00 AM - 8:00 PM\nSaturday: 10:00 AM - 6:00 PM\nSunday: 11:00 AM - 5:00 PM'
        },
        social: {
          facebook: 'https://facebook.com/woofnwhiskers',
          instagram: 'https://instagram.com/woofnwhiskers',
          twitter: '',
          youtube: ''
        },
        notifications: {
          emailNotifications: true,
          smsNotifications: false,
          newLeadNotifications: true,
          orderNotifications: true
        }
      };
    }
  } catch (error) {
    console.error('Error fetching settings:', error);
  }

  // Fetch real data from the API
  let featuredPets = [];
  let featuredProducts = [];

  try {
    // Fetch pets from the API
    const { db } = require('../lib/db');
    const allPets = db.getAll('pets') || [];

    // Sort by newest first and take the first 4
    featuredPets = allPets
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4)
      .map(pet => ({
        id: pet.id,
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        imageUrl: pet.imageUrl || '/images/pets/max.jpg'
      }));

    // If no pets found, use default data
    if (featuredPets.length === 0) {
      featuredPets = [
        { id: 1, name: 'Max', species: 'Dog', breed: 'Golden Retriever', age: '2 years', imageUrl: '/images/pets/max.jpg' },
        { id: 2, name: 'Bella', species: 'Dog', breed: 'Labrador', age: '1 year', imageUrl: '/images/pets/max.jpg' },
        { id: 3, name: 'Charlie', species: 'Cat', breed: 'Persian', age: '3 years', imageUrl: '/images/pets/max.jpg' },
        { id: 4, name: 'Luna', species: 'Cat', breed: 'Siamese', age: '2 years', imageUrl: '/images/pets/max.jpg' }
      ];
    }

    // Fetch products from the API
    const allProducts = db.getAll('products') || [];

    // Sort by newest first and take the first 4
    featuredProducts = allProducts
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4)
      .map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        imageUrl: product.imageUrl || '/images/products/pet-bed.jpg'
      }));

    // If no products found, use default data
    if (featuredProducts.length === 0) {
      featuredProducts = [
        { id: 1, name: 'Deluxe Pet Bed', category: 'Accessories', price: 1200, imageUrl: '/images/products/pet-bed.jpg' },
        { id: 2, name: 'Premium Dog Food', category: 'Food', price: 800, imageUrl: '/images/products/pet-bed.jpg' },
        { id: 3, name: 'Cat Scratching Post', category: 'Accessories', price: 1500, imageUrl: '/images/products/pet-bed.jpg' },
        { id: 4, name: 'Pet Grooming Kit', category: 'Accessories', price: 2000, imageUrl: '/images/products/pet-bed.jpg' }
      ];
    }
  } catch (error) {
    console.error('Error fetching featured items:', error);
    // Use default data if there's an error
    featuredPets = [
      { id: 1, name: 'Max', species: 'Dog', breed: 'Golden Retriever', age: '2 years', imageUrl: '/images/pets/max.jpg' },
      { id: 2, name: 'Bella', species: 'Dog', breed: 'Labrador', age: '1 year', imageUrl: '/images/pets/max.jpg' },
      { id: 3, name: 'Charlie', species: 'Cat', breed: 'Persian', age: '3 years', imageUrl: '/images/pets/max.jpg' },
      { id: 4, name: 'Luna', species: 'Cat', breed: 'Siamese', age: '2 years', imageUrl: '/images/pets/max.jpg' }
    ];

    featuredProducts = [
      { id: 1, name: 'Deluxe Pet Bed', category: 'Accessories', price: 1200, imageUrl: '/images/products/pet-bed.jpg' },
      { id: 2, name: 'Premium Dog Food', category: 'Food', price: 800, imageUrl: '/images/products/pet-bed.jpg' },
      { id: 3, name: 'Cat Scratching Post', category: 'Accessories', price: 1500, imageUrl: '/images/products/pet-bed.jpg' },
      { id: 4, name: 'Pet Grooming Kit', category: 'Accessories', price: 2000, imageUrl: '/images/products/pet-bed.jpg' }
    ];
  }

  // Get carousel slides from database
  let carouselSlides = [];
  try {
    // Import db here to ensure it's defined
    const { db } = require('../lib/db');
    const allSlides = db.getAll('carousel') || [];
    console.log('Fetched carousel slides from database:', allSlides);

    // Use slides from database if available
    if (allSlides.length > 0) {
      carouselSlides = allSlides;
      console.log('Using carousel slides from database');
    } else {
      console.log('No carousel slides found in database, using defaults');
      // Default slides if none in database
      carouselSlides = [
        {
          title: 'Find Your Perfect Pet Companion',
          description: 'Discover a wide selection of pets, accessories, and food at WoofnWhiskers in Dwarka, New Delhi.',
          imageUrl: '/images/carousel/1744911020606.jpg',
          buttonText: 'Browse Pets',
          buttonLink: '/pets',
          secondaryButtonText: 'Contact Us',
          secondaryButtonLink: '/contact'
        },
        {
          title: 'Premium Pet Accessories',
          description: 'High-quality beds, toys, and more to keep your pets happy and comfortable.',
          imageUrl: '/images/carousel/1744911735908.jpg',
          buttonText: 'Shop Accessories',
          buttonLink: '/accessories'
        },
        {
          title: 'Nutritious Pet Food',
          description: 'Healthy and delicious food options for all types of pets.',
          imageUrl: '/images/carousel/1744911020606.jpg',
          buttonText: 'Explore Food',
          buttonLink: '/food',
          secondaryButtonText: 'Nutrition Guide',
          secondaryButtonLink: '/nutrition'
        }
      ];
    }
  } catch (error) {
    console.error('Error fetching carousel slides:', error);
  }

  console.log('Final carousel slides being returned:', carouselSlides);

  return {
    props: {
      featuredPets,
      featuredProducts,
      initialCarouselSlides: carouselSlides,
      settings
    },
    revalidate: 60 // Revalidate every minute for other content
  };
}