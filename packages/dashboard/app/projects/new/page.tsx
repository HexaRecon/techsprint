'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Github, Wand2, Loader2, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

export default function NewProject() {
    const router = useRouter();
    const [mode, setMode] = useState<'import' | 'generate'>('import');
    const [loading, setLoading] = useState(false);

    // AI Gen State
    const [prompt, setPrompt] = useState('');
    const [genStep, setGenStep] = useState<string>('');

    const handleImport = async (e: React.FormEvent) => {
        e.preventDefault();
        // ... existing logic for git import (mock or real) ...
        alert('Git Import not fully implemented for this demo, use AI Generate!');
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const steps = [
            'Analyzing prompt...',
            'Scaffolding Next.js application...',
            'Generating UI components...',
            'Writing database schema...',
            'Creating Dockerfile...',
            'Pushing to repository...',
        ];

        for (const step of steps) {
            setGenStep(step);
            await new Promise(r => setTimeout(r, 800 + Math.random() * 1000));
        }

        setGenStep('Finalizing deployment...');

        try {
            // Create the project in DB
            const res = await api.post('/projects', {
                name: `ai-gen-${Math.floor(Math.random() * 1000)}`,
                gitRepository: 'https://github.com/demo/ai-generated-app',
                branch: 'main'
            });

            // Mock a deployment for it
            const projectId = res.data.id;

            // Redirect
            router.push(`/projects/${projectId}`);
        } catch (error) {
            console.error(error);
            alert('Failed to generate');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-4xl p-8">
            <Link href="/" className="text-gray-500 hover:text-black mb-6 inline-block">&larr; Back to Dashboard</Link>

            <h1 className="text-3xl font-bold mb-8">Create New Project</h1>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <button
                    onClick={() => setMode('import')}
                    className={`p-6 border rounded-xl text-left transition-all ${mode === 'import' ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50' : 'hover:border-gray-400'}`}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Github className="w-6 h-6" />
                        <span className="font-semibold">Import Git Repository</span>
                    </div>
                    <p className="text-sm text-gray-500">Deploy an existing project from your GitHub.</p>
                </button>

                <button
                    onClick={() => setMode('generate')}
                    className={`p-6 border rounded-xl text-left transition-all ${mode === 'generate' ? 'border-purple-600 ring-1 ring-purple-600 bg-purple-50' : 'hover:border-gray-400'}`}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Wand2 className="w-6 h-6 text-purple-600" />
                        <span className="font-semibold text-purple-900">Generate with AI</span>
                    </div>
                    <p className="text-sm text-gray-500">Describe what you want, and we'll build and deploy it.</p>
                </button>
            </div>

            <div className="bg-white border rounded-xl p-8 shadow-sm">
                {mode === 'import' ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Git Import is disabled for this demo.</p>
                        <p className="text-sm text-gray-400 mt-2">Please try "Generate with AI" ✨</p>
                    </div>
                ) : (
                    <form onSubmit={handleGenerate}>
                        <div className="mb-6">
                            <label className="block font-medium mb-2 text-gray-700">What should we build?</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="w-full border rounded-lg p-4 h-32 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                placeholder="e.g. A portfolio website for a photographer with a gallery and contact form..."
                                required
                                disabled={loading}
                            />
                        </div>

                        {loading ? (
                            <div className="bg-gray-50 rounded-lg p-6 border mb-6">
                                <div className="flex items-center gap-3 text-purple-700 font-medium animate-pulse">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {genStep}
                                </div>
                            </div>
                        ) : (
                            <button
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                                disabled={!prompt.trim()}
                            >
                                <Wand2 className="w-5 h-5" />
                                Generate Website
                            </button>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
}
