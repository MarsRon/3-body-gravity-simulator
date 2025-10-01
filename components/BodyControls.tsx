
import React from 'react';
import { Body } from '../types';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Slider } from './ui/Slider';

interface BodyControlsProps {
    body: Body;
    onUpdate: (id: number, field: string, value: any) => void;
}

const BodyControls: React.FC<BodyControlsProps> = ({ body, onUpdate }) => {
    
    const handleValueChange = (field: keyof Body, value: number) => {
        onUpdate(body.id, field, value);
    };

    const handleVectorChange = (field: 'position' | 'velocity', axis: 'x' | 'y', value: number) => {
        onUpdate(body.id, field, { ...body[field], [axis]: value });
    };

    return (
        <Card>
            <div className="flex items-center mb-4">
                <div className="w-6 h-6 rounded-full mr-3" style={{ backgroundColor: body.color }}></div>
                <h3 className="text-lg font-bold text-white">Body {body.id}</h3>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Mass: {body.mass.toFixed(0)}</label>
                     <Slider
                        min={100}
                        max={5000}
                        step={50}
                        value={[body.mass]}
                        onValueChange={(val) => handleValueChange('mass', val[0])}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Position</label>
                    <div className="flex gap-2">
                        <Input type="number" value={body.position.x.toFixed(2)} onChange={(e) => handleVectorChange('position', 'x', parseFloat(e.target.value))} prefix="X" />
                        <Input type="number" value={body.position.y.toFixed(2)} onChange={(e) => handleVectorChange('position', 'y', parseFloat(e.target.value))} prefix="Y" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Velocity</label>
                    <div className="flex gap-2">
                        <Input type="number" value={body.velocity.x.toFixed(2)} onChange={(e) => handleVectorChange('velocity', 'x', parseFloat(e.target.value))} prefix="Vx" />
                        <Input type="number" value={body.velocity.y.toFixed(2)} onChange={(e) => handleVectorChange('velocity', 'y', parseFloat(e.target.value))} prefix="Vy" />
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default BodyControls;
