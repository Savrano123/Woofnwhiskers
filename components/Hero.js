import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative bg-blue-50 py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Pet Companion</h1>
          <p className="text-lg mb-6">
            Discover a wide selection of pets, accessories, and food at WoofnWhiskers in Dwarka, New Delhi.
          </p>
          <div className="flex space-x-4">
            <Link href="/pets">
              <a className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                Browse Pets
              </a>
            </Link>
            <Link href="/contact">
              <a className="bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition">
                Contact Us
              </a>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="relative h-64 md:h-96 w-full">
            <Image
              src="/images/hero-pets.jpg"
              alt="Happy pets"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}