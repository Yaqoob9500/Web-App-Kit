
import React, { useEffect, useRef } from 'react';

interface LogConsoleProps {
    logs: string[];
}

const LogConsole: React.FC<LogConsoleProps> = ({ logs }) => {
    const consoleEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="flex-grow bg-gray-900 rounded-md p-4 overflow-y-auto h-96">
            <pre className="text-sm font-mono whitespace-pre-wrap break-words">
                {logs.map((log, index) => (
                    <div key={index} className={`flex items-start ${log.startsWith('ERROR:') ? 'text-red-400' : log.startsWith('✅') ? 'text-green-400' : 'text-gray-300'}`}>
                       <span className="mr-2 text-gray-500">{'>'}</span>
                       <span>{log}</span>
                    </div>
                ))}
                <div ref={consoleEndRef} />
            </pre>
        </div>
    );
};

export default LogConsole;
