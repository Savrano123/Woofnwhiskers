import Head from 'next/head';
import Image from 'next/image';
import { useSettings } from '../context/SettingsContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';

export default function AboutUs() {
  const { settings, loading } = useSettings();

  return (
    <div>
      <Head>
        <title>About Us | WoofnWhiskers</title>
        <meta name="description" content="Learn about WoofnWhiskers, your trusted pet shop in Dwarka, New Delhi. Our mission, values, and the team behind our pet services." />
      </Head>

      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton fallbackPath="/" />
        </div>

        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-6">About Woof & Whiskers</h1>
          <h2 className="text-xl italic text-gray-600 mb-8">Where Love Meets Paws</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg mb-4">
                Welcome to {loading ? 'WoofnWhiskers' : settings?.general?.storeName}, your neighborhood pet haven nestled in the heart of Dwarka, New Delhi!
                We're not just a pet shop – we're a family of passionate pet lovers dedicated to ensuring every furry, feathery, or scaly friend lives a happy, healthy life.
              </p>
            </div>
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/about/store-front.jpg"
                alt="WoofnWhiskers Store Front"
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
          </div>
        </section>

        <section className="mb-12 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Our Story</h2>
          <p className="text-lg mb-4">
            Hi there! I'm the proud (and slightly obsessive) human behind Woof & Whiskers. As a lifelong animal lover,
            I've always believed pets aren't just companions – they're family. When I started this journey, I wanted to create
            a space that reflected this belief. While I'm not a seasoned seller or a big business with employees, what I <em>do</em> have
            is an unwavering commitment to pets and their well-being.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">What We Do</h2>

          <ul className="list-disc pl-6 space-y-4 mb-4">
            <li className="text-lg">
              <span className="font-semibold">Ethically Sourced Puppies & Pets:</span> We <em>gather</em> puppies and pets from trusted sources,
              shelters, and rescue networks – <span className="font-bold">never from breeders</span>. Our focus is on connecting loving
              homes with pets who need them, not profit.
            </li>
            <li className="text-lg">
              <span className="font-semibold">Health-First Products:</span> From nutritious food to safe toys and grooming essentials,
              every item in our store is handpicked with your pet's health in mind.
            </li>
            <li className="text-lg">
              <span className="font-semibold">Supporting Shelters:</span> We collaborate with local shelters to donate supplies,
              raise awareness, and even host adoption drives. Every purchase you make helps us give back!
            </li>
          </ul>
        </section>

        <section className="mb-12 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Why Choose Us?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">No Breeding, Just Love</h3>
              <p className="text-gray-600">
                We stand firmly against unethical breeding practices. Our mission is to advocate for pets, not exploit them.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Small Shop, Big Heart</h3>
              <p className="text-gray-600">
                As a solo venture, we take pride in offering personalized care and advice. Need help choosing the right food? Just ask!
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Community-Driven</h3>
              <p className="text-gray-600">
                Dwarka is our home, and we're passionate about building a pet-loving community here. Follow us for tips, events, and heartwarming adoption stories.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Join Our Paw-some Mission</h2>
          <p className="text-lg mb-4">
            Whether you're a proud pet parent or looking to adopt your first furry friend, Woof & Whiskers is here to guide you.
            Together, let's make the world a kinder place for animals – one wagging tail and gentle purr at a time.
          </p>
          <p className="text-lg italic">
            Thank you for trusting us with your pet's happiness. See you soon!
          </p>
          <p className="text-lg font-semibold mt-4">
            🐾 The Woof & Whiskers Family
          </p>
        </section>

        <section className="mb-12 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Visit Us</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">Store Location</h3>
              <address className="not-italic mb-4">
                <p className="mb-1">{loading ? 'WoofnWhiskers' : settings?.general?.storeName}</p>
                <p className="mb-1">{loading ? 'Sector 12, Dwarka' : settings?.general?.storeAddress}</p>
                <p>New Delhi, India</p>
              </address>

              <h3 className="text-xl font-semibold mb-3 mt-6">Contact Information</h3>
              <p className="mb-1">
                <strong>Phone:</strong>{' '}
                {loading ? (
                  <a href="tel:+911234567890" className="text-blue-600 hover:underline">+91 123 456 7890</a>
                ) : (
                  settings?.general?.storePhones?.filter(phone => phone).map((phone, index) => (
                    <span key={index}>
                      {index > 0 && ', '}
                      <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-blue-600 hover:underline">{phone}</a>
                    </span>
                  ))
                )}
              </p>
              <p className="mb-4">
                <strong>Email:</strong>{' '}
                <a
                  href={`mailto:${loading ? 'info@woofnwhiskers.com' : settings?.general?.storeEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {loading ? 'info@woofnwhiskers.com' : settings?.general?.storeEmail}
                </a>
              </p>

              <h3 className="text-xl font-semibold mb-3">Business Hours</h3>
              <ul className="space-y-1">
                {loading ? (
                  <>
                    <li>Monday - Friday: 10:00 AM - 8:00 PM</li>
                    <li>Saturday: 10:00 AM - 6:00 PM</li>
                    <li>Sunday: 11:00 AM - 5:00 PM</li>
                  </>
                ) : (
                  settings?.general?.businessHours?.split('\n').map((line, index) => (
                    <li key={index}>{line}</li>
                  ))
                )}
              </ul>
            </div>

            <div className="relative h-64 md:h-full rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/about/store-interior.jpg"
                alt="WoofnWhiskers Store Interior"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

