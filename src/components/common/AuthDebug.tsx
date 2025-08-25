'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/lib/store';

export function AuthDebug() {
    const [authStatus, setAuthStatus] = useState<any>(null);
    const [sessionData, setSessionData] = useState<any>(null);
    const [dbStatus, setDbStatus] = useState<any>(null);
    const { currentUser, studyPlan } = useAppStore();

    useEffect(() => {
        checkAuthStatus();
        checkDatabaseConnection();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                setAuthStatus({ error: error.message });
            } else {
                setAuthStatus({ user: user ? { id: user.id, email: user.email } : null });
            }

            const { data: { session } } = await supabase.auth.getSession();
            setSessionData(session ? { user: session.user?.email, expires_at: session.expires_at } : null);
        } catch (error) {
            setAuthStatus({ error: 'Failed to check auth status' });
        }
    };

    const checkDatabaseConnection = async () => {
        try {
            const { data, error } = await supabase.from('study_plans').select('count').limit(1);
            if (error) {
                setDbStatus({ error: error.message, code: error.code });
            } else {
                setDbStatus({ success: true, message: 'Database connection OK' });
            }
        } catch (error) {
            setDbStatus({ error: 'Database connection failed' });
        }
    };

    const testSignOut = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    return (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-md z-50">
            <h3 className="font-bold text-lg mb-2">🔧 Auth Debug</h3>

            <div className="space-y-2 text-sm">
                <div>
                    <strong>App Store User:</strong>
                    <pre className="text-xs bg-gray-100 p-1 rounded mt-1">
                        {JSON.stringify(currentUser, null, 2)}
                    </pre>
                </div>

                <div>
                    <strong>Supabase Auth:</strong>
                    <pre className="text-xs bg-gray-100 p-1 rounded mt-1">
                        {JSON.stringify(authStatus, null, 2)}
                    </pre>
                </div>

                <div>
                    <strong>Session:</strong>
                    <pre className="text-xs bg-gray-100 p-1 rounded mt-1">
                        {JSON.stringify(sessionData, null, 2)}
                    </pre>
                </div>

                <div>
                    <strong>Study Plan:</strong>
                    <pre className="text-xs bg-gray-100 p-1 rounded mt-1">
                        {JSON.stringify({ length: studyPlan.length }, null, 2)}
                    </pre>
                </div>

                <div>
                    <strong>Database:</strong>
                    <pre className="text-xs bg-gray-100 p-1 rounded mt-1">
                        {JSON.stringify(dbStatus, null, 2)}
                    </pre>
                </div>
            </div>

            <div className="mt-3 space-x-2">
                <button
                    onClick={checkAuthStatus}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                >
                    Refresh
                </button>
                <button
                    onClick={testSignOut}
                    className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
}
