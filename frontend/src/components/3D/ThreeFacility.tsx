"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Box,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Info,
  Layers,
  Activity,
  ShieldAlert,
  Flame,
  Zap,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Cpu,
  RotateCcw,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';

interface ThreeFacilityProps {
  onNavigate?: (tab: string) => void;
}

export default function ThreeFacility({ onNavigate }: ThreeFacilityProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'standard' | 'thermal' | 'power' | 'risk'>('standard');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [simulatedTemp, setSimulatedTemp] = useState<number>(68);
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null);

  // References for three.js manipulation
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const nodesMeshMapRef = useRef<{ mesh: THREE.Mesh; node: any; glowMesh?: THREE.Mesh }[]>([]);
  const pulseParticlesRef = useRef<THREE.Points | null>(null);

  // Initial Node Data Set (10 Nodes)
  const initialNodes = [
    {
      id: 1,
      name: 'Centrifugal Pump Unit #1',
      category: 'Pumps',
      status: 'Optimal',
      risk: 'Low',
      health: 98,
      temp: 62,
      pressure: 145,
      rpm: 2950,
      flowRate: '420 m³/h',
      x: -9,
      y: 2,
      z: -4,
      color: 0x2170e4,
      thermalColor: 0x10b981
    },
    {
      id: 2,
      name: 'High-Pressure Valve Stack',
      category: 'Valves',
      status: 'Optimal',
      risk: 'Low',
      health: 96,
      temp: 54,
      pressure: 210,
      rpm: 0,
      flowRate: '380 m³/h',
      x: -3,
      y: 3,
      z: 2,
      color: 0xa855f7,
      thermalColor: 0x10b981
    },
    {
      id: 3,
      name: '150kW AC Motor Drive Module',
      category: 'Motors',
      status: 'Warning',
      risk: 'Medium',
      health: 79,
      temp: 89,
      pressure: 0,
      rpm: 3450,
      flowRate: 'N/A',
      x: 4,
      y: 2.5,
      z: -3,
      color: 0xf59e0b,
      thermalColor: 0xef4444
    },
    {
      id: 4,
      name: 'Rotary Screw Compressor System',
      category: 'Compressors',
      status: 'Optimal',
      risk: 'Low',
      health: 95,
      temp: 71,
      pressure: 175,
      rpm: 1800,
      flowRate: '650 m³/h',
      x: 9,
      y: 4,
      z: 4,
      color: 0x06b6d4,
      thermalColor: 0x10b981
    },
    {
      id: 5,
      name: 'Supplier Logistics Hub (Chennai)',
      category: 'Supply Chain Node',
      status: 'Active',
      risk: 'Low',
      health: 99,
      temp: 28,
      pressure: 0,
      rpm: 0,
      flowRate: 'Freight Gateway',
      x: 0,
      y: 1,
      z: -9,
      color: 0x10b981,
      thermalColor: 0x3b82f6
    },
    {
      id: 6,
      name: 'Explosion Proof IE4 Motor #2',
      category: 'Motors',
      status: 'Optimal',
      risk: 'Low',
      health: 97,
      temp: 64,
      pressure: 0,
      rpm: 2980,
      flowRate: 'N/A',
      x: -6,
      y: 2,
      z: 6,
      color: 0x3b82f6,
      thermalColor: 0x10b981
    },
    {
      id: 7,
      name: 'Smart Vibration Telemetry Sensor Node',
      category: 'Sensors',
      status: 'Optimal',
      risk: 'Low',
      health: 100,
      temp: 35,
      pressure: 0,
      rpm: 0,
      flowRate: 'IoT Gateway',
      x: 2,
      y: 5,
      z: -7,
      color: 0xec4899,
      thermalColor: 0x10b981
    },
    {
      id: 8,
      name: 'API 6D Trunnion Control Valve',
      category: 'Valves',
      status: 'Warning',
      risk: 'Medium',
      health: 82,
      temp: 82,
      pressure: 195,
      rpm: 0,
      flowRate: '290 m³/h',
      x: 6,
      y: 2,
      z: 7,
      color: 0xf97316,
      thermalColor: 0xf59e0b
    }
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 18, 28);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Clean previous children
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);

    // Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x818cf8, 1.5);
    dirLight.position.set(15, 25, 20);
    scene.add(dirLight);

    const cyanPointLight = new THREE.PointLight(0x06b6d4, 2, 60);
    cyanPointLight.position.set(-15, 12, -10);
    scene.add(cyanPointLight);

    const purplePointLight = new THREE.PointLight(0xa855f7, 2, 60);
    purplePointLight.position.set(15, 12, 10);
    scene.add(purplePointLight);

    // Cyber Grid Floor
    const gridHelper = new THREE.GridHelper(36, 36, 0x6366f1, 0x1e293b);
    gridHelper.position.y = -0.1;
    scene.add(gridHelper);

    // Starfield Background Particles
    const starGeo = new THREE.BufferGeometry();
    const starCount = 300;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 80;
      starPositions[i + 1] = Math.random() * 40;
      starPositions[i + 2] = (Math.random() - 0.5) * 80;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x818cf8, size: 0.25, transparent: true, opacity: 0.6 });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Create 3D Meshes for Nodes
    nodesMeshMapRef.current = [];

    initialNodes.forEach((node) => {
      let geo: THREE.BufferGeometry;

      if (node.category === 'Pumps') {
        geo = new THREE.CylinderGeometry(1.3, 1.3, 2.8, 24);
      } else if (node.category === 'Valves') {
        geo = new THREE.SphereGeometry(1.4, 24, 24);
      } else if (node.category === 'Motors') {
        geo = new THREE.BoxGeometry(2.6, 2.6, 2.6);
      } else if (node.category === 'Compressors') {
        geo = new THREE.ConeGeometry(1.6, 3, 24);
      } else if (node.category === 'Sensors') {
        geo = new THREE.OctahedronGeometry(1.5);
      } else {
        geo = new THREE.DodecahedronGeometry(1.6);
      }

      const mat = new THREE.MeshStandardMaterial({
        color: node.color,
        roughness: 0.2,
        metalness: 0.8,
        emissive: node.color,
        emissiveIntensity: 0.15
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(node.x, node.y, node.z);
      mesh.userData = node;

      // Outer Selection / Health Ring Glow
      const ringGeo = new THREE.RingGeometry(1.8, 2.1, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: node.health < 80 ? 0xef4444 : 0x10b981,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const glowRing = new THREE.Mesh(ringGeo, ringMat);
      glowRing.rotation.x = Math.PI / 2;
      glowRing.position.set(node.x, 0.1, node.z);
      scene.add(glowRing);

      scene.add(mesh);
      nodesMeshMapRef.current.push({ mesh, node, glowMesh: glowRing });
    });

    // Pipeline Lines & Flow Particle Pulses
    const pipelinePoints = [
      new THREE.Vector3(-9, 2, -4),
      new THREE.Vector3(-3, 3, 2),
      new THREE.Vector3(4, 2.5, -3),
      new THREE.Vector3(9, 4, 4),
      new THREE.Vector3(6, 2, 7),
      new THREE.Vector3(-6, 2, 6),
      new THREE.Vector3(0, 1, -9)
    ];

    const lineGeo = new THREE.BufferGeometry().setFromPoints(pipelinePoints);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2, transparent: true, opacity: 0.6 });
    const line = new THREE.Line(lineGeo, lineMat);
    scene.add(line);

    // Animated Pipeline Flow Pulse Particles
    const pulseCount = 40;
    const pulsePositions = new Float32Array(pulseCount * 3);
    for (let i = 0; i < pulseCount; i++) {
      const pIdx = i % (pipelinePoints.length - 1);
      const p1 = pipelinePoints[pIdx];
      const p2 = pipelinePoints[pIdx + 1];
      const alpha = Math.random();
      pulsePositions[i * 3] = THREE.MathUtils.lerp(p1.x, p2.x, alpha);
      pulsePositions[i * 3 + 1] = THREE.MathUtils.lerp(p1.y, p2.y, alpha);
      pulsePositions[i * 3 + 2] = THREE.MathUtils.lerp(p1.z, p2.z, alpha);
    }

    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));
    const pulseMat = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.4, transparent: true, opacity: 0.9 });
    const pulseParticles = new THREE.Points(pulseGeo, pulseMat);
    pulseParticlesRef.current = pulseParticles;
    scene.add(pulseParticles);

    // Mouse Interaction Handling
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshesToRaycast = nodesMeshMapRef.current.map((item) => item.mesh);
      const intersects = raycaster.intersectObjects(meshesToRaycast);

      if (intersects.length > 0) {
        const hovered = intersects[0].object.userData;
        setHoveredNode(hovered);
        containerRef.current!.style.cursor = 'pointer';
      } else {
        setHoveredNode(null);
        containerRef.current!.style.cursor = 'default';
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshesToRaycast = nodesMeshMapRef.current.map((item) => item.mesh);
      const intersects = raycaster.intersectObjects(meshesToRaycast);

      if (intersects.length > 0) {
        const clicked = intersects[0].object.userData;
        setSelectedNode(clicked);
        setSimulatedTemp(clicked.temp);
        setDiagnosticResult(null);
      }
    };

    renderer.domElement.addEventListener('mousemove', handlePointerMove);
    renderer.domElement.addEventListener('click', handleClick);

    // Orbit Drag Controls (Pure JS implementation)
    let isMouseDown = false;
    let previousMousePosition = { x: 0, y: 0 };
    let cameraAngle = 0;

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMoveDrag = (e: MouseEvent) => {
      if (!isMouseDown || !cameraRef.current) return;
      const deltaX = e.clientX - previousMousePosition.x;
      cameraAngle += deltaX * 0.005;

      const radius = 30;
      cameraRef.current.position.x = radius * Math.sin(cameraAngle);
      cameraRef.current.position.z = radius * Math.cos(cameraAngle);
      cameraRef.current.lookAt(0, 0, 0);

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMoveDrag);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotate nodes & float pulse effect
      nodesMeshMapRef.current.forEach(({ mesh, glowMesh, node }) => {
        mesh.rotation.y += 0.008;
        mesh.position.y = node.y + Math.sin(elapsedTime * 2 + node.id) * 0.15;

        if (glowMesh) {
          glowMesh.rotation.z += 0.01;
        }
      });

      // Auto-Rotate Camera
      if (isAutoRotating && cameraRef.current && !isMouseDown) {
        cameraAngle += 0.002;
        const radius = 30;
        cameraRef.current.position.x = radius * Math.sin(cameraAngle);
        cameraRef.current.position.z = radius * Math.cos(cameraAngle);
        cameraRef.current.lookAt(0, 0, 0);
      }

      // Animate Pulse Particles
      if (pulseParticlesRef.current) {
        const positions = pulseParticlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < pulseCount; i++) {
          const pIdx = i % (pipelinePoints.length - 1);
          const p1 = pipelinePoints[pIdx];
          const p2 = pipelinePoints[pIdx + 1];

          let progress = (elapsedTime * 0.4 + i * 0.1) % 1;
          positions[i * 3] = THREE.MathUtils.lerp(p1.x, p2.x, progress);
          positions[i * 3 + 1] = THREE.MathUtils.lerp(p1.y, p2.y, progress) + Math.sin(progress * Math.PI) * 0.5;
          positions[i * 3 + 2] = THREE.MathUtils.lerp(p1.z, p2.z, progress);
        }
        pulseParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Window Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMoveDrag);
      window.removeEventListener('mouseup', onMouseUp);

      if (rendererRef.current?.domElement) {
        rendererRef.current.domElement.removeEventListener('mousemove', handlePointerMove);
        rendererRef.current.domElement.removeEventListener('click', handleClick);
        rendererRef.current.domElement.removeEventListener('mousedown', onMouseDown);

        if (containerRef.current && containerRef.current.contains(rendererRef.current.domElement)) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
      }
      rendererRef.current?.dispose();
    };
  }, [isAutoRotating]);

  // Update Visual Mode Colors dynamically
  useEffect(() => {
    nodesMeshMapRef.current.forEach(({ mesh, node }) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;

      if (activeCategory !== 'All' && node.category !== activeCategory) {
        mat.opacity = 0.2;
        mat.transparent = true;
        return;
      }

      mat.transparent = false;
      mat.opacity = 1.0;

      if (viewMode === 'thermal') {
        mat.color.setHex(node.thermalColor);
        mat.emissive.setHex(node.thermalColor);
        mat.emissiveIntensity = 0.4;
      } else if (viewMode === 'risk') {
        const riskColor = node.risk === 'High' ? 0xef4444 : node.risk === 'Medium' ? 0xf59e0b : 0x10b981;
        mat.color.setHex(riskColor);
        mat.emissive.setHex(riskColor);
        mat.emissiveIntensity = 0.3;
      } else if (viewMode === 'power') {
        mat.color.setHex(0x38bdf8);
        mat.emissive.setHex(0x0284c7);
        mat.emissiveIntensity = 0.5;
      } else {
        mat.color.setHex(node.color);
        mat.emissive.setHex(node.color);
        mat.emissiveIntensity = 0.15;
      }
    });
  }, [viewMode, activeCategory]);

  const handleCameraPreset = (preset: 'iso' | 'top' | 'front') => {
    if (!cameraRef.current) return;
    if (preset === 'iso') {
      cameraRef.current.position.set(0, 18, 28);
    } else if (preset === 'top') {
      cameraRef.current.position.set(0, 35, 0.1);
    } else if (preset === 'front') {
      cameraRef.current.position.set(0, 5, 32);
    }
    cameraRef.current.lookAt(0, 0, 0);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const factor = direction === 'in' ? 0.85 : 1.15;
    cameraRef.current.position.multiplyScalar(factor);
  };

  const runDiagnostic = () => {
    setIsDiagnosing(true);
    setDiagnosticResult(null);
    setTimeout(() => {
      setIsDiagnosing(false);
      if (selectedNode?.health < 85) {
        setDiagnosticResult(`AI Alert: Bearing friction anomaly detected on ${selectedNode.name}. Recommendation: Schedule preventative lubricant replacement within 72h.`);
      } else {
        setDiagnosticResult(`AI Audit Clean: ${selectedNode.name} operating within 99.4% nominal specifications.`);
      }
    }, 1200);
  };

  const categories = ['All', 'Pumps', 'Valves', 'Motors', 'Compressors', 'Sensors', 'Supply Chain Node'];

  return (
    <div
      className={`relative w-full ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen bg-slate-950' : 'h-[640px] rounded-2xl'
      } bg-slate-950 border border-indigo-500/30 overflow-hidden shadow-2xl transition-all duration-300 font-body-md`}
    >
      {/* 3D WebGL Canvas Render Area */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header Overlay Bar */}
      <div className="absolute top-4 left-4 right-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 z-10 pointer-events-none">
        {/* Title & Status */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-indigo-500/30 p-3.5 px-4 rounded-xl text-xs pointer-events-auto shadow-lg">
          <div className="flex items-center gap-2.5 font-bold text-white text-sm">
            <Cpu size={18} className="text-indigo-400 animate-pulse" />
            <span>3D Facility Digital Twin & Network</span>
            <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2 py-0.5 rounded font-mono border border-indigo-500/30">
              Live Telemetry
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Drag to rotate • Scroll to zoom • Click equipment node to inspect AI analytics
          </p>
        </div>

        {/* View Mode & Preset Controls */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-indigo-500/30 shadow-lg">
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setViewMode('standard')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                viewMode === 'standard' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Standard
            </button>
            <button
              onClick={() => setViewMode('thermal')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all flex items-center gap-1 ${
                viewMode === 'thermal' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Flame size={12} /> Heatmap
            </button>
            <button
              onClick={() => setViewMode('power')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all flex items-center gap-1 ${
                viewMode === 'power' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Zap size={12} /> Power Pulse
            </button>
            <button
              onClick={() => setViewMode('risk')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all flex items-center gap-1 ${
                viewMode === 'risk' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldAlert size={12} /> Risk Audit
            </button>
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          {/* Camera Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleCameraPreset('iso')}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-semibold"
              title="Isometric Perspective View"
            >
              ISO
            </button>
            <button
              onClick={() => handleCameraPreset('top')}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-semibold"
              title="Top-Down Plan View"
            >
              Top Plan
            </button>

            <button
              onClick={() => handleZoom('in')}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => handleZoom('out')}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`p-1.5 rounded transition-colors ${
                isAutoRotating ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
              title="Toggle Auto-Rotate"
            >
              {isAutoRotating ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 overflow-x-auto max-w-[80vw] sm:max-w-md bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-indigo-500/30 no-scrollbar shadow-lg">
        <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider px-1 flex items-center gap-1 shrink-0">
          <Filter size={10} /> Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Hover Node Tooltip */}
      {hoveredNode && !selectedNode && (
        <div className="absolute top-24 left-6 bg-slate-900/90 backdrop-blur-md border border-indigo-500/40 p-3 rounded-xl z-20 text-xs shadow-xl animate-in fade-in duration-150">
          <div className="font-bold text-white">{hoveredNode.name}</div>
          <div className="text-[10px] text-indigo-300 font-mono mt-0.5">{hoveredNode.category}</div>
          <div className="mt-1 flex items-center gap-2 text-[11px]">
            <span className="text-slate-400">Health:</span>
            <span className={`font-bold ${hoveredNode.health < 80 ? 'text-red-400' : 'text-emerald-400'}`}>
              {hoveredNode.health}%
            </span>
            <span className="text-slate-400">• Temp: {hoveredNode.temp}°C</span>
          </div>
        </div>
      )}

      {/* Selected Equipment Telemetry Inspection Modal / Panel */}
      {selectedNode && (
        <div className="absolute bottom-16 right-4 sm:bottom-4 w-[92vw] sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-indigo-500/50 p-4 sm:p-5 rounded-2xl shadow-2xl z-30 animate-in slide-in-from-right duration-200 text-xs">
          {/* Panel Header */}
          <div className="flex justify-between items-start border-b border-slate-800 pb-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold">
                  {selectedNode.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    selectedNode.status === 'Optimal'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {selectedNode.status}
                </span>
              </div>
              <h4 className="font-bold text-sm text-white mt-1">{selectedNode.name}</h4>
            </div>

            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-slate-800/70 p-2.5 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 text-[10px]">Health Rating</span>
              <div className="flex items-center justify-between mt-1">
                <span
                  className={`font-bold font-mono text-sm ${
                    selectedNode.health < 80 ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {selectedNode.health}%
                </span>
                <Activity size={14} className="text-indigo-400" />
              </div>
            </div>

            <div className="bg-slate-800/70 p-2.5 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 text-[10px]">Temperature</span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-bold font-mono text-sm text-white">{simulatedTemp}°C</span>
                <Flame size={14} className="text-amber-400" />
              </div>
            </div>

            <div className="bg-slate-800/70 p-2.5 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 text-[10px]">Operating Pressure</span>
              <div className="font-bold font-mono text-sm text-white mt-1">
                {selectedNode.pressure > 0 ? `${selectedNode.pressure} PSI` : 'Atmospheric'}
              </div>
            </div>

            <div className="bg-slate-800/70 p-2.5 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 text-[10px]">Flow / Throughput</span>
              <div className="font-bold font-mono text-xs text-white mt-1">{selectedNode.flowRate}</div>
            </div>
          </div>

          {/* Simulated Real-Time Waveform Bar */}
          <div className="mb-3 p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>Live Sensor Vibration FFT Spectrum</span>
              <span className="font-mono text-emerald-400">240 Hz Nominal</span>
            </div>
            <div className="flex items-end gap-1 h-8 pt-1">
              {[40, 65, 30, 85, 45, 90, 60, 75, 50, 95, 35, 70, 80, 55, 65].map((val, idx) => (
                <div
                  key={idx}
                  style={{ height: `${val}%` }}
                  className="flex-1 bg-indigo-500/80 rounded-t transition-all duration-300"
                />
              ))}
            </div>
          </div>

          {/* AI Diagnostic Output */}
          {diagnosticResult && (
            <div className="mb-3 p-2.5 bg-indigo-950/60 border border-indigo-500/40 rounded-lg text-[11px] text-indigo-200 animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 font-bold text-indigo-300 mb-1">
                <Sparkles size={13} /> AI Maintenance Diagnostic Result
              </div>
              <p>{diagnosticResult}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={runDiagnostic}
              disabled={isDiagnosing}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs shadow-md"
            >
              <Wrench size={14} />
              <span>{isDiagnosing ? 'Running Sensor Audit...' : 'Run AI Diagnostic Audit'}</span>
            </button>

            {onNavigate && (
              <button
                onClick={() => onNavigate('procurement')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs"
              >
                <span>Create Replacement Order RFQ</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
