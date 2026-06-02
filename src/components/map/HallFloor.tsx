export default function HallFloor() {
    return (
        <>
            {/* Platform */}
            <mesh

                receiveShadow
                position={[0, -1, 0]}
            >
                <boxGeometry args={[250, 2, 180]} />
                <meshStandardMaterial color="#f1f5f9" />
            </mesh>

            {/* Floor Surface */}
            <mesh
                receiveShadow
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <planeGeometry args={[180, 120]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
        </>
    );
}