import { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SearchBar from '../../components/SearchBar';
import PageHeader from '../../components/PageHeader';
import PetGrid from '../../components/PetGrid';
import FilterSidebar from '../../components/FilterSidebar';

export default function PetsPage({ pets }) {
  const [filteredPets, setFilteredPets] = useState(pets);
  const [activeFilters, setActiveFilters] = useState({
    species: [],
    gender: []
  });

  const handleSearch = (query, category) => {
    if (!query.trim()) {
      setFilteredPets(pets);
      return;
    }

    const searchTerms = query.toLowerCase().split(' ');
    const filtered = pets.filter(pet => {
      const matchesSearch = searchTerms.some(term =>
        pet.name.toLowerCase().includes(term) ||
        pet.breed.toLowerCase().includes(term) ||
        pet.species.toLowerCase().includes(term) ||
        pet.description.toLowerCase().includes(term)
      );
      return matchesSearch;
    });

    setFilteredPets(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };

      if (newFilters[filterType].includes(value)) {
        // Remove filter if already active
        newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
      } else {
        // Add filter
        newFilters[filterType] = [...newFilters[filterType], value];
      }

      return newFilters;
    });
  };

  // Apply filters
  const displayedPets = filteredPets.filter(pet => {
    // If no filters are active for a category, include all pets
    const speciesMatch = activeFilters.species.length === 0 ||
                         activeFilters.species.includes(pet.species);
    const genderMatch = activeFilters.gender.length === 0 ||
                        activeFilters.gender.includes(pet.gender);

    return speciesMatch && genderMatch;
  });

  // Get unique species and genders for filter options
  const uniqueSpecies = [...new Set(pets.map(pet => pet.species))];
  const uniqueGenders = [...new Set(pets.map(pet => pet.gender))];

  return (
    <div>
      <Head>
        <title>Pets for Adoption - WoofnWhiskers Dwarka</title>
        <meta name="description" content="Browse our selection of pets available for adoption at WoofnWhiskers in Dwarka, New Delhi" />
      </Head>

      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <PageHeader title="Pets for Adoption" fallbackPath="/" />

        <SearchBar onSearch={handleSearch} />

        <div className="flex flex-col md:flex-row gap-8 mt-8">
          {/* Filters */}
          <FilterSidebar
            filters={[
              {
                name: 'Species',
                key: 'species',
                options: uniqueSpecies
              },
              {
                name: 'Gender',
                key: 'gender',
                options: uniqueGenders
              }
            ]}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />

          {/* Pet Listings */}
          <div className="md:w-3/4">
            <PetGrid pets={displayedPets} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  // Fetch pets from the API
  let pets = [];

  try {
    // Use the database directly in getStaticProps
    const { db } = require('../../lib/db');
    pets = db.getAll('pets') || [];

    // If no pets found, use default data
    if (pets.length === 0) {
      pets = [
        {
          id: 1,
          name: 'Max',
          species: 'Dog',
          breed: 'Golden Retriever',
          age: '2 years',
          gender: 'Male',
          description: 'Max is a friendly and energetic Golden Retriever who loves to play fetch and go for long walks. He is great with children and other pets.',
          price: 15000,
          imageUrl: '/images/pets/max.jpg',
          createdAt: new Date().toISOString(),
          status: 'Available'
        },
        {
          id: 2,
          name: 'Bella',
          species: 'Dog',
          breed: 'Labrador',
          age: '1 year',
          gender: 'Female',
          description: 'Bella is a sweet and gentle Labrador who enjoys cuddling and playing with toys. She is well-trained and gets along with everyone.',
          price: 12000,
          imageUrl: '/images/pets/max.jpg',
          createdAt: new Date().toISOString(),
          status: 'Available'
        },
        {
          id: 3,
          name: 'Charlie',
          species: 'Cat',
          breed: 'Persian',
          age: '3 years',
          gender: 'Male',
          description: 'Charlie is a calm and affectionate Persian cat who loves to lounge around and be petted. He is litter-trained and very clean.',
          price: 8000,
          imageUrl: '/images/pets/max.jpg',
          createdAt: new Date().toISOString(),
          status: 'Available'
        },
        {
          id: 4,
          name: 'Luna',
          species: 'Cat',
          breed: 'Siamese',
          age: '2 years',
          gender: 'Female',
          description: 'Luna is a curious and playful Siamese cat who enjoys exploring and interactive toys. She is very vocal and will keep you entertained.',
          price: 10000,
          imageUrl: '/images/pets/max.jpg',
          createdAt: new Date().toISOString(),
          status: 'Available'
        },
      ];
    }
  } catch (error) {
    console.error('Error fetching pets:', error);
    // Use default data if there's an error
    pets = [
      {
        id: 1,
        name: 'Max',
        species: 'Dog',
        breed: 'Golden Retriever',
        age: '2 years',
        gender: 'Male',
        description: 'Max is a friendly and energetic Golden Retriever who loves to play fetch and go for long walks. He is great with children and other pets.',
        price: 15000,
        imageUrl: '/images/pets/max.jpg',
        createdAt: new Date().toISOString(),
        status: 'Available'
      },
      {
        id: 2,
        name: 'Bella',
        species: 'Dog',
        breed: 'Labrador',
        age: '1 year',
        gender: 'Female',
        description: 'Bella is a sweet and gentle Labrador who enjoys cuddling and playing with toys. She is well-trained and gets along with everyone.',
        price: 12000,
        imageUrl: '/images/pets/max.jpg',
        createdAt: new Date().toISOString(),
        status: 'Available'
      },
    ];
  }

  return {
    props: {
      pets
    },
    revalidate: 60 // Revalidate every minute to quickly reflect changes
  };
}
