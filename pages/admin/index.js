import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '../../components/admin/AdminLayout';
import DashboardStats from '../../components/admin/DashboardStats';
import RecentActivity from '../../components/admin/RecentActivity';
import LatestLeads from '../../components/admin/LatestLeads';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status
  useEffect(() => {
    // This would be replaced with actual auth check
    const checkAuth = async () => {
      try {
        // Mock auth check for now
        const isAuth = localStorage.getItem('adminToken') !== null;
        setIsAuthenticated(isAuth);

        if (!isAuth) {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <AdminLayout>
      <Head>
        <title>Admin Dashboard | WoofnWhiskers</title>
      </Head>

      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <RecentActivity />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Latest Leads</h2>
          <LatestLeads />
        </div>
      </div>
    </AdminLayout>
  );
}
