import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react";

import { Canvas } from "@react-three/fiber";

import {
  ContactShadows,
  Html,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";

import * as THREE from "three";

import type { Car } from "../../api/cars.api";

import "../../styles/pages/configurator/ConfiguratorScene.css";

interface Props {
  car: Car;
  color: string;
  interiorColor?: string;
  wheelName?: string;
  wheelDesign?: string;
  wheelSize?: number;
  baseWheelSize?: number;
}

interface UploadedModelProps {
  url: string;
  bodyColor: string;
  interiorColor?: string;
  rimColor?: string;
  wheelScale?: number;
}

/**
 * Convert a backend model URL into an absolute URL.
 *
 * Examples:
 * /uploads/models/car.glb
 *   -> http://localhost:5000/uploads/models/car.glb
 *
 * http://localhost:5000/uploads/models/car.glb
 *   -> remains unchanged
 */
function resolveModelUrl(modelUrl?: string | null): string {
  if (!modelUrl?.trim()) {
    return "";
  }

  const url = modelUrl.trim();

  if (/^(https?:\/\/|blob:|data:)/i.test(url)) {
    return url;
  }

  const apiUrl =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

  try {
    const parsedApiUrl = new URL(apiUrl, window.location.origin);
    const backendOrigin = parsedApiUrl.origin;

    if (url.startsWith("/")) {
      return `${backendOrigin}${url}`;
    }

    // Relative model paths are served from the backend root.
    return `${backendOrigin}/${url.replace(/^\/+/, "")}`;
  } catch {
    return url;
  }
}

/**
 * Error boundary for model loading/rendering errors.
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ModelErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("3D car model rendering error:", error);
    console.error("3D car model component details:", info.componentStack);
  }

  componentDidUpdate(previousProps: ErrorBoundaryProps) {
    if (
      previousProps.children !== this.props.children &&
      this.state.hasError
    ) {
      this.setState({
        hasError: false,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

/**
 * Loading indicator.
 */
function ModelLoading() {
  return (
    <Html center>
      <div className="bmw-scn-loading">
        <div className="bmw-scn-loading__spinner" />

        <span>Loading 3D vehicle...</span>
      </div>
    </Html>
  );
}

/**
 * Error message displayed when a model cannot be loaded.
 */
function ModelErrorMessage() {
  return (
    <Html center>
      <div className="bmw-scn-error">
        <strong>3D model unavailable</strong>
        <span>Check the model URL and backend file access.</span>
      </div>
    </Html>
  );
}

/**
 * Load a real GLB/GLTF model.
 */
function UploadedModel({
  url,
  bodyColor,
  interiorColor,
  rimColor,
  wheelScale = 1,
}: UploadedModelProps) {
  const { scene } = useGLTF(url);

  const groupRef = useRef<THREE.Group>(null);

  const model = useMemo(() => {
    const clonedScene = scene.clone(true);

    const paintColor = new THREE.Color(bodyColor);
    const interiorPaintColor = new THREE.Color(
      interiorColor || "#171717"
    );
    const wheelPaintColor = new THREE.Color(rimColor || "#b8b8b8");

    clonedScene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) {
        return;
      }

      // Clone materials so changing one car does not modify
      // the original cached GLTF materials.
      const originalMaterials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      const clonedMaterials = originalMaterials.map((material) => {
        const clonedMaterial = material.clone();

        const materialName = clonedMaterial.name.toLowerCase();
        const meshName = object.name.toLowerCase();

        const combinedName = `${meshName} ${materialName}`;

        const isGlass =
          /glass|window|windshield|windscreen|transparent/.test(
            combinedName
          );

        const isTire =
          /tire|tyre|rubber/.test(combinedName);

        const isWheel =
          /wheel|rim|alloy|hubcap/.test(combinedName);

        const isInterior =
          /interior|seat|dashboard|leather|upholstery/.test(
            combinedName
          );

        const isBody =
          /body|paint|exterior|carpaint|chassis|shell/.test(
            combinedName
          );

        if (
          clonedMaterial instanceof THREE.MeshStandardMaterial ||
          clonedMaterial instanceof THREE.MeshPhysicalMaterial
        ) {
          if (isGlass) {
            clonedMaterial.roughness = Math.min(
              clonedMaterial.roughness,
              0.25
            );
          } else if (isTire) {
            clonedMaterial.color.set("#171717");
            clonedMaterial.roughness = 0.85;
          } else if (isInterior) {
            clonedMaterial.color.copy(interiorPaintColor);
          } else if (isWheel) {
            clonedMaterial.color.copy(wheelPaintColor);
            clonedMaterial.metalness = Math.max(
              clonedMaterial.metalness,
              0.65
            );
            clonedMaterial.roughness = Math.min(
              clonedMaterial.roughness,
              0.4
            );
          } else if (isBody) {
            clonedMaterial.color.copy(paintColor);
            clonedMaterial.metalness = Math.max(
              clonedMaterial.metalness,
              0.25
            );
            clonedMaterial.roughness = Math.min(
              clonedMaterial.roughness,
              0.35
            );
          }
        }

        return clonedMaterial;
      });

      object.material = Array.isArray(object.material)
        ? clonedMaterials
        : clonedMaterials[0];

      object.castShadow = true;
      object.receiveShadow = true;
    });

    // Normalize the model dimensions and center it around the origin.
    const initialBox = new THREE.Box3().setFromObject(clonedScene);
    const initialSize = initialBox.getSize(new THREE.Vector3());
    const initialCenter = initialBox.getCenter(new THREE.Vector3());

    if (
      initialSize.x > 0 &&
      initialSize.y > 0 &&
      initialSize.z > 0
    ) {
      clonedScene.position.sub(initialCenter);

      const largestDimension = Math.max(
        initialSize.x,
        initialSize.y,
        initialSize.z
      );

      // Keep differently sized GLB files at a similar display size.
      const normalizationScale = 4.5 / largestDimension;

      clonedScene.scale.multiplyScalar(normalizationScale);
    }

    return clonedScene;
  }, [scene, bodyColor, interiorColor, rimColor]);

  useEffect(() => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.scale.setScalar(wheelScale);
  }, [wheelScale]);

  return (
    <group ref={groupRef} position={[0, -0.35, 0]}>
      <primitive object={model} />
    </group>
  );
}

