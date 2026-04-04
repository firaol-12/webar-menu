import { GLTFLoader } from "./three.js-r132/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "./three.js-r132/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from './three.js-r132/examples/jsm/loaders/KTX2Loader.js';
// import { WebGLRenderer } from './three.module.js';
/**
 * Loads a GLTF file with optional Draco and KTX2 compression
 * @param {string} path - Path to GLB/GLTF file
 * @param {THREE.WebGLRenderer} renderer - Three.js renderer needed for KTX2
 * @returns {Promise<THREE.GLTF>}
 */
export async function loadGLTF(path, renderer) {
  return new Promise((resolve, reject) => {
    console.log(`Loading GLTF from: ${path}`);
    
    const loader = new GLTFLoader();
    
    // Setup Draco decompression
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
    dracoLoader.setDecoderConfig({ type: 'js' });
    loader.setDRACOLoader(dracoLoader);

    // Setup KTX2 loader for compressed textures
    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath("./assets/basis/");
    ktx2Loader.detectSupport(renderer);
    loader.setKTX2Loader(ktx2Loader);

    // Load the GLTF
    loader.load(
      path,
      (gltf) => {
        console.log("✅ GLTF loaded successfully");
        console.log("Model info:", {
          animations: gltf.animations.length,
          scenes: gltf.scenes.length,
          cameras: gltf.cameras.length,
          asset: gltf.asset
        });
        resolve(gltf);
      },
      (progress) => {
        if (progress.lengthComputable) {
          const percentComplete = (progress.loaded / progress.total * 100).toFixed(2);
          console.log(`Loading: ${percentComplete}%`);
        }
      },
      (error) => {
        console.error("❌ GLTF loading error:", error);
        reject(new Error(`Failed to load model: ${error.message}`));
      }
    );
  });
}