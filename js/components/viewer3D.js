/**
 * ACET 3D — Real-Time Three.js WebGL 3D Model Viewport Engine
 * Features: OrbitControls, Lighting presets, Red Wine & Marble PBR dynamic materials
 */

export class Acet3DViewer {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    this.options = {
      geometryType: options.geometryType || 'bust',
      materialType: options.materialType || 'resin',
      wireframe: options.wireframe || false,
      autoRotate: options.autoRotate !== undefined ? options.autoRotate : true,
      ...options
    };

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.meshGroup = null;
    this.mainMesh = null;
    this.internalLight = null;
    this.animationFrameId = null;

    this.init();
  }

  init() {
    if (!window.THREE) {
      setTimeout(() => this.init(), 100);
      return;
    }

    const width = this.container.clientWidth || 400;
    const height = this.container.clientHeight || 400;

    // 1. Scene Setup
    this.scene = new THREE.Scene();
    this.scene.background = null;

    // 2. Camera Setup
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 7.5);

    // 3. Renderer Setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;

    const existingCanvas = this.container.querySelector('canvas');
    if (existingCanvas) existingCanvas.remove();

    this.renderer.domElement.className = 'viewer3d-canvas';
    this.container.appendChild(this.renderer.domElement);

    // 4. OrbitControls
    if (window.THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.autoRotate = this.options.autoRotate;
      this.controls.autoRotateSpeed = 1.8;
      this.controls.minDistance = 3.5;
      this.controls.maxDistance = 14;
      this.controls.maxPolarAngle = Math.PI / 1.7;
    }

    // 5. Studio Lighting
    this.setupLighting();

    // 6. Build Geometry & Material
    this.meshGroup = new THREE.Group();
    this.scene.add(this.meshGroup);
    this.buildGeometry(this.options.geometryType);

    // 7. Event Listeners
    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);

    // 8. Start Render Loop
    this.animate = this.animate.bind(this);
    this.animate();
  }

  setupLighting() {
    // Ambient Warm Light
    const ambientLight = new THREE.AmbientLight(0x4a1428, 1.4);
    this.scene.add(ambientLight);

    // Key Light (Imperial Gold / Alabaster Glow)
    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.4);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    this.scene.add(keyLight);

    // Fill Light (Bordeaux Red Wine)
    const fillLight = new THREE.DirectionalLight(0x8b1e4b, 1.8);
    fillLight.position.set(-6, -2, -4);
    this.scene.add(fillLight);

    // Rim Light (Gold Highlights)
    const rimLight = new THREE.PointLight(0xd4af37, 2.2, 20);
    rimLight.position.set(0, 6, -5);
    this.scene.add(rimLight);

    // Internal Light (for Voronoi Lamps)
    this.internalLight = new THREE.PointLight(0xffd166, 0, 10);
    this.internalLight.position.set(0, 0, 0);
    this.scene.add(this.internalLight);
  }

  getMaterial(matType) {
    const isWireframe = this.options.wireframe;
    switch (matType) {
      case 'resin':
        // Carrara Marble SLA Composite
        return new THREE.MeshPhysicalMaterial({
          color: 0xfcf9f5,
          emissive: 0x1f0812,
          roughness: 0.22,
          metalness: 0.05,
          transmission: 0.15,
          ior: 1.52,
          clearcoat: 0.6,
          clearcoatRoughness: 0.15,
          wireframe: isWireframe
        });
      case 'pla':
        // Deep Bordeaux Red Wine PLA
        return new THREE.MeshStandardMaterial({
          color: 0x540d2a,
          roughness: 0.7,
          metalness: 0.15,
          wireframe: isWireframe
        });
      case 'nylon':
        // Merlot Dark Nylon
        return new THREE.MeshStandardMaterial({
          color: 0x2c0916,
          roughness: 0.55,
          metalness: 0.3,
          wireframe: isWireframe
        });
      case 'metal':
        // Imperial Polished Brass / Gold
        return new THREE.MeshStandardMaterial({
          color: 0xd4af37,
          roughness: 0.28,
          metalness: 0.9,
          wireframe: isWireframe
        });
      default:
        return new THREE.MeshPhysicalMaterial({
          color: 0xfcf9f5,
          roughness: 0.25,
          metalness: 0.05,
          wireframe: isWireframe
        });
    }
  }

  buildGeometry(type) {
    while (this.meshGroup.children.length > 0) {
      const obj = this.meshGroup.children[0];
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
      this.meshGroup.remove(obj);
    }

    const material = this.getMaterial(this.options.materialType);
    let geom;

    if (type === 'bust' || type === 'sculpture') {
      const headGeom = new THREE.IcosahedronGeometry(1.6, 3);
      const neckGeom = new THREE.CylinderGeometry(0.7, 1.2, 1.2, 16);
      neckGeom.translate(0, -1.8, 0);
      const shoulderGeom = new THREE.BoxGeometry(3.6, 0.6, 1.6);
      shoulderGeom.translate(0, -2.4, 0);

      this.mainMesh = new THREE.Mesh(headGeom, material);
      const neck = new THREE.Mesh(neckGeom, material);
      const shoulders = new THREE.Mesh(shoulderGeom, material);

      this.meshGroup.add(this.mainMesh);
      this.meshGroup.add(neck);
      this.meshGroup.add(shoulders);
      this.meshGroup.position.y = 0.5;

    } else if (type === 'voronoiLamp') {
      geom = new THREE.TorusGeometry(1.6, 0.75, 24, 64);
      this.mainMesh = new THREE.Mesh(geom, material);
      this.meshGroup.add(this.mainMesh);
      if (this.internalLight) this.internalLight.intensity = 3.0;

    } else if (type === 'gearOrb') {
      const ring1Geom = new THREE.TorusGeometry(2.0, 0.12, 16, 64);
      const ring2Geom = new THREE.TorusGeometry(1.5, 0.1, 16, 64);
      const ring3Geom = new THREE.TorusGeometry(1.0, 0.08, 16, 64);
      const coreGeom = new THREE.IcosahedronGeometry(0.5, 2);

      this.ring1 = new THREE.Mesh(ring1Geom, material);
      this.ring2 = new THREE.Mesh(ring2Geom, material);
      this.ring3 = new THREE.Mesh(ring3Geom, material);
      this.core = new THREE.Mesh(coreGeom, material);

      this.meshGroup.add(this.ring1);
      this.meshGroup.add(this.ring2);
      this.meshGroup.add(this.ring3);
      this.meshGroup.add(this.core);
      this.mainMesh = this.ring1;

    } else if (type === 'architecturalTower') {
      const base = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.3, 2.8), material);
      base.position.y = -1.6;
      const mid = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 2.2, 8), material);
      const topDome = new THREE.Mesh(new THREE.SphereGeometry(1.1, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), material);
      topDome.position.y = 1.1;

      this.meshGroup.add(base);
      this.meshGroup.add(mid);
      this.meshGroup.add(topDome);
      this.mainMesh = mid;

    } else if (type === 'ribbonVase') {
      geom = new THREE.CylinderGeometry(0.9, 1.4, 3.2, 32, 32);
      const pos = geom.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const angle = y * 0.8;
        const x = pos.getX(i);
        const z = pos.getZ(i);
        pos.setX(i, x * Math.cos(angle) - z * Math.sin(angle));
        pos.setZ(i, x * Math.sin(angle) + z * Math.cos(angle));
      }
      geom.computeVertexNormals();
      this.mainMesh = new THREE.Mesh(geom, material);
      this.meshGroup.add(this.mainMesh);
    } else {
      geom = new THREE.OctahedronGeometry(1.8, 2);
      this.mainMesh = new THREE.Mesh(geom, material);
      this.meshGroup.add(this.mainMesh);
    }
  }

  setMaterial(matType) {
    this.options.materialType = matType;
    const newMat = this.getMaterial(matType);
    this.meshGroup.traverse(child => {
      if (child.isMesh) {
        child.material = newMat;
      }
    });
  }

  toggleWireframe() {
    this.options.wireframe = !this.options.wireframe;
    this.meshGroup.traverse(child => {
      if (child.isMesh && child.material) {
        child.material.wireframe = this.options.wireframe;
      }
    });
    return this.options.wireframe;
  }

  toggleAutoRotate() {
    if (this.controls) {
      this.controls.autoRotate = !this.controls.autoRotate;
      return this.controls.autoRotate;
    }
    return false;
  }

  resetCamera() {
    if (this.controls) {
      this.controls.reset();
      this.camera.position.set(0, 0, 7.5);
    }
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || 400;
    const height = this.container.clientHeight || 400;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate);

    if (this.controls) {
      this.controls.update();
    }

    if (this.options.geometryType === 'gearOrb') {
      if (this.ring1) this.ring1.rotation.x += 0.015;
      if (this.ring2) this.ring2.rotation.y += 0.02;
      if (this.ring3) this.ring3.rotation.z += 0.025;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  destroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.onResize);
    if (this.controls) this.controls.dispose();
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}
