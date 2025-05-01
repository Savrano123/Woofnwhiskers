import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/admin/AdminLayout';
import BackButton from '../../../components/BackButton';

export default function AdminLeadDetail() {
  const router = useRouter();
  const { id } = router.query;
  const isNewLead = id === 'new';

  const [lead, setLead] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'general',
    status: 'new',
    message: '',
  });

  const [isLoading, setIsLoading] = useState(!isNewLead);
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (!router.isReady) return;

    if (!isNewLead) {
      const fetchLead = async () => {
        try {
          const response = await fetch(`/api/leads/${id}`);

          if (!response.ok) {
            throw new Error('Failed to fetch lead');
          }

          const leadData = await response.json();
          setLead(leadData);

          // Mock notes
          if (id === '1') {
            setNotes([
              {
                id: 1,
                text: 'Called the customer and discussed Golden Retriever options.',
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                author: 'Admin'
              }
            ]);
          } else if (id === '2') {
            setNotes([
              {
                id: 1,
                text: 'Customer visited the store and checked out premium dog beds.',
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                author: 'Admin'
              },
              {
                id: 2,
                text: 'Followed up with email about new dog bed arrivals.',
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                author: 'Admin'
              }
            ]);
          }
        } catch (error) {
          console.error('Failed to fetch lead:', error);
          alert('Failed to load lead details');
        } finally {
          setIsLoading(false);
        }
      };

      fetchLead();
    }
  }, [router.isReady, id, isNewLead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLead(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = isNewLead ? '/api/leads' : `/api/leads/${id}`;
      const method = isNewLead ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lead),
      });

      if (!response.ok) {
        throw new Error('Failed to save lead');
      }

      // Show success message
      if (typeof window !== 'undefined') {
        window.alert(`Lead ${isNewLead ? 'created' : 'updated'} successfully`);
      }
      router.push('/admin/leads');
    } catch (error) {
      console.error('Failed to save lead:', error);
      if (typeof window !== 'undefined') {
        window.alert('Failed to save lead: ' + error.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      // This would be replaced with actual API call
      // Mock adding note
      await new Promise(resolve => setTimeout(resolve, 500));

      const newNoteObj = {
        id: notes.length + 1,
        text: newNote,
        createdAt: new Date().toISOString(),
        author: 'Admin'
      };

      setNotes(prev => [newNoteObj, ...prev]);
      setNewNote('');
    } catch (error) {
      console.error('Failed to add note:', error);
      if (typeof window !== 'undefined') {
        window.alert('Failed to add note');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <BackButton fallbackPath="/admin/leads" />
        <h1 className="text-2xl font-bold mt-2">{isNewLead ? 'Add New Lead' : 'Lead Details'}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={lead.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={lead.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={lead.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">
                  Interest
                </label>
                <select
                  id="interest"
                  name="interest"
                  value={lead.interest}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="general">General</option>
                  <option value="pets">Pets</option>
                  <option value="accessories">Accessories</option>
                  <option value="food">Food</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={lead.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={lead.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => router.push('/admin/leads')}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isSaving ? 'Saving...' : isNewLead ? 'Create Lead' : 'Update Lead'}
              </button>
            </div>
          </form>
        </div>

        {!isNewLead && (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium mb-4">Notes</h2>

              <div className="mb-4">
                <textarea
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                ></textarea>
                <button
                  type="button"
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="mt-2 w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  Add Note
                </button>
              </div>

              <div className="space-y-4">
                {notes.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No notes yet</p>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <p className="text-sm text-gray-700">{note.text}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {note.author} - {formatDate(note.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {!isNewLead && lead.createdAt && (
              <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-medium mb-4">Lead Information</h2>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Created:</span> {formatDate(lead.createdAt)}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">Lead ID:</span> {lead.id}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
