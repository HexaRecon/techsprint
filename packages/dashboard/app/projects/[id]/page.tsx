'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Project, Deployment } from '../../types';
import { useParams } from 'next/navigation';
import { Clock, GitCommit, CheckCircle, XCircle, PlayCircle, StopCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetails() {
    const params = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [deployments, setDeployments] = useState<Deployment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) fetchDetails(params.id as string);
    }, [params.id]);

    const fetchDetails = async (id: string) => {
        try {
            const [projRes, depRes] = await Promise.all([
                api.get(`/projects/${id}`),
                api.get(`/projects/${id}/deployments`)
            ]);
            setProject(projRes.data);
            setDeployments(depRes.data);
        } catch (error) {
            console.error('Failed to fetch project details', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!project) return <div className="p-8 text-center">Project not found</div>;

    return (
        <div className="container mx-auto p-8">
            <div className="mb-8">
                <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Projects</Link>
                <h1 className="text-3xl font-bold">{project.name}</h1>
                <p className="text-gray-500 mt-2 flex items-center">
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm font-mono mr-2">{project.branch}</span>
                    <a href={project.gitRepository} target="_blank" className="hover:underline">{project.gitRepository}</a>
                </p>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="font-semibold text-lg">Deployment History</h2>
                    <button className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800" onClick={() => alert('Trigger deployment logic here')}>
                        Deploy Now
                    </button>
                </div>
                <div>
                    {deployments.map((deployment) => (
                        <div key={deployment.id} className="px-6 py-4 border-b last:border-0 hover:bg-gray-50 transition-colors flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <StatusIcon status={deployment.status} />
                                <div>
                                    <div className="font-medium flex items-center">
                                        {deployment.commitMessage || 'Manual Deployment'}
                                    </div>
                                    <div className="text-sm text-gray-500 flex items-center mt-1">
                                        <GitCommit className="w-3 h-3 mr-1" />
                                        <span className="font-mono mr-3">{deployment.commitHash.substring(0, 7)}</span>
                                        <Clock className="w-3 h-3 mr-1" />
                                        <span>{new Date(deployment.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <Link href={`/deployments/${deployment.id}`} className="text-sm border px-3 py-1 rounded hover:bg-white">
                                View Logs
                            </Link>
                        </div>
                    ))}
                    {deployments.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No deployments found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatusIcon({ status }: { status: string }) {
    switch (status) {
        case 'RUNNING': return <CheckCircle className="w-6 h-6 text-green-500" />;
        case 'FAILED': return <XCircle className="w-6 h-6 text-red-500" />;
        case 'BUILDING': return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
        case 'QUEUED': return <Clock className="w-6 h-6 text-yellow-500" />;
        case 'STOPPED': return <StopCircle className="w-6 h-6 text-gray-400" />;
        default: return <div className="w-6 h-6 rounded-full bg-gray-200" />;
    }
}
