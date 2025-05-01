import { useState } from 'react';

export default function RevalidateButton() {
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [result, setResult] = useState(null);

  const handleRevalidate = async () => {
    setIsRevalidating(true);
    setResult(null);

    try {
      // Use the revalidate-isr endpoint
      const response = await fetch('/api/revalidate-isr?secret=my_secret_token&all=true');

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      setResult({
        success: data.success,
        message: data.message,
        timestamp: data.timestamp,
        details: data.details
      });

      // If successful, add a note to refresh the homepage
      if (data.success) {
        console.log('Cache cleared successfully. Please refresh the homepage to see changes.');
      }
    } catch (error) {
      console.error('Error revalidating homepage:', error);
      setResult({
        success: false,
        message: 'Error clearing cache',
        error: error.message
      });
    } finally {
      setIsRevalidating(false);
    }
  };

  return (
    <div className="mb-6">
      <button
        onClick={handleRevalidate}
        disabled={isRevalidating}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
      >
        {isRevalidating ? 'Updating...' : 'Update Homepage'}
      </button>

      {result && (
        <div className={`mt-2 p-3 rounded text-sm ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p className="font-medium">{result.success ? 'Success!' : 'Error!'}</p>
          <p>{result.message}</p>
          {result.timestamp && <p className="text-xs mt-1">Updated at: {new Date(result.timestamp).toLocaleTimeString()}</p>}
          {result.details && (
            <p className="text-xs mt-1">
              Updated {result.details.successfulPaths} of {result.details.totalPaths} pages
              {result.details.failedPaths > 0 && ` (${result.details.failedPaths} failed)`}
            </p>
          )}
          {result.error && <p className="text-xs mt-1">Error: {result.error}</p>}
        </div>
      )}
    </div>
  );
}
