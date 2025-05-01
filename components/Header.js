import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const { settings, loading } = useSettings();

  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  // Track if we should ignore the next click (for dropdown toggle)
  const ignoreClickRef = useRef(false);

  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (ignoreClickRef.current) {
        ignoreClickRef.current = false;
        return;
      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServicesDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle mouse enter/leave for dropdown
  const handleMouseEnter = () => {
    // Clear any existing timeout to prevent the dropdown from closing
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setServicesDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    // Add a longer delay before closing the dropdown
    // This gives users plenty of time to move their cursor to the dropdown items
    timeoutRef.current = setTimeout(() => {
      setServicesDropdownOpen(false);
      timeoutRef.current = null;
    }, 1500); // 1.5 seconds delay
  };

  return (
    <header className="bg-white shadow-md relative z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <a className="text-2xl font-bold text-blue-600">{loading ? 'WoofnWhiskers' : settings?.general?.storeName}</a>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/pets"><a className="hover:text-blue-600">Pets</a></Link>
          <Link href="/accessories"><a className="hover:text-blue-600">Accessories</a></Link>
          <Link href="/food"><a className="hover:text-blue-600">Pet Food</a></Link>

          {/* Services Dropdown */}
          <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className="hover:text-blue-600 flex items-center"
              onClick={() => {
                ignoreClickRef.current = true;
                setServicesDropdownOpen(!servicesDropdownOpen);
              }}
            >
              Services
              <svg
                className={`ml-1 h-4 w-4 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {servicesDropdownOpen && (
              <div
                className="absolute z-50 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                onMouseEnter={() => setServicesDropdownOpen(true)} // Keep open when hovering on dropdown
                onMouseLeave={handleMouseLeave} // Use the delayed close when leaving dropdown
              >
                <Link href="/trainer">
                  <a className="block px-4 py-4 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">Hire a Trainer</a>
                </Link>
                <Link href="/daycare">
                  <a className="block px-4 py-4 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">Pet Daycare/Creche</a>
                </Link>
              </div>
            )}
          </div>

          <Link href="/blog"><a className="hover:text-blue-600">Blog</a></Link>
          <Link href="/about"><a className="hover:text-blue-600">About Us</a></Link>
          <Link href="/contact"><a className="hover:text-blue-600">Contact Us</a></Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-2">
          <Link href="/pets"><a className="block px-4 py-2 hover:bg-gray-100">Pets</a></Link>
          <Link href="/accessories"><a className="block px-4 py-2 hover:bg-gray-100">Accessories</a></Link>
          <Link href="/food"><a className="block px-4 py-2 hover:bg-gray-100">Pet Food</a></Link>

          {/* Services Section in Mobile Menu */}
          <div className="px-4 py-2 font-medium text-gray-800">Services:</div>
          <Link href="/trainer"><a className="block px-6 py-2 hover:bg-gray-100">- Hire a Trainer</a></Link>
          <Link href="/daycare"><a className="block px-6 py-2 hover:bg-gray-100">- Pet Daycare/Creche</a></Link>

          <Link href="/blog"><a className="block px-4 py-2 hover:bg-gray-100">Blog</a></Link>
          <Link href="/about"><a className="block px-4 py-2 hover:bg-gray-100">About Us</a></Link>
          <Link href="/contact"><a className="block px-4 py-2 hover:bg-gray-100">Contact Us</a></Link>
        </div>
      )}
    </header>
  );
}