/**
 * A simple fallback model.
 *
 * This is only a placeholder, not a realistic vehicle model.
 * Upload a real GLB/GLTF model for realistic showroom rendering.
 */
function FallbackCar({ color }: { color: string }) {
  const bodyColor = useMemo(
    () => new THREE.Color(color),
    [color]
  );

  const wheelPositions: [number, number, number][] = [
    [-1.05, -0.25, 0.7],
    [1.05, -0.25, 0.7],
    [-1.05, -0.25, -0.7],
    [1.05, -0.25, -0.7],
  ];

  return (
    <group position={[0, -0.25, 0]}>
      {/* Main body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[3.4, 0.65, 1.45]} />

        <meshPhysicalMaterial
          color={bodyColor}
          metalness={0.65}
          roughness={0.25}
          clearcoat={1}
          clearcoatRoughness={0.15}
        />
      </mesh>

      {/* Cabin */}
      <mesh castShadow position={[0.05, 0.52, 0]}>
        <boxGeometry args={[1.65, 0.7, 1.12]} />

        <meshPhysicalMaterial
          color="#202b35"
          metalness={0.25}
          roughness={0.2}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Wheels */}
      {wheelPositions.map((position, index) => (
        <group key={index} position={position}>
          <mesh
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.36, 0.36, 0.22, 32]} />

            <meshStandardMaterial
              color="#171717"
              roughness={0.85}
            />
          </mesh>

          <mesh
            position={[position[0] < 0 ? -0.12 : 0.12, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.19, 0.19, 0.23, 24]} />

            <meshStandardMaterial
              color="#c0c0c0"
              metalness={0.85}
              roughness={0.25}
            />
          </mesh>
        </group>
      ))}

      {/* Headlights */}
      <mesh position={[1.72, 0.05, 0.42]}>
        <boxGeometry args={[0.05, 0.15, 0.3]} />

        <meshStandardMaterial
          color="#f8fafc"
          emissive="#ffffff"
          emissiveIntensity={0.35}
        />
      </mesh>

      <mesh position={[1.72, 0.05, -0.42]}>
        <boxGeometry args={[0.05, 0.15, 0.3]} />

        <meshStandardMaterial
          color="#f8fafc"
          emissive="#ffffff"
          emissiveIntensity={0.35}
        />
      </mesh>
    </group>
  );
}

