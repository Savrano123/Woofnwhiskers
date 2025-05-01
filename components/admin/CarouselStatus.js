import { useState, useEffect } from 'react';

export default function CarouselStatus() {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkStatus = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check carousel data in database
      const dbResponse = await fetch('/api/check-carousel');
      const dbData = await dbResponse.json();

      // Check carousel data on homepage (client-side)
      const homeResponse = await fetch('/api/carousel-direct');
      const homeData = await homeResponse.json();

      // Compare the data
      const isInSync = compareCarouselData(dbData.slides, homeData);

      setStatus({
        database: {
          count: dbData.count,
          latestTimestamp: dbData.latestTimestamp,
          slides: dbData.slides
        },
        homepage: {
          count: homeData.length,
          slides: homeData.map(slide => ({
            id: slide.id,
            title: slide.title,
            imageUrl: slide.imageUrl
          }))
        },
        isInSync,
        checkedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error checking carousel status:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Compare carousel data from database and homepage
  const compareCarouselData = (dbSlides, homeSlides) => {
    if (dbSlides.length !== homeSlides.length) {
      return false;
    }

    // Create maps of slides by ID for easier comparison
    const dbSlidesMap = new Map(dbSlides.map(slide => [slide.id, slide]));
    const homeSlidesMap = new Map(homeSlides.map(slide => [slide.id, slide]));

    // Check if all database slides exist on homepage
    for (const [id, dbSlide] of dbSlidesMap.entries()) {
      const homeSlide = homeSlidesMap.get(id);
      if (!homeSlide || dbSlide.imageUrl !== homeSlide.imageUrl) {
        return false;
      }
    }

    return true;
  };

  // Check status on component mount
  useEffect(() => {
    checkStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg animate-pulse">
        <p className="text-gray-500">Checking carousel status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <h3 className="text-sm font-medium text-red-800 mb-1">Error checking carousel status</h3>
        <p className="text-xs text-red-600">{error}</p>
        <button
          onClick={checkStatus}
          className="mt-2 text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  return (
    <div className={`p-4 rounded-lg ${status.isInSync ? 'bg-green-50' : 'bg-yellow-50'}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-sm font-medium ${status.isInSync ? 'text-green-800' : 'text-yellow-800'}`}>
          Carousel Status
        </h3>
        <button
          onClick={checkStatus}
          className="text-xs bg-white hover:bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-2">
        <div>
          <p className="text-xs font-medium mb-1">Database</p>
          <p className="text-xs text-gray-600">
            {status.database.count} slides
            {status.database.latestTimestamp && (
              <span className="block text-xs text-gray-500">
                Latest: {new Date(status.database.latestTimestamp).toLocaleString()}
              </span>
            )}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium mb-1">Homepage</p>
          <p className="text-xs text-gray-600">
            {status.homepage.count} slides
          </p>
        </div>
      </div>

      {!status.isInSync && (
        <div className="text-xs text-yellow-800 mb-2">
          <p className="font-medium">Homepage is out of sync with database!</p>
          <p>Please update the homepage to see the latest changes.</p>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Last checked: {new Date(status.checkedAt).toLocaleString()}
      </p>
    </div>
  );
}
