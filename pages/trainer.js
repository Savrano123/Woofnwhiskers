import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import { useSettings } from '../context/SettingsContext';
import LeadCollectionForm from '../components/LeadCollectionForm';

export default function TrainerPage() {
  const { settings, loading } = useSettings();

  return (
    <div>
      <Head>
        <title>Hire a Pet Trainer | WoofnWhiskers</title>
        <meta name="description" content="Professional pet training services in Dwarka, New Delhi. Our certified trainers can help with obedience training, behavior modification, and more." />
      </Head>

      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton fallbackPath="/" />
        </div>

        <h1 className="text-3xl font-bold mb-6">Hire a Professional Pet Trainer</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Our Training Services</h2>
              <p className="mb-4">
                At {loading ? 'WoofnWhiskers' : settings?.general?.storeName}, we partner with certified professional trainers who specialize in positive reinforcement techniques to help your pet become a well-behaved companion.
              </p>
              <p className="mb-4">
                Whether you have a new puppy that needs basic obedience training or an older dog with behavioral issues, our trainers can create a customized program to address your specific needs.
              </p>
              <h3 className="text-lg font-semibold mt-6 mb-2">Training Programs We Offer:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Basic Obedience Training</li>
                <li>Puppy Training & Socialization</li>
                <li>Behavior Modification</li>
                <li>Leash Training</li>
                <li>House Training</li>
                <li>Advanced Commands & Tricks</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Why Choose Our Trainers?</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Certified Professionals:</strong> All our trainers are certified and experienced in modern, humane training methods.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Positive Reinforcement:</strong> We believe in reward-based training that builds a strong bond between you and your pet.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Customized Approach:</strong> Training plans tailored to your pet's specific needs and your lifestyle.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Ongoing Support:</strong> We don't just train your pet; we teach you how to maintain and build on that training.</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Training Packages</h2>
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-blue-600">Basic Package</h3>
                  <p className="text-gray-700 mb-2">4 sessions (1 hour each)</p>
                  <p className="mb-2">Perfect for puppies or dogs needing basic obedience training.</p>
                  <p className="font-semibold">Includes:</p>
                  <ul className="list-disc pl-5 mb-2">
                    <li>Sit, stay, come commands</li>
                    <li>Leash walking basics</li>
                    <li>Basic house manners</li>
                  </ul>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-blue-600">Standard Package</h3>
                  <p className="text-gray-700 mb-2">8 sessions (1 hour each)</p>
                  <p className="mb-2">Comprehensive training for dogs of any age.</p>
                  <p className="font-semibold">Includes Basic Package plus:</p>
                  <ul className="list-disc pl-5 mb-2">
                    <li>Advanced commands</li>
                    <li>Behavior modification</li>
                    <li>Public environment training</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-blue-600">Premium Package</h3>
                  <p className="text-gray-700 mb-2">12 sessions (1 hour each)</p>
                  <p className="mb-2">Our most comprehensive training program.</p>
                  <p className="font-semibold">Includes Standard Package plus:</p>
                  <ul className="list-disc pl-5 mb-2">
                    <li>Specialized training for specific issues</li>
                    <li>Advanced tricks and commands</li>
                    <li>3 months of follow-up support</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Request a Trainer</h2>
              <p className="mb-4">Fill out the form below to inquire about our training services. One of our trainers will contact you to discuss your needs and schedule a consultation.</p>
              <LeadCollectionForm source="trainer" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
