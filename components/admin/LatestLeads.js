import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LatestLeads() {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        // Fetch leads from the API
        const response = await fetch('/api/leads');
        
        if (!response.ok) {
          throw new Error('Failed to fetch leads');
        }
        
        const data = await response.json();
        
        // Sort leads by creation date (newest first) and take the first 5
        const sortedLeads = data.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        }).slice(0, 5);
        
        setLeads(sortedLeads);
      } catch (error) {
        console.error('Failed to fetch leads:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeads();
  }, []);
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffMin < 1) {
      return 'Just now';
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffDay < 7) {
      return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'qualified':
        return 'bg-green-100 text-green-800';
      case 'unqualified':
        return 'bg-red-100 text-red-800';
      case 'converted':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="animate-pulse flex items-start">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (leads.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <p className="text-gray-500">No leads yet</p>
        <Link href="/admin/leads/new">
          <a className="mt-2 inline-block text-blue-600 hover:text-blue-800 font-medium">
            Add your first lead
          </a>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <Link href={`/admin/leads/${lead.id}`} key={lead.id}>
          <a className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition">
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="font-medium text-gray-900">{lead.name}</p>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(lead.status)}`}>
                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600">{lead.email}</p>
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-500">Interest: {lead.interest}</p>
                <p className="text-xs text-gray-500">{formatDate(lead.createdAt)}</p>
              </div>
            </div>
          </a>
        </Link>
      ))}
      
      <div className="pt-2 text-center">
        <Link href="/admin/leads">
          <a className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All Leads →
          </a>
        </Link>
      </div>
    </div>
  );
}
