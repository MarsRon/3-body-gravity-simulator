
import React from 'react';
import { useThreeBodySimulation } from './hooks/useThreeBodySimulation';
import SimulationCanvas from './components/SimulationCanvas';
import ControlPanel from './components/ControlPanel';

const App: React.FC = () => {
    const {
        bodies,
        isRunning,
        start,
        pause,
        resetToPreset,
        randomize,
        updateBodyState,
        activePreset,
    } = useThreeBodySimulation();

    return (
        <div className="flex h-screen w-screen bg-gray-900 font-sans">
            <ControlPanel
                bodies={bodies}
                isRunning={isRunning}
                activePreset={activePreset}
                onStart={start}
                onPause={pause}
                onReset={resetToPreset}
                onRandomize={randomize}
                onUpdateBody={updateBodyState}
            />
            <main className="flex-1 flex flex-col bg-black overflow-hidden relative">
                 <div className="absolute top-4 left-6 text-gray-400 text-sm z-10">
                    <h1 className="text-2xl font-bold text-white">3-Body Gravity Simulator</h1>
                    <p>Observe the chaotic beauty of gravitational dynamics.</p>
                </div>
                <SimulationCanvas bodies={bodies} />
            </main>
        </div>
    );
};

export default App;
