import React, { useRef, useEffect } from 'react';
import { Body } from '../types';

interface SimulationCanvasProps {
    bodies: Body[];
}

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ bodies }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const parent = canvas.parentElement;
        if (!parent) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `${parent.clientHeight}px`;

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (bodies.length === 0 || bodies.every(b => b.path.length === 0)) return;

        // 1. Find bounding box of all points
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        bodies.forEach(body => {
            body.path.forEach(p => {
                minX = Math.min(minX, p.x);
                maxX = Math.max(maxX, p.x);
                minY = Math.min(minY, p.y);
                maxY = Math.max(maxY, p.y);
            });
             // Also include the body's current position with its radius in the bounding box
            minX = Math.min(minX, body.position.x - body.radius);
            maxX = Math.max(maxX, body.position.x + body.radius);
            minY = Math.min(minY, body.position.y - body.radius);
            maxY = Math.max(maxY, body.position.y + body.radius);
        });

        // Handle case where all points are the same
        if (minX === Infinity) return;
        if (minX === maxX) { minX -= 1; maxX += 1; }
        if (minY === maxY) { minY -= 1; maxY += 1; }

        // 2. Calculate scale and offset
        const worldWidth = maxX - minX;
        const worldHeight = maxY - minY;
        const canvasWidth = parent.clientWidth;
        const canvasHeight = parent.clientHeight;
        
        const scaleX = canvasWidth / worldWidth;
        const scaleY = canvasHeight / worldHeight;
        const scale = Math.min(scaleX, scaleY) * 0.9; // 0.9 for margin

        const offsetX = (canvasWidth - worldWidth * scale) / 2 - minX * scale;
        const offsetY = (canvasHeight - worldHeight * scale) / 2 - minY * scale;
        
        // 3. Draw everything with transformations
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);

        bodies.forEach(body => {
            // Draw trail
            ctx.beginPath();
            if (body.path.length > 0) {
                ctx.moveTo(body.path[0].x, body.path[0].y);
                for (let i = 1; i < body.path.length; i++) {
                    ctx.lineTo(body.path[i].x, body.path[i].y);
                }
                ctx.strokeStyle = body.color;
                ctx.lineWidth = 1 / scale;
                ctx.globalAlpha = 0.6;
                ctx.stroke();
                ctx.globalAlpha = 1.0;
            }

            // Draw body
            ctx.beginPath();
            const radius = body.radius;
            ctx.arc(body.position.x, body.position.y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = body.color;
            ctx.fill();
        });

        ctx.restore();

    }, [bodies]);

    return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default SimulationCanvas;