/**
 * Main 3D configurator scene.
 */
export default function ConfiguratorScene({
  car,
  color,
  interiorColor = "#171717",
  wheelName,
  wheelDesign,
  wheelSize,
  baseWheelSize,
}: Props) {
  const modelUrl = useMemo(
    () => resolveModelUrl(car.modelUrl),
    [car.modelUrl]
  );

  const [modelFailed, setModelFailed] = useState(false);

  useEffect(() => {
    setModelFailed(false);
  }, [modelUrl]);

  const wheelScale = useMemo(() => {
    if (!wheelSize || !baseWheelSize || baseWheelSize <= 0) {
      return 1;
    }

    return THREE.MathUtils.clamp(
      wheelSize / baseWheelSize,
      0.85,
      1.2
    );
  }, [wheelSize, baseWheelSize]);

  const rimColor = useMemo(() => {
    const value = `${wheelName || ""} ${wheelDesign || ""}`.toLowerCase();

    if (/black|dark|shadow/.test(value)) {
      return "#242424";
    }

    if (/gold|bronze/.test(value)) {
      return "#b08d57";
    }

    if (/chrome|silver|alloy|diamond/.test(value)) {
      return "#c6c6c6";
    }

    return "#a8a8a8";
  }, [wheelName, wheelDesign]);

  const useFallback = !modelUrl || modelFailed;

  return (
    <div className="bmw-scn">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{
          position: [5.5, 2.7, 6],
          fov: 35,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <color attach="background" args={["#f3f4f6"]} />

        {/* Lighting */}
        <ambientLight intensity={1.1} />

        <hemisphereLight
          intensity={1.3}
          color="#ffffff"
          groundColor="#777777"
        />

        <directionalLight
          position={[5, 8, 5]}
          intensity={2.4}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <directionalLight
          position={[-5, 4, -4]}
          intensity={1.3}
          color="#dce8ff"
        />

        <spotLight
          position={[0, 7, 2]}
          intensity={1.2}
          angle={0.7}
          penumbra={1}
        />

        {/* Car model */}
        {useFallback ? (
          <FallbackCar color={color} />
        ) : (
          <Suspense fallback={<ModelLoading />}>
            <ModelErrorBoundary
              key={modelUrl}
              fallback={<ModelErrorMessage />}
            >
              <UploadedModel
                url={modelUrl}
                bodyColor={color}
                interiorColor={interiorColor}
                rimColor={rimColor}
                wheelScale={wheelScale}
              />
            </ModelErrorBoundary>
          </Suspense>
        )}

        {/* Floor shadow */}
        <ContactShadows
          position={[0, -0.9, 0]}
          opacity={0.4}
          scale={12}
          blur={2.5}
          far={4}
          resolution={512}
        />

        {/* 360-degree rotation and zoom */}
        <OrbitControls
          makeDefault
          enableRotate
          enableZoom
          enablePan={false}
          minDistance={3}
          maxDistance={12}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2}
          rotateSpeed={0.8}
          zoomSpeed={0.8}
          target={[0, 0, 0]}
        />
      </Canvas>

      {/* Vehicle information */}
      <div className="bmw-scn-hud">
        {useFallback && (
          <span className="bmw-scn-hud__warning">
            {modelUrl
              ? "Unable to load model. Showing preview."
              : "No 3D model configured."}
          </span>
        )}
      </div>

      <div className="bmw-scn-hint">
        <span>Drag to rotate</span>
        <span>Scroll to zoom</span>
      </div>
    </div>
  );
}
