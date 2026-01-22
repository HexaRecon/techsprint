'use client';

import { useEffect, useState } from 'react';
import { LoginForm } from '@/components/login-form';
import { ProjectList } from '@/components/project-list';
import { logout } from '@/lib/api';

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token on mount
    const stored = localStorage.getItem('token');
    setToken(stored);
    setLoading(false);
  }, []);

  if (loading) return null;

  if (!token) {
    return <LoginForm onLogin={() => setToken(localStorage.getItem('token'))} />;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container px-4 mx-auto h-16 flex items-center justify-between">
          <div className="font-bold text-xl text-blue-600">Docker Platform</div>
          <button
            onClick={logout}
            className="text-sm text-gray-600 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </header>
      <div className="container mx-auto">
        <ProjectList />
      </div>
    </main>
  );
}
