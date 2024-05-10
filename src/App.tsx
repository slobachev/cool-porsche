import {
  AccumulativeShadows,
  Center,
  Environment,
  OrbitControls,
  RandomizedLight,
  useEnvironment,
  useGLTF,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer, N8AO, ToneMapping } from '@react-three/postprocessing';
import { useEffect, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { proxy, useSnapshot } from 'valtio';

const state = proxy({
  current: '',
  items: {
    trim: '#ffffff',
    wheels: '#ffffff',
    headlights: '#ffffff',
    details: '#645F63',
    title: '#645F63',
    rearlights: '#C72A35',
    under: '#000',
    windows: '#000',
    glass: '#ffffff',
    lights: '#ffffff',
    rims: '#ffffff',
  },
});

function Car() {
  const ref = useRef();
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF('porsche.glb');
  const {
    trim,
    details,
    headlights,
    title,
    logo,
    rearlights,
    under,
    windows,
    glass,
    lights,
    headlightsGlass,
    rims: wheels,
  } = nodes || {};
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${snap.items[hovered]}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="white-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="35" y="63">${hovered}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`;
    const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`;
    document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(
      hovered ? cursor : auto,
    )}'), auto`;
  }, [hovered, snap.items]);

  return (
    <group
      ref={ref}
      dispose={null}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(e.object.material.name))}
      onPointerOut={(e) => e.intersections.length === 0 && setHovered(null)}
      onPointerMissed={() => (state.current = '')}
      onPointerDown={(e) => (e.stopPropagation(), (state.current = e.object.material.name))}
    >
      {trim?.children?.map((m) => (
        <mesh
          castShadow
          key={m.id}
          geometry={m.geometry}
          material={materials.trim}
          material-color={snap.items.trim}
        />
      ))}
      {headlights?.children?.map((m) => (
        <mesh
          key={m.id}
          geometry={m.geometry}
          material={materials.headlights}
          material-color={snap.items.headlights}
          castShadow
        />
      ))}
      {rearlights?.children?.map((m) => (
        <mesh
          key={m.id}
          geometry={m.geometry}
          material={materials.rearlights}
          material-color={snap.items.rearlights}
          castShadow
        />
      ))}
      {windows?.children?.map((m) => (
        <mesh
          key={m.id}
          geometry={m.geometry}
          rotation={[-Math.PI / 2, 0, 0]}
          material={materials.windows}
          material-color={snap.items.windows}
          castShadow
        />
      ))}
      <mesh
        geometry={under.geometry}
        material={materials.under}
        material-color={snap.items.under}
        castShadow
      />
      <mesh geometry={glass.geometry} material={materials.glass} castShadow />
      <mesh
        geometry={details.geometry}
        material={materials.details}
        material-color={snap.items.details}
        castShadow
      />
      <mesh geometry={headlightsGlass.geometry} material={materials.headlightsGlass} castShadow />
      <mesh
        geometry={rearlights.geometry}
        material={materials.rearlights}
        material-color={snap.items.rearlights}
        castShadow
      />
      <mesh
        geometry={lights.geometry}
        material={materials.lights}
        material-color={snap.items.lights}
        castShadow
      />
      <mesh
        geometry={title.geometry}
        material={materials.title}
        material-color={snap.items.title}
      />
      <mesh geometry={logo.geometry} material={materials.logo} material-color={snap.items.logo} />
      <mesh
        geometry={wheels.geometry}
        material={materials.rims}
        material-color={snap.items.rims}
        castShadow
      />
    </group>
  );
}

function Picker() {
  const snap = useSnapshot(state);
  return (
    <div className="pickerWrapper" style={{ display: snap.current ? 'flex' : 'none' }}>
      <HexColorPicker
        className="picker"
        color={snap.items[snap.current]}
        onChange={(color) => (state.items[snap.current] = color)}
      />
      <h1>{snap.current}</h1>
    </div>
  );
}

function Env() {
  const env = useEnvironment({
    files: 'peppermint_powerplant_2_1k.hdr',
  });

  return <Environment map={env} background blur={1} />;
}

export default function App() {
  return (
    <>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: false }}
        camera={{ position: [-5, 5, 14], fov: 20 }}
      >
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <group position={[0, -0.25, 0]}>
          <Center top position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <Car />
          </Center>
          <AccumulativeShadows temporal frames={100} color={'#000000'} opacity={1.05}>
            <RandomizedLight radius={5} position={[10, 5, -5]} />
          </AccumulativeShadows>
        </group>
        <OrbitControls enablePan={false} minPolarAngle={0} maxPolarAngle={Math.PI / 2.25} />
        <EffectComposer>
          <N8AO aoRadius={0.15} intensity={4} distanceFalloff={2} />
          <Bloom luminanceThreshold={3.5} intensity={0.85} levels={9} mipmapBlur />
          <ToneMapping />
        </EffectComposer>
        <Env />
      </Canvas>
      <Picker />
    </>
  );
}
