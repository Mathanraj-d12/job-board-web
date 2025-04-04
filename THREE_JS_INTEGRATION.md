# Three.js Integration Guide

This document provides guidance on how Three.js is integrated into the Job Board application.

## Setup and Configuration

The application uses Three.js for creating interactive 3D visualizations. The integration is configured in the following files:

- `vite.config.js`: Contains Vite-specific configuration for Three.js
- `src/utils/threeJsUtils.js`: Centralizes Three.js imports and utility functions

## Key Components

The application includes several Three.js-powered components:

1. **ThreeDHero**: A 3D hero section on the homepage
2. **ThreeDBackground**: A 3D animated background for the job listing page
3. **ThreeDJobCard**: Interactive 3D job cards

## Best Practices

When working with Three.js in this project, follow these guidelines:

### Imports

Import Three.js modules from the utility file when possible:

```javascript
import { 
  THREE, 
  createScene, 
  createCamera, 
  createRenderer 
} from '../utils/threeJsUtils';
```

### Resource Management

Always clean up Three.js resources in the useEffect cleanup function:

```javascript
useEffect(() => {
  // Setup code...
  
  return () => {
    // Dispose geometries and materials
    disposeObject(scene);
    renderer.dispose();
    // Remove DOM elements
    if (mountRef.current.contains(renderer.domElement)) {
      mountRef.current.removeChild(renderer.domElement);
    }
  };
}, []);
```

### Performance Considerations

- Use appropriate geometry detail levels
- Implement level-of-detail (LOD) for complex scenes
- Minimize draw calls by combining geometries where possible
- Use instanced meshes for repeated objects

## Troubleshooting

Common issues and solutions:

1. **Module Resolution Errors**: Ensure imports include the `.js` extension for Three.js modules
2. **Rendering Performance**: Check for memory leaks by properly disposing of geometries and materials
3. **Mobile Compatibility**: Use feature detection and provide fallbacks for devices with limited WebGL support

## Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) (for future integration)