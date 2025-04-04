/**
 * Three.js Utilities
 * 
 * This file centralizes Three.js imports and provides utility functions
 * for common Three.js operations used throughout the application.
 */

// Core Three.js library
import * as THREE from 'three';

// Common Three.js extensions
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

// Default font path for TextGeometry
export const DEFAULT_FONT_URL = 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json';

/**
 * Creates a standard Three.js scene with common settings
 * @returns {THREE.Scene} Configured Three.js scene
 */
export const createScene = (backgroundColor = 0xf5f5f5) => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(backgroundColor);
  return scene;
};

/**
 * Creates a standard perspective camera with common settings
 * @param {number} fov - Field of view
 * @param {number} aspect - Aspect ratio
 * @param {number} near - Near clipping plane
 * @param {number} far - Far clipping plane
 * @returns {THREE.PerspectiveCamera} Configured camera
 */
export const createCamera = (fov = 75, aspect = 1, near = 0.1, far = 1000) => {
  return new THREE.PerspectiveCamera(fov, aspect, near, far);
};

/**
 * Creates a standard WebGL renderer with common settings
 * @param {number} width - Renderer width
 * @param {number} height - Renderer height
 * @param {boolean} antialias - Whether to use antialiasing
 * @returns {THREE.WebGLRenderer} Configured renderer
 */
export const createRenderer = (width, height, antialias = true) => {
  const renderer = new THREE.WebGLRenderer({ antialias });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  return renderer;
};

/**
 * Creates orbit controls for camera manipulation
 * @param {THREE.Camera} camera - The camera to control
 * @param {HTMLElement} domElement - The DOM element to attach to
 * @returns {OrbitControls} Configured controls
 */
export const createControls = (camera, domElement) => {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  return controls;
};

/**
 * Loads a font for use with TextGeometry
 * @param {string} url - URL to the font JSON file
 * @returns {Promise<THREE.Font>} Promise resolving to the loaded font
 */
export const loadFont = (url = DEFAULT_FONT_URL) => {
  const loader = new FontLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (font) => resolve(font),
      undefined,
      (error) => reject(error)
    );
  });
};

/**
 * Creates text geometry with the specified font and settings
 * @param {string} text - The text to display
 * @param {THREE.Font} font - The font to use
 * @param {Object} options - Configuration options for the text geometry
 * @returns {THREE.TextGeometry} The created text geometry
 */
export const createTextGeometry = (text, font, options = {}) => {
  const defaultOptions = {
    size: 0.2,
    height: 0.02,
    curveSegments: 4,
    bevelEnabled: false
  };
  
  return new TextGeometry(text, {
    ...defaultOptions,
    ...options,
    font
  });
};

/**
 * Disposes of Three.js objects to prevent memory leaks
 * @param {THREE.Object3D} object - The object to dispose
 */
export const disposeObject = (object) => {
  if (!object) return;
  
  if (object.geometry) {
    object.geometry.dispose();
  }
  
  if (object.material) {
    if (Array.isArray(object.material)) {
      object.material.forEach(material => material.dispose());
    } else {
      object.material.dispose();
    }
  }
  
  if (object.children) {
    object.children.forEach(child => disposeObject(child));
  }
};

// Export Three.js core library and extensions
export { THREE, OrbitControls, TextGeometry, FontLoader };