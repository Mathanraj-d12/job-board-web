import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeDBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Current reference to the mounting point
    const currentRef = mountRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f8ff); // Light blue background
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75, // Field of view
      currentRef.clientWidth / currentRef.clientHeight, // Aspect ratio
      0.1, // Near clipping plane
      1000 // Far clipping plane
    );
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
    currentRef.appendChild(renderer.domElement);
    
    // Create floating job cards (cubes with rounded edges)
    const jobCards = [];
    const colors = [0x4285f4, 0x34a853, 0xfbbc05, 0xea4335]; // Google-inspired colors
    
    for (let i = 0; i < 15; i++) {
      // Create geometry and material
      const geometry = new THREE.BoxGeometry(1, 0.6, 0.05);
      const material = new THREE.MeshPhongMaterial({
        color: colors[i % colors.length],
        shininess: 100,
        transparent: true,
        opacity: 0.8,
      });
      
      // Create mesh and position randomly
      const card = new THREE.Mesh(geometry, material);
      card.position.x = (Math.random() - 0.5) * 10;
      card.position.y = (Math.random() - 0.5) * 6;
      card.position.z = (Math.random() - 0.5) * 5;
      
      // Add some rotation
      card.rotation.x = Math.random() * Math.PI;
      card.rotation.y = Math.random() * Math.PI;
      
      // Add to scene and store reference
      scene.add(card);
      jobCards.push({
        mesh: card,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
        },
        floatSpeed: 0.005 + Math.random() * 0.01,
        floatOffset: Math.random() * Math.PI * 2,
      });
    }
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Animation loop
    let frameId;
    let time = 0;
    
    const animate = () => {
      time += 0.01;
      
      // Animate job cards
      jobCards.forEach(card => {
        // Gentle rotation
        card.mesh.rotation.x += card.rotationSpeed.x;
        card.mesh.rotation.y += card.rotationSpeed.y;
        
        // Floating motion
        card.mesh.position.y += Math.sin(time + card.floatOffset) * card.floatSpeed * 0.05;
      });
      
      // Render scene
      renderer.render(scene, camera);
      
      // Continue animation loop
      frameId = window.requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(frameId);
      currentRef.removeChild(renderer.domElement);
      
      // Dispose geometries and materials
      jobCards.forEach(card => {
        card.mesh.geometry.dispose();
        card.mesh.material.dispose();
      });
    };
  }, []);
  
  return (
    <div 
      ref={mountRef} 
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  );
};

export default ThreeDBackground;