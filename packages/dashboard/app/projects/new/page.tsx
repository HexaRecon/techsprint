'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Github, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewProject() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [repoUrl, setRepoUrl] = useState('');
    const [branch, setBranch] = useState('main');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post('/projects', {
                name,
                gitRepository: repoUrl,
                branch
            });

            const projectId = res.data.id;
            router.push(`/projects/${projectId}`);
        } catch (error) {
            console.error(error);
            alert('Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl p-8">
            <Link href="/" className="text-gray-500 hover:text-black mb-6 inline-block">&larr; Back to Dashboard</Link>

            <h1 className="text-3xl font-bold mb-8">Import Git Repository</h1>

            <div className="bg-white border rounded-xl p-8 shadow-sm">
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block font-medium mb-2 text-gray-700">Project Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="my-awesome-app"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block font-medium mb-2 text-gray-700">Git Repository URL</label>
                        <input
                            type="url"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="https://github.com/username/repo"
                            required
                        />
                    </div>

                    <div className="mb-8">
                        <label className="block font-medium mb-2 text-gray-700">Branch</label>
                        <input
                            type="text"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="main"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        disabled={loading || !name || !repoUrl}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Github className="w-5 h-5" />}
                        {loading ? 'Creating...' : 'Deploy Project'}
                    </button>
                </form>
            </div>
        </div>
    );
}
