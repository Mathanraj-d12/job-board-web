import React, { useRef, useEffect } from 'react';
import {
  THREE,
  createScene,
  createCamera,
  createRenderer,
  createControls,
  loadFont,
  createTextGeometry,
  disposeObject
} from '../utils/threeJsUtils';

const ThreeDJobCard = ({ job, onClick }) => {
  const mountRef = useRef(null);
  
  useEffect(() => {
    // Current reference to the mounting point
    const currentRef = mountRef.current;
    
    // Scene setup
    const scene = createScene(0xf5f5f5);

    // Camera setup
    const camera = createCamera(
      50,
      currentRef.clientWidth / currentRef.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = createRenderer(
      currentRef.clientWidth,
      currentRef.clientHeight
    );
    currentRef.appendChild(renderer.domElement);

    // Add controls
    const controls = createControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5;
    controls.enableZoom = true;
    controls.minDistance = 3;
    controls.maxDistance = 8;
    
    // Create job card
    const cardGeometry = new THREE.BoxGeometry(3, 2, 0.1);
    const cardMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.2,
      reflectivity: 0.5,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
    });
    
    const card = new THREE.Mesh(cardGeometry, cardMaterial);
    card.castShadow = true;
    card.receiveShadow = true;
    scene.add(card);
    
    // Add company logo (placeholder)
    const logoGeometry = new THREE.CircleGeometry(0.4, 32);
    const logoMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x4285f4,
      side: THREE.DoubleSide
    });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.set(-1, 0.7, 0.06);
    card.add(logo);
    
    // Add text (job title, company, etc.)
    loadFont().then(font => {
      // Job Title
      const titleGeometry = createTextGeometry(
        job?.title || 'Software Engineer',
        font,
        { size: 0.2, height: 0.02 }
      );

      const titleMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
      const titleMesh = new THREE.Mesh(titleGeometry, titleMaterial);
      
      // Center the text
      titleGeometry.computeBoundingBox();
      const titleWidth = titleGeometry.boundingBox.max.x - titleGeometry.boundingBox.min.x;
      
      titleMesh.position.set(-0.5 - (titleWidth / 2), 0.7, 0.06);
      card.add(titleMesh);
      
      // Company Name
      const companyGeometry = new TextGeometry(job?.company || 'Acme Inc.', {
        font: font,
        size: 0.15,
        height: 0.01,
      });
      
      const companyMaterial = new THREE.MeshBasicMaterial({ color: 0x666666 });
      const companyMesh = new THREE.Mesh(companyGeometry, companyMaterial);
      
      companyMesh.position.set(-0.5, 0.4, 0.06);
      card.add(companyMesh);
      
      // Location
      const locationGeometry = new TextGeometry(job?.location || 'Remote', {
        font: font,
        size: 0.12,
        height: 0.01,
      });
      
      const locationMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
      const locationMesh = new THREE.Mesh(locationGeometry, locationMaterial);
      
      locationMesh.position.set(-0.5, 0.2, 0.06);
      card.add(locationMesh);
      
      // Salary
      const salaryGeometry = new TextGeometry(job?.salary || '$80,000 - $120,000', {
        font: font,
        size: 0.12,
        height: 0.01,
      });
      
      const salaryMaterial = new THREE.MeshBasicMaterial({ color: 0x4caf50 });
      const salaryMesh = new THREE.Mesh(salaryGeometry, salaryMaterial);
      
      salaryMesh.position.set(-0.5, 0, 0.06);
      card.add(salaryMesh);
      
      // Description (truncated)
      const descGeometry = new TextGeometry(
        (job?.description || 'Join our team and work on exciting projects...').substring(0, 50) + '...', 
        {
          font: font,
          size: 0.08,
          height: 0.01,
        }
      );
      
      const descMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 });
      const descMesh = new THREE.Mesh(descGeometry, descMaterial);
      
      descMesh.position.set(-1.2, -0.3, 0.06);
      card.add(descMesh);
      
      // Apply button
      const buttonGeometry = new THREE.BoxGeometry(1, 0.3, 0.05);
      const buttonMaterial = new THREE.MeshBasicMaterial({ color: 0x4285f4 });
      const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
      
      button.position.set(0, -0.7, 0.06);
      card.add(button);
      
      // Apply text
      const applyGeometry = new TextGeometry('Apply Now', {
        font: font,
        size: 0.12,
        height: 0.01,
      });
      
      applyGeometry.computeBoundingBox();
      const applyWidth = applyGeometry.boundingBox.max.x - applyGeometry.boundingBox.min.x;
      
      const applyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const applyMesh = new THREE.Mesh(applyGeometry, applyMaterial);
      
      applyMesh.position.set(0 - (applyWidth / 2), -0.73, 0.12);
      card.add(applyMesh);
    });
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);
    
    // Animation loop
    let frameId;
    
    const animate = () => {
      controls.update();
      
      // Add subtle floating animation
      card.position.y = Math.sin(Date.now() * 0.001) * 0.05;
      
      renderer.render(scene, camera);
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
    
    // Handle click events
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const handleClick = (event) => {
      // Calculate mouse position in normalized device coordinates
      const rect = currentRef.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / currentRef.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / currentRef.clientHeight) * 2 + 1;
      
      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);
      
      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        if (onClick) onClick(job);
      }
    };
    
    currentRef.addEventListener('click', handleClick);
    
    // Cleanup function
    return () => {
      // Remove event listeners
      window.removeEventListener('resize', handleResize);
      currentRef.removeEventListener('click', handleClick);
      window.cancelAnimationFrame(frameId);

      // Dispose Three.js resources
      disposeObject(scene);
      controls.dispose();
      renderer.dispose();

      // Remove renderer from DOM
      if (currentRef.contains(renderer.domElement)) {
        currentRef.removeChild(renderer.domElement);
      }
    };
  }, [job, onClick]);
  
  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%',
        height: '400px',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  );
};

export default ThreeDJobCard;