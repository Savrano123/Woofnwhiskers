export default function FilterSidebar({
  filters,
  activeFilters,
  onFilterChange
}) {
  const renderFilterGroup = (groupName, options, filterKey) => {
    // Check if options is defined and is an array
    if (!options || !Array.isArray(options) || options.length === 0) {
      return null;
    }

    return (
      <div className="mb-4">
        <h3 className="font-medium mb-2">{groupName}</h3>
        {options.map(option => {
          // Safely handle different option formats
          const optionId = option && typeof option === 'object' && 'id' in option ? option.id :
                          typeof option === 'string' ? option : String(option);

          const optionLabel = option && typeof option === 'object' && 'label' in option ? option.label :
                             typeof option === 'string' ? option : String(option);

          return (
            <div key={optionId} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`${filterKey}-${optionId}`}
                checked={activeFilters[filterKey]?.includes(optionId) || false}
                onChange={() => onFilterChange(filterKey, optionId)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`${filterKey}-${optionId}`} className="ml-2 text-gray-700">
                {optionLabel}
              </label>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="md:w-1/4">
      <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>

        {filters && Array.isArray(filters) && filters.map((filter, index) => (
          <div key={filter.key || index}>
            {renderFilterGroup(
              filter.name,
              filter.options,
              filter.key
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
