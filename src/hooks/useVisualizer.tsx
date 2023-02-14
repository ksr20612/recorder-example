import { useState, useEffect, useRef, useCallback } from "react";

const useVisualizer = () => {
    const analyzer = useRef<AnalyserNode | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const data = useRef<Uint8Array | null>(null);
    const requestAnimationFrameRef = useRef<number | null>(null);

    const getAnalyzer = useCallback(
        (context: AudioContext): AnalyserNode | null => {
            if(analyzer.current) return analyzer.current;
            if(!canvasRef.current) {
                console.log("canvasRef null");
                return null;
            }
            analyzer.current = context.createAnalyser();
            const bufferLength = analyzer.current.frequencyBinCount;
            data.current = new Uint8Array(bufferLength);
            const [width, height, centerX, centerY] 
                = [canvasRef.current.width, canvasRef.current.height, canvasRef.current.width/2, canvasRef.current.height/2];
            return analyzer.current;
        }, 
    []);

    const draw = () => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        analyzer.current?.getByteFrequencyData(data.current!);
        if(!context || !canvas || !data.current) return null;
        context.fillStyle = 'rgb(0, 0, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        let radius = data.current[2] / 2;
        if(radius < 20) radius = 20;
        if(radius > 100) radius = 100;
        context.beginPath();
        context.arc(canvas.width/2, canvas.height/2, radius, 0, 2*Math.PI, false);
        context.lineWidth = 5;
        context.strokeStyle = `rgb(50, 50, ${radius+100})`;
        context.stroke();
        requestAnimationFrameRef.current = requestAnimationFrame(draw);
    }

    useEffect(()=>{
        requestAnimationFrameRef.current = requestAnimationFrame(draw);
        return () => {
            cancelAnimationFrame(requestAnimationFrameRef.current!);
        }
    })

    return { canvasRef, getAnalyzer, draw }
}

export default useVisualizer;