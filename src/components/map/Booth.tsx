"use client";

import { useState } from "react";
import { Text } from "@react-three/drei";

type BoothProps = {
    id: string;
    x: number;
    z: number;
    width: number;
    depth: number;
    selected?: boolean;
    onClick?: (id: string) => void;
};

export default function Booth({
    id,
    x,
    z,
    width,
    depth,
    selected = false,
    onClick,
}: BoothProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <mesh
            castShadow
            receiveShadow
            position={[x, 1, z]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={() => onClick?.(id)}
        >
            <boxGeometry
                args={[
                    width,
                    0.5,
                    depth,
                ]}
            />

            <meshStandardMaterial
                color={
                    selected
                        ? "#22c55e"
                        : hovered
                            ? "#60a5fa"
                            : "#3b82f6"
                }
            />

            <Text
                position={[x, 3, z]}
                fontSize={1.2}
                color="black"
                anchorX="center"
                anchorY="middle"
            >
                {id}
            </Text>
        </mesh>
    );
}