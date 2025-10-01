import { Body, Preset } from './types';

export const G = 10; // Gravitational constant (scaled for simulation)
export const DT = 0.1; // Time step for integration
export const TRAIL_LENGTH = 700; // Max number of points in a body's trail
export const SOFTENING_FACTOR = 10; // Prevents extreme forces at close distances
export const DENSITY = 0.05; // Used for calculating radius from mass

// radius = Math.cbrt(mass / DENSITY)
// mass 1000 -> radius ~27.14
// mass 2000 -> radius ~34.20
// mass 50 -> radius 10
// mass 1500 -> radius ~31.07

export const PRESETS: Record<Preset, Body[]> = {
    [Preset.FIGURE_EIGHT]: [
        { id: 1, mass: 1000, radius: 27.14, position: { x: 97.0012, y: -24.3087 }, velocity: { x: 4.6620, y: 4.3236 }, color: '#3b82f6', path: [] },
        { id: 2, mass: 1000, radius: 27.14, position: { x: -97.0012, y: 24.3087 }, velocity: { x: 4.6620, y: 4.3236 }, color: '#22c55e', path: [] },
        { id: 3, mass: 1000, radius: 27.14, position: { x: 0, y: 0 }, velocity: { x: -9.3240, y: -8.6472 }, color: '#ef4444', path: [] },
    ],
    [Preset.BINARY_PLANET]: [
        { id: 1, mass: 2000, radius: 34.20, position: { x: -100, y: 0 }, velocity: { x: 0, y: -5 }, color: '#3b82f6', path: [] },
        { id: 2, mass: 2000, radius: 34.20, position: { x: 100, y: 0 }, velocity: { x: 0, y: 5 }, color: '#22c55e', path: [] },
        { id: 3, mass: 50, radius: 10, position: { x: 0, y: 250 }, velocity: { x: 8, y: 0 }, color: '#ef4444', path: [] },
    ],
    [Preset.STABLE_TRIANGLE]: [
        { id: 1, mass: 1500, radius: 31.07, position: { x: 0, y: 115.47 }, velocity: { x: 7, y: 0 }, color: '#3b82f6', path: [] },
        { id: 2, mass: 1500, radius: 31.07, position: { x: -100, y: -57.735 }, velocity: { x: -3.5, y: -6.062 }, color: '#22c55e', path: [] },
        { id: 3, mass: 1500, radius: 31.07, position: { x: 100, y: -57.735 }, velocity: { x: -3.5, y: 6.062 }, color: '#ef4444', path: [] },
    ],
};