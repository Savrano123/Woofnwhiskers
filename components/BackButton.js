import { useRouter } from 'next/router';

export default function BackButton({ fallbackPath = '/', className = '' }) {
  const router = useRouter();
  
  const handleBack = () => {
    // Try to go back in history first
    if (window.history.length > 1) {
      router.back();
    } else {
      // If no history, go to fallback path
      router.push(fallbackPath);
    }
  };
  
  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors ${className}`}
      aria-label="Go back"
    >
      <svg 
        className="w-5 h-5 mr-2" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M10 19l-7-7m0 0l7-7m-7 7h18" 
        />
      </svg>
      Back
    </button>
  );
}
