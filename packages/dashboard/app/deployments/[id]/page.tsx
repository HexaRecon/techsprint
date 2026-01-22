'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Deployment } from '@/types';
import { useParams } from 'next/navigation';
import { Terminal, ArrowLeft } from 'lucide-react';

export default function DeploymentDetails() {
    const params = useParams();
    const [deployment, setDeployment] = useState<Deployment | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) fetchDetails(params.id as string);
    }, [params.id]);

    const fetchDetails = async (id: string) => {
        try {
            const res = await api.get(`/deployments/${id}`);
            setDeployment(res.data);

            // Real log streaming not implemented yet
            // setLogs(['Logs will appear here once the build system is active.']);
        } catch (error) {
            console.error('Failed to fetch deployment', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-white bg-black min-h-screen">Loading...</div>;
    if (!deployment) return <div className="p-8 text-center">Deployment not found</div>;

    return (
        <div className="bg-black min-h-screen text-gray-300 font-mono p-4">
            <div className="max-w-4xl mx-auto">
                <a href={`/projects/${deployment.projectId}`} className="text-blue-400 hover:text-blue-300 mb-4 inline-flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Project
                </a>

                <div className="card border border-gray-800 bg-gray-900 rounded-lg overflow-hidden mt-4">
                    <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center bg-gray-950">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4" />
                            <span className="font-bold">Build Logs</span>
                            <span className="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-400">{deployment.id}</span>
                        </div>
                        <div className={`px-2 py-0.5 rounded text-xs font-bold ${deployment.status === 'RUNNING' ? 'bg-green-900 text-green-400' :
                            deployment.status === 'FAILED' ? 'bg-red-900 text-red-400' :
                                'bg-yellow-900 text-yellow-400'
                            }`}>
                            {deployment.status}
                        </div>
                    </div>
                    <div className="p-4 h-[600px] overflow-y-auto font-mono text-sm leading-6">
                        {logs.map((log, index) => (
                            <div key={index} className="border-l-2 border-transparent hover:border-blue-800 pl-2">
                                {log}
                            </div>
                        ))}
                        {deployment.status === 'RUNNING' && logs.length > 5 && (
                            <div className="text-green-500 mt-4">✓ Process exited with code 0</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


