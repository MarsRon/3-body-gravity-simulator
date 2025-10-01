
import React from 'react';
import { Body, Preset } from '../types';
import BodyControls from './BodyControls';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { PlayIcon, PauseIcon, ResetIcon, ShuffleIcon } from './icons/Icons';

interface ControlPanelProps {
    bodies: Body[];
    isRunning: boolean;
    activePreset: Preset;
    onStart: () => void;
    onPause: () => void;
    onReset: (preset: Preset) => void;
    onRandomize: () => void;
    onUpdateBody: (id: number, field: string, value: any) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
    bodies,
    isRunning,
    activePreset,
    onStart,
    onPause,
    onReset,
    onRandomize,
    onUpdateBody,
}) => {
    return (
        <aside className="w-80 lg:w-96 h-full bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/50 shadow-2xl p-4 overflow-y-auto flex flex-col gap-4 text-gray-300">
            <div>
                <h2 className="text-xl font-bold text-white mb-2">Presets</h2>
                <Card>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Button onClick={() => onReset(Preset.FIGURE_EIGHT)} variant={activePreset === Preset.FIGURE_EIGHT ? 'primary' : 'secondary'}>Figure Eight</Button>
                        <Button onClick={() => onReset(Preset.BINARY_PLANET)} variant={activePreset === Preset.BINARY_PLANET ? 'primary' : 'secondary'}>Binary System</Button>
                        <Button onClick={() => onReset(Preset.STABLE_TRIANGLE)} variant={activePreset === Preset.STABLE_TRIANGLE ? 'primary' : 'secondary'}>Triangle</Button>
                        <Button onClick={onRandomize} variant='secondary'>
                            <ShuffleIcon className="w-4 h-4 mr-2" />
                            Randomize
                        </Button>
                    </div>
                </Card>
            </div>

            <div>
                <h2 className="text-xl font-bold text-white mb-2">Simulation</h2>
                <Card>
                    <div className="flex gap-2">
                        {isRunning ? (
                            <Button onClick={onPause} className="flex-1 justify-center">
                                <PauseIcon className="w-5 h-5 mr-2" />
                                Pause
                            </Button>
                        ) : (
                            <Button onClick={onStart} className="flex-1 justify-center">
                                <PlayIcon className="w-5 h-5 mr-2" />
                                Start
                            </Button>
                        )}
                        <Button onClick={() => onReset(activePreset)} variant="secondary" className="justify-center">
                            <ResetIcon className="w-5 h-5 mr-2" />
                            Reset
                        </Button>
                    </div>
                </Card>
            </div>
            
            <div className="flex-1 min-h-0">
                <h2 className="text-xl font-bold text-white mb-2">Bodies</h2>
                 <div className="flex flex-col gap-4">
                    {bodies.map((body, index) => (
                        <BodyControls
                            key={body.id}
                            body={body}
                            onUpdate={onUpdateBody}
                        />
                    ))}
                </div>
            </div>

             <div className="text-xs text-gray-500 mt-auto text-center pt-4">
                Built by a world-class senior frontend React engineer.
            </div>
        </aside>
    );
};

export default ControlPanel;
