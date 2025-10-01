import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Body, Vector, Preset } from '../types';
import { G, DT, TRAIL_LENGTH, SOFTENING_FACTOR, PRESETS, DENSITY } from '../constants';

const deepCopyBodies = (bodies: Body[]): Body[] => 
    bodies.map(body => ({
        ...body,
        position: { ...body.position },
        velocity: { ...body.velocity },
        path: body.path.map(p => ({ ...p }))
    }));

const calculateRadius = (mass: number) => Math.cbrt(mass / DENSITY);

export const useThreeBodySimulation = () => {
    const [activePreset, setActivePreset] = useState<Preset>(Preset.FIGURE_EIGHT);
    const [bodies, setBodies] = useState<Body[]>(deepCopyBodies(PRESETS[activePreset]));
    const [isRunning, setIsRunning] = useState(false);
    const animationFrameId = useRef<number | null>(null);

    const updatePhysics = useCallback(() => {
        setBodies(currentBodies => {
            let nextBodies = deepCopyBodies(currentBodies);
            const collidedIds = new Set<number>();

            // --- Collision Detection and Merging ---
            for (let i = 0; i < nextBodies.length; i++) {
                for (let j = i + 1; j < nextBodies.length; j++) {
                    const bodyA = nextBodies[i];
                    const bodyB = nextBodies[j];

                    if (collidedIds.has(bodyA.id) || collidedIds.has(bodyB.id)) continue;

                    const dx = bodyB.position.x - bodyA.position.x;
                    const dy = bodyB.position.y - bodyA.position.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < bodyA.radius + bodyB.radius) {
                        // Collision detected: merge smaller body into larger one
                        const [absorber, absorbed] = bodyA.mass >= bodyB.mass ? [bodyA, bodyB] : [bodyB, bodyA];
                        
                        const totalMass = absorber.mass + absorbed.mass;

                        // Conserve momentum for new velocity
                        absorber.velocity.x = (absorber.velocity.x * absorber.mass + absorbed.velocity.x * absorbed.mass) / totalMass;
                        absorber.velocity.y = (absorber.velocity.y * absorber.mass + absorbed.velocity.y * absorbed.mass) / totalMass;
                        
                        // New position is the center of mass
                        absorber.position.x = (absorber.position.x * absorber.mass + absorbed.position.x * absorbed.mass) / totalMass;
                        absorber.position.y = (absorber.position.y * absorber.mass + absorbed.position.y * absorbed.mass) / totalMass;

                        // Update mass and radius
                        absorber.mass = totalMass;
                        absorber.radius = calculateRadius(totalMass);
                        
                        // Mark absorbed body for removal
                        collidedIds.add(absorbed.id);
                    }
                }
            }

            // Filter out absorbed bodies
            nextBodies = nextBodies.filter(body => !collidedIds.has(body.id));

            // --- Gravitational Force Calculation ---
            const accelerations: Vector[] = Array(nextBodies.length).fill(0).map(() => ({ x: 0, y: 0 }));

            for (let i = 0; i < nextBodies.length; i++) {
                for (let j = i + 1; j < nextBodies.length; j++) {
                    const bodyA = nextBodies[i];
                    const bodyB = nextBodies[j];

                    const dx = bodyB.position.x - bodyA.position.x;
                    const dy = bodyB.position.y - bodyA.position.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq === 0) continue;

                    const forceMagnitude = (G * bodyA.mass * bodyB.mass) / (distSq + SOFTENING_FACTOR);
                    const dist = Math.sqrt(distSq);
                    
                    const forceDirectionX = dx / dist;
                    const forceDirectionY = dy / dist;

                    const accOnA = forceMagnitude / bodyA.mass;
                    const accOnB = forceMagnitude / bodyB.mass;

                    accelerations[i].x += accOnA * forceDirectionX;
                    accelerations[i].y += accOnA * forceDirectionY;

                    accelerations[j].x -= accOnB * forceDirectionX;
                    accelerations[j].y -= accOnB * forceDirectionY;
                }
            }
            
            // --- Integration (Update position and velocity) ---
            return nextBodies.map((body, i) => {
                const newVelocity: Vector = {
                    x: body.velocity.x + accelerations[i].x * DT,
                    y: body.velocity.y + accelerations[i].y * DT
                };

                const newPosition: Vector = {
                    x: body.position.x + newVelocity.x * DT,
                    y: body.position.y + newVelocity.y * DT
                };

                const newPath = [...body.path, newPosition].slice(-TRAIL_LENGTH);

                return {
                    ...body,
                    velocity: newVelocity,
                    position: newPosition,
                    path: newPath
                };
            });
        });
    }, []);

    const simulationLoop = useCallback(() => {
        updatePhysics();
        animationFrameId.current = requestAnimationFrame(simulationLoop);
    }, [updatePhysics]);

    useEffect(() => {
        if (isRunning) {
            animationFrameId.current = requestAnimationFrame(simulationLoop);
        } else {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        }
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [isRunning, simulationLoop]);
    
    const start = () => setIsRunning(true);
    const pause = () => setIsRunning(false);
    
    const resetToPreset = (preset: Preset) => {
        pause();
        setActivePreset(preset);
        const initialBodies = deepCopyBodies(PRESETS[preset]);
        initialBodies.forEach(body => body.path = [body.position]);
        setBodies(initialBodies);
    };

    const randomize = () => {
        pause();
        const newBodies: Body[] = bodies.map((body, i) => {
            const angle = Math.random() * 2 * Math.PI;
            const radius = 150 + Math.random() * 150;
            const velMag = 3 + Math.random() * 5;
            const mass = 500 + Math.random() * 1500;

            return {
                ...body,
                mass,
                radius: calculateRadius(mass),
                position: {
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius
                },
                velocity: {
                    x: -Math.sin(angle) * velMag,
                    y: Math.cos(angle) * velMag
                },
                path: []
            }
        });
        newBodies.forEach(body => body.path = [body.position]);
        setBodies(newBodies);
    };
    
    const updateBodyState = (id: number, field: keyof Body, value: any) => {
        pause();
        setBodies(currentBodies => currentBodies.map(body => {
            if (body.id === id) {
                const updatedBody = { ...body, [field]: value };
                if (field === 'position') {
                    updatedBody.path = [value];
                }
                if (field === 'mass') {
                    updatedBody.radius = calculateRadius(value as number);
                }
                return updatedBody;
            }
            return body;
        }));
    };

    useEffect(() => {
        resetToPreset(Preset.FIGURE_EIGHT);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { bodies, isRunning, activePreset, start, pause, resetToPreset, randomize, updateBodyState };
};