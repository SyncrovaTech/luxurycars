//D:\D-Luxury-Car-Showroom\Frontend\src\components\home\CarScene.tsx
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";

import {
  ContactShadows,
  Environment,
  OrbitControls,
  Sparkles,
  useGLTF,
  Html,
} from "@react-three/drei";

import "../../styles/components/home/CarScene.css";

/* ========================================================= */
/* REAL 3D BMW CAR MODEL                                     */
/* ========================================================= */

function RealBMWCar() {
  const { scene } = useGLTF("/models/bmw.glb");

  return (
    <primitive
      object={scene}
      scale={1.6}
      position={[0, -0.78, 0]}
      rotation={[0, -Math.PI / 4, 0]}
      castShadow
      receiveShadow
    />
  );
}

/* ========================================================= */
/* PRELOAD BMW MODEL                                         */
/* ========================================================= */

useGLTF.preload("/models/bmw.glb");

/* ========================================================= */
/* LOADING COMPONENT                                        */
/* ========================================================= */

function ModelLoader() {
  return (
    <Html center>
      <div
        style={{
          color: "#ffffff",
          letterSpacing: "4px",
          fontSize: "12px",
          fontFamily: "sans-serif",
          whiteSpace: "nowrap",
        }}
      >
        LOADING BMW SHOWROOM...
      </div>
    </Html>
  );
}

/* ========================================================= */
/* SHOWROOM FLOOR                                            */
/* ========================================================= */

function ShowroomFloor() {
  return (
    <>
      {/* Main showroom floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.8, 0]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />

        <meshStandardMaterial
          color="#06080c"
          roughness={0.12}
          metalness={0.85}
        />
      </mesh>

      {/* BMW contact shadow */}
      <ContactShadows
        position={[0, -0.79, 0]}
        opacity={0.8}
        scale={14}
        blur={2}
        far={4}
      />
    </>
  );
}

/* ========================================================= */
/* MAIN CAR SCENE                                            */
/* ========================================================= */

export default function CarScene() {
  return (
    <div className="car-scene">
      <Canvas
        shadows
        camera={{
          position: [5.5, 2.2, 5.5],
          fov: 38,
        }}
        dpr={[1, 2]}
      >
        {/* ================================================= */}
        {/* ENVIRONMENT                                       */}
        {/* ================================================= */}

        <Environment preset="city" />

        {/* ================================================= */}
        {/* BACKGROUND                                        */}
        {/* ================================================= */}

        <color
          attach="background"
          args={["#030508"]}
        />

        {/* ================================================= */}
        {/* FOG                                               */}
        {/* ================================================= */}

        <fog
          attach="fog"
          args={["#030508", 10, 24]}
        />

        {/* ================================================= */}
        {/* AMBIENT LIGHT                                     */}
        {/* ================================================= */}

        <ambientLight intensity={0.8} />

        {/* ================================================= */}
        {/* MAIN / KEY LIGHT                                  */}
        {/* ================================================= */}

        <spotLight
          position={[6, 8, 6]}
          angle={0.4}
          penumbra={0.8}
          intensity={4}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        {/* ================================================= */}
        {/* RIM LIGHT                                         */}
        {/* ================================================= */}

        <spotLight
          position={[-6, 6, -6]}
          angle={0.5}
          penumbra={1}
          intensity={3}
          color="#90b8f8"
        />

        {/* ================================================= */}
        {/* BMW MODEL                                         */}
        {/* ================================================= */}

        <Suspense fallback={<ModelLoader />}>
          <RealBMWCar />
        </Suspense>

        {/* ================================================= */}
        {/* SHOWROOM FLOOR                                    */}
        {/* ================================================= */}

        <ShowroomFloor />

        {/* ================================================= */}
        {/* SHOWROOM PARTICLES                                */}
        {/* ================================================= */}

        <Sparkles
          count={50}
          scale={[10, 5, 10]}
          size={1.1}
          speed={0.2}
          color="#60a5fa"
        />

        {/* ================================================= */}
        {/* CAMERA CONTROLS                                   */}
        {/* ================================================= */}

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={10}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2.05}
          autoRotate={true}
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}