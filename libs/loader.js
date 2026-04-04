import { GLTFLoader } from "./three.js-r132/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "./three.js-r132/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "./three.js-r132/examples/jsm/loaders/KTX2Loader.js";

let gltfLoader = null;
let dracoLoader = null;
let ktx2Loader = null;

export function initGLTFLoader(renderer) {
  if (gltfLoader) return gltfLoader;

  gltfLoader = new GLTFLoader();

  dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("./draco/");
  dracoLoader.setDecoderConfig({ type: 'js' });
  gltfLoader.setDRACOLoader(dracoLoader);

  ktx2Loader = new KTX2Loader();
  ktx2Loader.setTranscoderPath("./basis/");
  ktx2Loader.detectSupport(renderer);
  gltfLoader.setKTX2Loader(ktx2Loader);

  return gltfLoader;
}

export function loadGLTF(path) {
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      path,
      resolve,
      undefined,
      reject
    );
  });
}