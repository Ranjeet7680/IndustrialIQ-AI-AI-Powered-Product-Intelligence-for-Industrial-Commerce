"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Box, RefreshCw, ZoomIn, ZoomOut, Info } from 'lucide-react';

export default function ThreeFacility() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x131b2e); // Midnight Navy

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 15, 25);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x2170e4, 1.2);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xacedff, 1.5, 50);
    pointLight.position.set(-10, 10, -5);
    scene.add(pointLight);

    // Industrial Grid Base
    const gridHelper = new THREE.GridHelper(30, 30, 0x2170e4, 0x3f465c);
    scene.add(gridHelper);

    // Nodes Data
    const nodes = [
      { id: 1, name: 'Centrifugal Pump Unit #1', category: 'Pumps', status: 'Optimal', risk: 'Low', x: -8, y: 2, z: -4, color: 0x2170e4 },
      { id: 2, name: 'High-Pressure Valve Stack', category: 'Valves', status: 'Optimal', risk: 'Low', x: -2, y: 3, z: 2, color: 0xa855f7 },
      { id: 3, name: 'AC Motor Drive Module', category: 'Motors', status: 'Warning', risk: 'Medium', x: 5, y: 2.5, z: -3, color: 0xf59e0b },
      { id: 4, name: 'Rotary Compressor System', category: 'Compressors', status: 'Optimal', risk: 'Low', x: 8, y: 4, z: 4, color: 0x06b6d4 },
      { id: 5, name: 'Supplier Logistics Hub (Chennai)', category: 'Supply Chain Node', status: 'Active', risk: 'Low', x: 0, y: 1, z: -8, color: 0x10b981 }
    ];

    const meshes: THREE.Mesh[] = [];

    nodes.forEach((node) => {
      let geo: THREE.BufferGeometry = new THREE.BoxGeometry(2, 2, 2);
      if (node.category === 'Pumps') geo = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 16);
      if (node.category === 'Valves') geo = new THREE.SphereGeometry(1.3, 16, 16);
      if (node.category === 'Motors') geo = new THREE.BoxGeometry(2.5, 2.5, 2.5);

      const mat = new THREE.MeshStandardMaterial({
        color: node.color,
        roughness: 0.3,
        metalness: 0.7,
        wireframe: false
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(node.x, node.y, node.z);
      mesh.userData = node;
      scene.add(mesh);
      meshes.push(mesh);
    });

    // Connecting Pipeline Lines
    const points = [
      new THREE.Vector3(-8, 2, -4),
      new THREE.Vector3(-2, 3, 2),
      new THREE.Vector3(5, 2.5, -3),
      new THREE.Vector3(8, 4, 4)
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xacedff, linewidth: 2 });
    const line = new THREE.Line(lineGeo, lineMat);
    scene.add(line);

    // Animation Loop
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      meshes.forEach((m) => {
        m.rotation.y += 0.005;
      });
      renderer.render(scene, camera);
    };
    animate();

    // Raycaster for click interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const clickedNode = intersects[0].object.userData;
        setSelectedNode(clickedNode);
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('click', handleClick);
        if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement);
        }
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[550px] bg-primary-container rounded-xl border border-outline-variant overflow-hidden">
      <div ref={containerRef} className="w-full h-full cursor-pointer" />

      {/* Title Overlay */}
      <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-md border border-outline-variant p-3 rounded-lg z-10 text-xs">
        <div className="flex items-center gap-2 font-bold text-on-surface">
          <Box size={16} className="text-secondary" />
          <span>3D Industrial Supply Chain Facility</span>
        </div>
        <p className="text-[11px] text-on-surface-variant mt-1">Interactive nodes — click any equipment to view live status telemetry.</p>
      </div>

      {/* Selected Node Drawer */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-2xl z-20 animate-in fade-in slide-in-from-bottom duration-200">
          <div className="flex justify-between items-start border-b border-outline-variant pb-2 mb-2">
            <div>
              <h4 className="font-bold text-sm text-on-surface">{selectedNode.name}</h4>
              <span className="text-[10px] text-on-surface-variant font-data-mono">{selectedNode.category}</span>
            </div>
            <button onClick={() => setSelectedNode(null)} className="text-xs text-on-surface-variant hover:text-on-surface font-bold">✕</button>
          </div>
          <div className="space-y-1.5 text-xs text-on-surface-variant">
            <div className="flex justify-between">
              <span>Operational Status:</span>
              <span className={`font-semibold ${selectedNode.status === 'Optimal' ? 'text-green-600' : 'text-amber-500'}`}>{selectedNode.status}</span>
            </div>
            <div className="flex justify-between">
              <span>Supply Risk Index:</span>
              <span className="font-semibold text-on-surface">{selectedNode.risk}</span>
            </div>
            <div className="flex justify-between">
              <span>3D Grid Coordinates:</span>
              <span className="font-data-mono text-[10px] text-on-surface">({selectedNode.x}, {selectedNode.y}, {selectedNode.z})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
