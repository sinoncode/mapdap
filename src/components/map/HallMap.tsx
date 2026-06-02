"use client";

import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import { Environment } from "@react-three/drei";

import HallFloor from "./HallFloor";
import Booth from "./Booth";

type BoothData = {
    id: string;
    name?: string;
    x: number;
    z: number;
    width: number;
    depth: number;
};

type Props = {
    booths: BoothData[];
    selectedBooth: string | null;
};
export default function HallMap({
    booths,
    selectedBooth,
}: Props) {
    return (
        <div className="w-full" style={{ height: '100vh' }}>
            <Canvas
                className="w-full h-[calc(100vh-112px)]"
                camera={{
                    position: [0, 150, 120],
                    fov: 50,
                }}
                shadows
            >
                <ambientLight intensity={2} />

                <directionalLight
                    position={[20, 30, 20]}
                    intensity={3}
                />

                <HallFloor />
                {booths.map((booth) => (
                    <Booth
                        key={booth.id}
                        id={booth.id}
                        x={booth.x}
                        z={booth.z}
                        width={booth.width}
                        depth={booth.depth}
                        selected={
                            booth.id ===
                            selectedBooth
                        }
                    />
                ))}

                <OrbitControls
                    target={[0, 0, 0]}
                />
                <Grid
                    position={[0, 0, 0]}

                    args={[200, 200]}
                    cellSize={2}
                    sectionSize={10}
                    fadeDistance={150}
                    infiniteGrid
                />
                <Environment preset="city" />
                <directionalLight
                    castShadow
                    position={[50, 50, 50]}
                    intensity={2}
                />

                <gridHelper
                    args={[250, 50]}
                />

                <axesHelper args={[20]} />
            </Canvas>
        </div>
    );
}