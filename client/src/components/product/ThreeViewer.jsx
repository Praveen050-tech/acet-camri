import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RotateCw, Maximize2, Layers } from 'lucide-react';

export const ThreeViewer = ({ geometryType = 'bust', initialMaterial = 'marble' }) => {
  const mountRef = useRef(null);
  const [activeMat, setActiveMat] = useState(initialMaterial);
  const [wireframe, setWireframe] = useState(false);
  const sceneRef = useRef(null);
  const meshRef = useRef(null);
  const rendererRef = useRef(null);

  const materials = [
    { id: 'marble', name: 'Pure White SLA Resin', color: '#ffffff', rough: 0.15, metal: 0.05, clearcoat: 0.8 },
    { id: 'green', name: 'ACET Emerald Green SLA', color: '#00714C', rough: 0.25, metal: 0.15, clearcoat: 0.6 },
    { id: 'nylon', name: 'PA12 Carbon Nylon', color: '#2b2b2b', rough: 0.85, metal: 0.1, clearcoat: 0.0 },
    { id: 'gold', name: 'Imperial Cold Brass', color: '#D4AF37', rough: 0.2, metal: 0.9, clearcoat: 0.5 }
  ];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 350;

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 3.8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Studio Lighting in Clean Neutral Light Studio
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.2);
    fillLight.position.set(-5, 3, -2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x00714C, 1.8, 10);
    rimLight.position.set(0, -3, -4);
    scene.add(rimLight);

    // Procedural Geometries
    const currentMatConfig = materials.find((m) => m.id === activeMat) || materials[0];
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(currentMatConfig.color),
      roughness: currentMatConfig.rough,
      metalness: currentMatConfig.metal,
      clearcoat: currentMatConfig.clearcoat,
      clearcoatRoughness: 0.1,
      wireframe: wireframe
    });

    let mainObject;
    if (geometryType === 'h2cMachine') {
      mainObject = new THREE.Group();
      mainObject.position.y = -0.5;

      const blackMat = new THREE.MeshStandardMaterial({ color: '#111111', roughness: 0.9, metalness: 0.2 });
      const silverMat = new THREE.MeshStandardMaterial({ color: '#e0e0e0', roughness: 0.4, metalness: 0.5 });
      const glassMat = new THREE.MeshPhysicalMaterial({ color: '#ffffff', transparent: true, opacity: 0.15, roughness: 0.0, clearcoat: 1.0 });

      // 1. Printer Base
      const baseGeom = new THREE.BoxGeometry(2.2, 0.4, 2.2);
      const baseMesh = new THREE.Mesh(baseGeom, blackMat);
      baseMesh.position.y = 0.2;
      mainObject.add(baseMesh);

      // 2. Side Panels (Silver)
      const panelGeom = new THREE.BoxGeometry(0.2, 2.2, 2.0);
      const leftPanel = new THREE.Mesh(panelGeom, silverMat);
      leftPanel.position.set(-1.0, 1.5, 0);
      const rightPanel = new THREE.Mesh(panelGeom, silverMat);
      rightPanel.position.set(1.0, 1.5, 0);
      mainObject.add(leftPanel, rightPanel);

      // 3. Back Panel
      const backGeom = new THREE.BoxGeometry(1.8, 2.2, 0.2);
      const backPanel = new THREE.Mesh(backGeom, blackMat);
      backPanel.position.set(0, 1.5, -1.0);
      mainObject.add(backPanel);

      // 4. Top Frame
      const topGeom = new THREE.BoxGeometry(2.2, 0.3, 2.2);
      const topMesh = new THREE.Mesh(topGeom, blackMat);
      topMesh.position.y = 2.75;
      mainObject.add(topMesh);

      // 5. Front Glass Door
      const glassGeom = new THREE.BoxGeometry(1.8, 2.1, 0.05);
      const glassDoor = new THREE.Mesh(glassGeom, glassMat);
      glassDoor.position.set(0, 1.5, 1.0);
      mainObject.add(glassDoor);

      // 6. Build Plate
      const bedGeom = new THREE.BoxGeometry(1.5, 0.05, 1.5);
      const bedMat = new THREE.MeshStandardMaterial({ color: '#333333', roughness: 0.6 });
      const bedMesh = new THREE.Mesh(bedGeom, bedMat);
      bedMesh.position.y = 0.6;
      mainObject.add(bedMesh);

      // 7. Extruder and Gantry
      const gantryGeom = new THREE.CylinderGeometry(0.03, 0.03, 1.8);
      gantryGeom.rotateZ(Math.PI / 2);
      const gantryMesh = new THREE.Mesh(gantryGeom, silverMat);
      gantryMesh.position.set(0, 2.3, 0);
      mainObject.add(gantryMesh);

      const headGeom = new THREE.BoxGeometry(0.3, 0.4, 0.3);
      const headMat = new THREE.MeshStandardMaterial({ color: '#dddddd' });
      const headMesh = new THREE.Mesh(headGeom, headMat);
      headMesh.position.set(0, 2.15, 0);
      
      const nozzleGeom = new THREE.ConeGeometry(0.05, 0.1, 16);
      const nozzleMesh = new THREE.Mesh(nozzleGeom, blackMat);
      nozzleMesh.position.set(0, -0.25, 0);
      headMesh.add(nozzleMesh);
      mainObject.add(headMesh);

      // 8. AMS (Spool Holder) on Top
      const amsBaseGeom = new THREE.BoxGeometry(1.8, 0.6, 1.2);
      const amsGlassMat = new THREE.MeshPhysicalMaterial({ color: '#222222', transparent: true, opacity: 0.7, roughness: 0.1 });
      const amsMesh = new THREE.Mesh(amsBaseGeom, amsGlassMat);
      amsMesh.position.set(0, 3.2, -0.2);
      mainObject.add(amsMesh);

      const colors = ['#111111', '#dddddd', '#ff6600', '#00aa00'];
      for (let i = 0; i < 4; i++) {
        const spoolGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.15, 32);
        spoolGeom.rotateZ(Math.PI / 2);
        const spoolMat = new THREE.MeshStandardMaterial({ color: colors[i], roughness: 0.8 });
        const spoolMesh = new THREE.Mesh(spoolGeom, spoolMat);
        spoolMesh.position.set(-0.6 + i * 0.4, 3.2, -0.2);
        mainObject.add(spoolMesh);
      }

      // 9. Display Screen
      const screenGeom = new THREE.BoxGeometry(0.5, 0.3, 0.1);
      const screenMesh = new THREE.Mesh(screenGeom, blackMat);
      screenMesh.position.set(-0.7, 2.6, 1.1);
      
      const glowGeom = new THREE.PlaneGeometry(0.4, 0.2);
      const glowMat = new THREE.MeshBasicMaterial({ color: '#00aaff' });
      const glowMesh = new THREE.Mesh(glowGeom, glowMat);
      glowMesh.position.set(0, 0, 0.055);
      screenMesh.add(glowMesh);
      mainObject.add(screenMesh);

      // 10. Printed Object (Robot Mech)
      const printGroup = new THREE.Group();
      printGroup.name = 'printMesh';
      printGroup.position.y = 1.0;

      // Body
      const bodyGeom = new THREE.BoxGeometry(0.3, 0.4, 0.2);
      const bodyMesh = new THREE.Mesh(bodyGeom, mat);
      bodyMesh.position.y = 0.2;
      printGroup.add(bodyMesh);

      // Head
      const robotHeadGeom = new THREE.BoxGeometry(0.18, 0.18, 0.18);
      const robotHeadMesh = new THREE.Mesh(robotHeadGeom, mat);
      robotHeadMesh.position.y = 0.5;
      printGroup.add(robotHeadMesh);

      // Left Arm
      const armGeom = new THREE.BoxGeometry(0.1, 0.35, 0.1);
      const leftArm = new THREE.Mesh(armGeom, mat);
      leftArm.position.set(-0.25, 0.2, 0);
      leftArm.rotation.z = Math.PI / 8;
      printGroup.add(leftArm);

      // Right Arm
      const rightArm = new THREE.Mesh(armGeom, mat);
      rightArm.position.set(0.25, 0.2, 0);
      rightArm.rotation.z = -Math.PI / 8;
      printGroup.add(rightArm);

      // Left Leg
      const legGeom = new THREE.BoxGeometry(0.12, 0.4, 0.12);
      const leftLeg = new THREE.Mesh(legGeom, mat);
      leftLeg.position.set(-0.1, -0.2, 0);
      printGroup.add(leftLeg);

      // Right Leg
      const rightLeg = new THREE.Mesh(legGeom, mat);
      rightLeg.position.set(0.1, -0.2, 0);
      printGroup.add(rightLeg);

      // Scale to fit bed
      printGroup.scale.set(1.2, 1.2, 1.2);
      printGroup.position.y = 1.0;
      mainObject.add(printGroup);

      mainObject.scale.set(0.6, 0.6, 0.6);
    } else {
      let geom;
      if (geometryType === 'gearOrb') {
        geom = new THREE.TorusKnotGeometry(0.85, 0.28, 128, 32, 2, 3);
      } else if (geometryType === 'voronoiLamp') {
        geom = new THREE.IcosahedronGeometry(1.0, 3);
      } else if (geometryType === 'architecturalTower') {
        geom = new THREE.CylinderGeometry(0.5, 0.9, 1.8, 8, 4);
      } else if (geometryType === 'ribbonVase') {
        geom = new THREE.ConeGeometry(0.9, 1.9, 32, 16, true);
      } else {
        geom = new THREE.DodecahedronGeometry(1.0, 2);
      }
      mainObject = new THREE.Mesh(geom, mat);
    }

    scene.add(mainObject);
    meshRef.current = mainObject;

    // Orbit Controls for 360 degree view
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;
    controls.enablePan = false;
    controls.minDistance = 2.0;
    controls.maxDistance = 8.0;

    // Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update(); // Required if damping or autoRotate is enabled
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
    };
  }, [geometryType]);

  // Update material dynamically
  useEffect(() => {
    if (!meshRef.current) return;
    const currentMatConfig = materials.find((m) => m.id === activeMat) || materials[0];
    
    const updateMat = (mesh) => {
      if (!mesh || !mesh.material) return;
      mesh.material.color = new THREE.Color(currentMatConfig.color);
      mesh.material.roughness = currentMatConfig.rough;
      mesh.material.metalness = currentMatConfig.metal;
      mesh.material.clearcoat = currentMatConfig.clearcoat;
      mesh.material.wireframe = wireframe;
      mesh.material.needsUpdate = true;
    };

    if (meshRef.current.isGroup) {
      const target = meshRef.current.getObjectByName('printMesh');
      if (target) {
        if (target.isGroup) {
          target.traverse((child) => {
            if (child.isMesh) updateMat(child);
          });
        } else {
          updateMat(target);
        }
      }
    } else {
      updateMat(meshRef.current);
    }
  }, [activeMat, wireframe]);

  return (
    <div className="relative w-full h-[360px] bg-gradient-to-b from-[#F3F4F6] to-[#E5E7EB] border border-gray-300 rounded-3xl overflow-hidden shadow-inner flex flex-col">
      
      {/* 3D Canvas Stage */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <span className="bg-white/90 backdrop-blur-xs border border-gray-300 text-[#00714C] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
          WebGL 50-Micron PBR Inspector
        </span>

        <button 
          onClick={() => setWireframe(!wireframe)}
          className="pointer-events-auto bg-white/90 backdrop-blur-xs border border-gray-300 hover:border-[#00714C] text-gray-700 hover:text-[#00714C] text-xs px-3 py-1 rounded-xl flex items-center gap-1 transition-all shadow-xs"
        >
          <Layers size={12} />
          <span className="font-semibold">{wireframe ? 'Shaded' : 'Wireframe Mesh'}</span>
        </button>
      </div>

      {/* Bottom Swatch Controls */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-white/95 backdrop-blur-xs border border-gray-200 p-2 rounded-2xl z-10 shadow-sm">
        <span className="text-[11px] text-gray-600 font-bold pl-2">Materials:</span>
        <div className="flex items-center gap-1.5">
          {materials.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveMat(m.id)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                activeMat === m.id
                  ? 'bg-[#00714C] text-white shadow-sm scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
