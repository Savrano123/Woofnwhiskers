import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import { useSettings } from '../context/SettingsContext';
import LeadCollectionForm from '../components/LeadCollectionForm';

export default function DaycarePage() {
  const { settings, loading } = useSettings();

  return (
    <div>
      <Head>
        <title>Pet Daycare & Creche | WoofnWhiskers</title>
        <meta name="description" content="Professional pet daycare and creche services in Dwarka, New Delhi. Safe, fun, and supervised environment for your pets while you're away." />
      </Head>

      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton fallbackPath="/" />
        </div>

        <h1 className="text-3xl font-bold mb-6">Pet Daycare & Creche Services</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Our Daycare Services</h2>
              <p className="mb-4">
                At {loading ? 'WoofnWhiskers' : settings?.general?.storeName}, we understand that your pets are family members who deserve the best care even when you're away. Our pet daycare provides a safe, fun, and supervised environment where your pets can socialize, play, and receive the attention they need.
              </p>
              <p className="mb-4">
                Whether you need regular daycare while you're at work, occasional care for appointments, or extended boarding for vacations, we have flexible options to meet your needs.
              </p>
              <h3 className="text-lg font-semibold mt-6 mb-2">Daycare Features:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Supervised play areas for dogs of all sizes</li>
                <li>Comfortable resting areas</li>
                <li>Regular outdoor walks (for dogs)</li>
                <li>Feeding according to your pet's schedule</li>
                <li>Basic grooming services</li>
                <li>Regular updates and photos of your pet</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Why Choose Our Daycare?</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Trained Staff:</strong> Our team consists of pet lovers with training in animal care and behavior.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Clean Environment:</strong> We maintain strict cleanliness standards to ensure a healthy space for all pets.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Personalized Care:</strong> We follow your pet's routine and special requirements.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Peace of Mind:</strong> Regular updates and the ability to check in on your pet anytime.</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Daycare Packages</h2>
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-blue-600">Half-Day Care</h3>
                  <p className="text-gray-700 mb-2">Up to 5 hours</p>
                  <p className="mb-2">Perfect for short workdays or appointments.</p>
                  <p className="font-semibold">Includes:</p>
                  <ul className="list-disc pl-5 mb-2">
                    <li>Supervised play time</li>
                    <li>One meal (if scheduled during meal time)</li>
                    <li>One outdoor walk (for dogs)</li>
                  </ul>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-blue-600">Full-Day Care</h3>
                  <p className="text-gray-700 mb-2">Up to 10 hours</p>
                  <p className="mb-2">Ideal for regular workdays.</p>
                  <p className="font-semibold">Includes Half-Day Care plus:</p>
                  <ul className="list-disc pl-5 mb-2">
                    <li>Additional meal (if needed)</li>
                    <li>Additional walks</li>
                    <li>Rest period in comfortable quarters</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-blue-600">Extended Boarding</h3>
                  <p className="text-gray-700 mb-2">Overnight and multi-day stays</p>
                  <p className="mb-2">For when you need to be away overnight or longer.</p>
                  <p className="font-semibold">Includes Full-Day Care plus:</p>
                  <ul className="list-disc pl-5 mb-2">
                    <li>Comfortable sleeping arrangements</li>
                    <li>Evening and morning routines</li>
                    <li>Daily photo updates</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Book Daycare Services</h2>
              <p className="mb-4">Fill out the form below to inquire about our daycare services. We'll contact you to discuss your pet's needs and schedule a visit to our facility.</p>
              <LeadCollectionForm source="daycare" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
