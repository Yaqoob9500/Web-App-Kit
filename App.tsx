import React, { useState, useCallback, ChangeEvent } from 'react';
import { BuildMode, AppConfig } from './types';
import TextInput from './components/TextInput';
import Checkbox from './components/Checkbox';
import Button from './components/Button';
import Select from './components/Select';
import IconPicker from './components/IconPicker';
import LogConsole from './components/LogConsole';
import CollapsibleSection from './components/CollapsibleSection';
import { createProjectZip } from './services/projectPackager';
import { runBuildSimulator, getTestToolsLog } from './services/buildSimulator';

const App: React.FC = () => {
    const [config, setConfig] = useState<AppConfig>({
        url: '',
        appName: 'MyApp',
        packageId: 'com.example.myapp',
        icon: null,
        mode: BuildMode.KOTLIN,
        options: {
            allowJavaScript: true,
            allowFileUploads: true,
            pullToRefresh: true,
            showSplashScreen: true,
            fullScreen: false,
            externalLinksInBrowser: true,
            offlineCache: true,
        },
        advanced: {
            generateKeystore: true,
            keystorePath: 'release.keystore',
            keystoreAlias: 'app_alias',
            keystorePassword: '',
            keyPassword: '',
            versionName: '1.0.0',
            versionCode: 1,
            minSdk: 24,
        },
        outputFolder: '',
    });

    const [logs, setLogs] = useState<string[]>(['Welcome to the Web to APK Generator!']);
    const [isBuilding, setIsBuilding] = useState(false);

    const handleConfigChange = useCallback((section: keyof AppConfig, key: string, value: any) => {
        setConfig(prev => ({
            ...prev,
            [section]: {
                ...(prev[section] as object),
                [key]: value
            }
        }));
    }, []);

    const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setConfig(prev => {
            let newAppName = prev.appName;
            let newPackageId = prev.packageId;

             if (newAppName === 'MyApp' || newPackageId === 'com.example.myapp') {
                try {
                    const urlObj = new URL(newUrl);
                    const domain = urlObj.hostname.replace('www.', '');
                    const domainParts = domain.split('.');
                    if (domainParts.length >= 2) {
                        const mainDomain = domainParts[domainParts.length - 2];
                        if (newAppName === 'MyApp') {
                             newAppName = mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1);
                        }
                        if (newPackageId === 'com.example.myapp') {
                            newPackageId = `com.${mainDomain}.${domainParts[domainParts.length - 1]}`;
                        }
                    }
                } catch (error) {
                    // Invalid URL, do nothing
                }
            }

            return { ...prev, url: newUrl, appName: newAppName, packageId: newPackageId };
        });
    };

    const handleGenerate = useCallback(async () => {
        if (!config.url || !/^(https?:\/\/)/.test(config.url)) {
            setLogs(prev => [...prev, 'ERROR: Please enter a valid URL starting with http:// or https://']);
            return;
        }
        setIsBuilding(true);
        setLogs(['Starting build process...']);

        await runBuildSimulator((log) => setLogs(prev => [...prev, log]));

        try {
            onLog('Generating project files...');
            const zipBlob = await createProjectZip(config);
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = `${config.appName.replace(/\s+/g, '_')}-Android-Project.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            onLog('✅ Project ZIP generated and download started!');
            onLog('Next steps: Unzip the file and follow the instructions in README.md to build your APK.');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            onLog(`ERROR: Failed to generate project zip. ${errorMessage}`);
        }

        setIsBuilding(false);
    }, [config]);
    
    const onLog = (log: string) => {
      setLogs(prev => [...prev, log]);
    }

    const handleTestTools = useCallback(() => {
        setLogs(getTestToolsLog());
    }, []);


    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 lg:p-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-cyan-400">Web to APK Generator</h1>
                <p className="text-gray-400 mt-2">Configure and download a complete Android project from a web URL.</p>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col gap-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Configuration</h2>
                        <div className="space-y-4">
                            <TextInput label="Website URL" value={config.url} onChange={handleUrlChange} placeholder="https://example.com" required />
                            <TextInput label="App Name" value={config.appName} onChange={e => setConfig(p => ({ ...p, appName: e.target.value }))} placeholder="My Awesome App" required />
                            <TextInput label="Package ID" value={config.packageId} onChange={e => setConfig(p => ({ ...p, packageId: e.target.value }))} placeholder="com.example.app" required />
                            <IconPicker onIconSelect={(base64) => setConfig(p => ({ ...p, icon: base64 }))} />
                             <Select label="Mode" value={config.mode} onChange={e => setConfig(p => ({ ...p, mode: e.target.value as BuildMode }))} options={Object.values(BuildMode)} />
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Options</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.keys(config.options).map((key) => (
                                <Checkbox key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} checked={config.options[key as keyof typeof config.options]} onChange={e => handleConfigChange('options', key, e.target.checked)} />
                            ))}
                        </div>
                    </div>

                    <CollapsibleSection title="Advanced">
                        <div className="space-y-4 pt-2">
                             <TextInput label="Version Name" value={config.advanced.versionName} onChange={e => handleConfigChange('advanced', 'versionName', e.target.value)} />
                            <TextInput label="Version Code" type="number" value={config.advanced.versionCode.toString()} onChange={e => handleConfigChange('advanced', 'versionCode', parseInt(e.target.value, 10) || 1)} />
                            <TextInput label="Minimum SDK" type="number" value={config.advanced.minSdk.toString()} onChange={e => handleConfigChange('advanced', 'minSdk', parseInt(e.target.value, 10) || 24)} />
                            <h4 className="text-lg font-semibold text-white mt-4">Signing</h4>
                             <Checkbox label="Generate new Keystore (Recommended)" checked={config.advanced.generateKeystore} onChange={e => handleConfigChange('advanced', 'generateKeystore', e.target.checked)} />
                             {!config.advanced.generateKeystore && <TextInput label="Keystore Path" placeholder="/path/to/your.keystore" value={config.advanced.keystorePath} onChange={e => handleConfigChange('advanced', 'keystorePath', e.target.value)} />}
                             <TextInput label="Keystore Alias" value={config.advanced.keystoreAlias} onChange={e => handleConfigChange('advanced', 'keystoreAlias', e.target.value)} />
                             <TextInput label="Keystore Password" type="password" value={config.advanced.keystorePassword} onChange={e => handleConfigChange('advanced', 'keystorePassword', e.target.value)} />
                             <TextInput label="Key Password" type="password" value={config.advanced.keyPassword} onChange={e => handleConfigChange('advanced', 'keyPassword', e.target.value)} />
                        </div>
                    </CollapsibleSection>
                    
                    <div className="border-t border-gray-700 pt-6 mt-auto">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button onClick={handleGenerate} disabled={isBuilding} className="w-full bg-cyan-600 hover:bg-cyan-700">
                          {isBuilding ? 'Generating...' : 'Generate & Download Project ZIP'}
                        </Button>
                        <Button onClick={handleTestTools} disabled={isBuilding} className="w-full bg-gray-600 hover:bg-gray-700">
                          Test Build Tools
                        </Button>
                      </div>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
                    <h2 className="text-2xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Log Console</h2>
                    <LogConsole logs={logs} />
                </div>
            </main>
        </div>
    );
};

export default App;