import useVisualizer from "hooks/useVisualizer";
import { ReactElement, useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";

interface VisualizerProp {
    context: AudioContext,
}

const Visualizer = ({ context }: VisualizerProp): ReactElement => {
    
    const { canvasRef, getAnalyzer, draw } = useVisualizer();
    useEffect(()=>{
        getAnalyzer(context);
    })

    return (
        <Canvas ref={canvasRef}>
            
        </Canvas>
    )
}

const Canvas = styled.canvas`
    width: 50vw;
    aspect-ratio: 0.75;
    background-color: #333;
`

export default Visualizer;