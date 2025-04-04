import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';

const ThreeDHero = () => {
  const mountRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Current reference to the mounting point
    const currentRef = mountRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2563eb); // Blue background
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      currentRef.clientWidth / currentRef.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
    currentRef.appendChild(renderer.domElement);
    
    // Create text geometry
    const textGroup = new THREE.Group();
    scene.add(textGroup);
    
    // Create floating 3D objects
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x111111,
      specular: 0xffffff,
      shininess: 100,
      transparent: true,
      opacity: 0.9,
      wireframe: true
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 0, 0);
    textGroup.add(sphere);
    
    // Create smaller floating objects
    const smallGeometry = new THREE.TetrahedronGeometry(0.2, 0);
    const smallMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x111111,
      wireframe: true
    });
    
    const particles = [];
    for (let i = 0; i < 50; i++) {
      const particle = new THREE.Mesh(smallGeometry, smallMaterial);
      particle.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      particle.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      particle.scale.set(
        Math.random() + 0.5,
        Math.random() + 0.5,
        Math.random() + 0.5
      );
      particles.push({
        mesh: particle,
        speed: Math.random() * 0.01 + 0.005,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02
        }
      });
      textGroup.add(particle);
    }
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x60a5fa, 2, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);
    
    // Animation loop
    let frameId;
    let time = 0;
    
    const animate = () => {
      time += 0.01;
      
      // Rotate the main sphere
      sphere.rotation.x += 0.005;
      sphere.rotation.y += 0.01;
      
      // Animate particles
      particles.forEach(particle => {
        particle.mesh.rotation.x += particle.rotationSpeed.x;
        particle.mesh.rotation.y += particle.rotationSpeed.y;
        particle.mesh.rotation.z += particle.rotationSpeed.z;
        
        // Move particles in a circular pattern
        const radius = 3;
        particle.mesh.position.x = Math.cos(time * particle.speed + particle.mesh.position.z) * radius;
        particle.mesh.position.y = Math.sin(time * particle.speed + particle.mesh.position.z) * radius;
      });
      
      // Rotate the entire text group
      textGroup.rotation.y += 0.003;
      
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
    
    // Handle click to navigate to 3D jobs
    const handleClick = () => {
      navigate('/jobs-3d');
    };
    
    currentRef.addEventListener('click', handleClick);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      currentRef.removeEventListener('click', handleClick);
      window.cancelAnimationFrame(frameId);
      
      if (currentRef.contains(renderer.domElement)) {
        currentRef.removeChild(renderer.domElement);
      }
      
      // Dispose geometries and materials
      geometry.dispose();
      material.dispose();
      smallGeometry.dispose();
      smallMaterial.dispose();
    };
  }, [navigate]);
  
  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%',
        height: '300px',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          textAlign: 'center',
          zIndex: 10,
          pointerEvents: 'none',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}
      >
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Experience 3D Job Browsing</h2>
        <p style={{ fontSize: '1.2rem' }}>Click to explore our interactive 3D job board</p>
      </div>
    </div>
  );
};

export default ThreeDHero;