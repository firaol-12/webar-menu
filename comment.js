// import { CSS3DObject } from "./libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js";
// import { mockWithVideo } from "./libs/camera-mock.js";
// import { loadGLTF } from "./libs/loader.js";

// const THREE = window.MINDAR.IMAGE.THREE;

// document.addEventListener('DOMContentLoaded', () => {
//   const start = async () => {
//     mockWithVideo('./assets/mock.mp4');

//     const mindarThree = new window.MINDAR.IMAGE.MindARThree({
//       container: document.body,
//       imageTargetSrc:'./assets/bussines.mind',
//     });

//     let currentModel = null;
//     let currentItemIndex = 0;
//     let anchor = null;
//     let isLoadingModel = false;
//     let menuItemElements = [];
//     let priceItemElements = [];
//     const modelCache = {}; // <-- Sliding preload cache

//     const preloadWindow = 1; // 2 before, 2 after (total 5 models)

//  const menu = [
//             { id: 1, name: "Burger", price: 150, glt:"./assets/pza-8f.glb", catagorie:"breakfast" },
//             { id: 2, name: "Cheese Burger", price: 180, glt:"./assets/tco-8f.glb", catagorie:"breakfast" },
//             { id: 3, name: "Pizza Margherita", price: 250, glt:"./assets/tbs-12f.glb", catagorie:"breakfast" },
//             { id: 4, name: "Chicken Pizza", price: 300, glt:"./assets/gnf-7f.glb", catagorie:"breakfast" },
//             { id: 5, name: "Pasta Alfredo", price: 220, glt:"./assets/fir.glb", catagorie:"breakfast" },
//             { id: 6, name: "Pasta Bolognese", price: 240, glt:"./assets/hb-f.glb", catagorie:"breakfast" },
//             { id: 7, name: "Kitfo", price: 300, glt:"./assets/pza-8f.glb", catagorie:"breakfast" },
//             { id: 8, name: "Tibs", price: 280, glt:"./assets/tbs-12f.glb", catagorie:"breakfast" },
//             { id: 9, name: "Shiro", price: 120, glt:"./assets/gnf-7f.glb", catagorie:"lumch" },
//             { id: 10, name: "Firfir", price: 100, glt:"./assets/fir.glb", catagorie:"lunch" },
//             { id: 11, name: "French Fries", price: 80, glt:"./assets/tco-8f.glb", catagorie:"lunch" },
//             { id: 12, name: "Chicken Sandwich", price: 200, glt:"./assets/pza-8f.glb", catagorie:"lunch" },
//             { id: 13, name: "Beef Sandwich", price: 220, glt:"./assets/tbs-12f.glb", catagorie:"lunch" },
//             { id: 14, name: "Vegetable Pizza", price: 270, glt:"./assets/fir.glb", catagorie:"lunch" },
//             { id: 15, name: "Seafood Pizza", price: 350, glt:"./assets/tbs-12f.glb", catagorie:"lunch" },
//             { id: 16, name: "Spaghetti Carbonara", price: 260, glt:"./assets/gnf-7f.glb", catagorie:"lunch" },
//             { id: 17, name: "Lasagna", price: 280, glt:"./assets/fir.glb", catagorie:"lunch" },
//             { id: 18, name: "Doro Wat", price: 320, glt:"./assets/tco-8f.glb", catagorie:"dinner" },
//             { id: 19, name: "Gomen", price: 140, glt:"./assets/pza-8f.glb", catagorie:"dinner" },
//             { id: 20, name: "Misir Wat", price: 150, glt:"./assets/tbs-12f.glb", catagorie:"dinner" },
//             { id: 21, name: "Foul Medames", price: 130, glt:"./assets/gnf-7f.glb", catagorie:"dinner" },
//             { id: 22, name: "Egg Firfir", price: 140, glt:"./assets/hb-f.glb", catagorie:"dinner" },
//             { id: 23, name: "Rice with Chicken", price: 240, glt:"./assets/tco-8f.glb", catagorie:"dinner" },
//             { id: 24, name: "Beef Sandwich", price: 220, glt:"./assets/pza-8f.glb", catagorie:"dinner" },
//             { id: 25, name: "Vegetable Pizza", price: 270, glt:"./assets/gnf-7f.glb", catagorie:"dinner" },
//             { id: 26, name: "Seafood Pizza", price: 350, glt:"./assets/hb-f.glb", catagorie:"dinner" },
//             { id: 27, name: "Spaghetti Carbonara", price: 260, glt:"./assets/tco-8f.glb", catagorie:"dinner" },
//             { id: 28, name: "Lasagna", price: 280, glt:"./assets/gnf-7f.glb", catagorie:"dinner" },
//             { id: 29, name: "Doro Wat", price: 320, glt:"./assets/tbs-12f.glb", catagorie:"fasting" },
//             { id: 30, name: "Gomen", price: 140, glt:"./assets/hb-f.glb", catagorie:"fasting" },
//             { id: 31, name: "Misir Wat", price: 150, glt:"./assets/fir.glb", catagorie:"fasting" },
//             { id: 32, name: "Foul Medames", price: 130, glt:"./assets/gnf-7f.glb", catagorie:"fasting" },
//             { id: 33, name: "Egg Firfir", price: 140, glt:"./assets/pza-8f.glb", catagorie:"fasting" },
//             { id: 34, name: "Rice with Chicken", price: 240, glt:"./assets/tco-8f.glb", catagorie:"fasting" },
//             { id: 35, name: "Rice with Beef", price: 260, glt:"./assets/fir.glb", catagorie:"fasting" }
//         ];


//     const {renderer, cssRenderer, scene, cssScene, camera} = mindarThree;

//     const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff,1);
//     scene.add(light);

//     // DOM elements
//     const categoriesEl = document.getElementById('categories');
//     const view3dEl = document.getElementById('view3d');
//     const orderSectionEl = document.getElementById('orderSection');
//     const foodListEl = document.getElementById('foodList');
//     const nameContainer = document.getElementById('nameContainer');
//     const priceContainer = document.getElementById('priceContainer');
//     const prevBtn = document.querySelector('#prevBtn');
//     const nextBtn = document.querySelector('#nextBtn');
//     const orderBtn = document.getElementById('order-btn');
//     const orderNmr = document.getElementById('order-nbr');
//     const allBtn = document.getElementById('all');
//     const breakfast = document.getElementById('breakfast');
//     const lunch = document.getElementById('lunch');
//     const dinner = document.getElementById('dinner');
//     const fasting = document.getElementById('fasting');
//     const orderList = document.getElementById('order-list');
//     // const cartPanel = document.getElementById('cart-panel');

//     let currentDisplayedItems = [];
//     let selectedItem = null;
//     // let isOrdering = false;
//     // let cart = [];

//     // --- Preload logic ---
// async function updatePreloadWindow(currentIndex) {
//   const total = currentDisplayedItems.length;
//   const idsToKeep = [];

//   for (let offset = -preloadWindow; offset <= preloadWindow; offset++) {
//     // Circular index with wrap-around
//     const idx = (currentIndex + offset + total) % total;
//     const item = currentDisplayedItems[idx];
//     idsToKeep.push(item.id);

//     if (!modelCache[item.id]) {
//       loadGLTF(item.glt, renderer).then(gltf => {
//         modelCache[item.id] = gltf.scene;
//         console.log(`Preloaded: ${item.name}`);
//       }).catch(err => console.warn(`Failed to preload ${item.name}:`, err));
//     }
//   }

//   // Dispose models outside sliding window
//   for (let id in modelCache) {
//     if (!idsToKeep.includes(Number(id))) {
//       disposeModel(modelCache[id]);
//       delete modelCache[id];
//       console.log(`Disposed: ${id}`);
//     }
//   }
// }

//     // --- Helper functions ---
// function disposeModel(model) {
//   model.traverse((obj) => {
//     if (!obj.isMesh) return;

//     obj.geometry?.dispose();

//     if (obj.material) {
//       if (Array.isArray(obj.material)) {
//         obj.material.forEach(disposeMaterial);
//       } else {
//         disposeMaterial(obj.material);
//       }
//     }
//   });
// }

// function disposeMaterial(material) {
//   for (const key in material) {
//     const value = material[key];
//     if (value?.isTexture) {
//       value.dispose();
//     }
//   }
//   material.dispose();
// }

//     function highlightCurrentMenuItem(index){
//       menuItemElements.forEach((item,i) => {
//         if(i === index){
//           item.classList.add('highlighted');
//           if(priceItemElements[i]) priceItemElements[i].classList.add('highlighted');
//         } else {
//           item.classList.remove('highlighted');
//           if (priceItemElements[i]) priceItemElements[i].classList.remove('highlighted');
//         }
//       });
//     }

//     function displayItems(array){
//       nameContainer.innerHTML = "";
//       priceContainer.innerHTML = '';
//       menuItemElements = [];
//       priceItemElements = [];

//       array.forEach((item, index) =>{
//         const nameDiv = document.createElement('div');
//         nameDiv.className = 'menu-item';
//         nameDiv.textContent = item.name;
//         nameDiv.addEventListener('click', () => {
//           selectedItem = item;
//           currentItemIndex = index;
//           updateDisplayedItem(index);
//         });

//         const priceDiv = document.createElement('div');
//         priceDiv.className = 'price-item';
//         priceDiv.innerHTML = `${item.price} ETB`;

//         nameContainer.appendChild(nameDiv);
//         priceContainer.appendChild(priceDiv);

//         menuItemElements.push(nameDiv);
//         priceItemElements.push(priceDiv);
//       });
//     }

//     function setFirstItemActive() {
//       if (currentDisplayedItems.length === 0) return;
//       const firstItem = currentDisplayedItems[0];
//       selectedItem = firstItem;
//       currentItemIndex = 0;
//       highlightCurrentMenuItem(0);
//       updateDisplayedItem(firstItem.id ? 0 : 0);
//       updatePreloadWindow(currentItemIndex);
//     }

//     function firstData(category) {
//       if (category === 'all') currentDisplayedItems = menu;
//       else currentDisplayedItems = menu.filter(item => item.catagorie === category);
//       displayItems(currentDisplayedItems);
//       setFirstItemActive();
//     }

//     function setActive(btn){
//       [allBtn, breakfast, lunch, dinner, fasting].forEach(b => b.classList.remove('highlighted'));
//       btn.classList.add('highlighted');
//     }
    

//     // --- Navigation ---
//     function updateDisplayedItem(index){
//       currentItemIndex = index;
//       const item = currentDisplayedItems[index];
//       if (!item) return;
//       selectedItem = item;
//       highlightCurrentMenuItem(index);
//       update3DModel(item);
//       updatePreloadWindow(currentItemIndex);
//     }

//     async function update3DModel(item){
//       if (isLoadingModel) return;
//       isLoadingModel = true;

//       try {
//         if (currentModel && anchor) {
//           disposeModel(currentModel);
//           anchor.group.remove(currentModel);
//           currentModel = null;
//         }

//         const cachedModel = modelCache[item.id];
//         if (cachedModel) {
//           currentModel = cachedModel.clone();
//           currentModel.scale.set(0.5, 0.5, 0.5);
//           currentModel.position.set(0, -0.3, 0);
//           anchor.group.add(currentModel);
//         } else {
//           const gltf = await loadGLTF(item.glt, renderer);
//           currentModel = gltf.scene;
//           currentModel.scale.set(0.5,0.5,0.5);
//           currentModel.position.set(0,-0.3,0);
//           anchor.group.add(currentModel);
//           modelCache[item.id] = gltf.scene;
//         }

//       } catch (err) {
//         console.error('Error loading model:', err);
//       } finally {
//         isLoadingModel = false;
//       }
//     }

//     // --- Category Buttons ---
//     allBtn.addEventListener('click', ()=>{ setActive(allBtn); firstData('all'); });
//     breakfast.addEventListener('click',()=>{ setActive(breakfast); firstData('breakfast'); });
//     lunch.addEventListener('click',()=>{ setActive(lunch); firstData('lunch'); });
//     dinner.addEventListener('click',()=>{ setActive(dinner); firstData('dinner'); });
//     fasting.addEventListener('click',()=>{ setActive(fasting); firstData('fasting'); });


//     const cartPanel = document.getElementById('cart-panel');
//             let isOrdering = false;

//         orderBtn.addEventListener('click',()=>{
//             if(isOrdering || !selectedItem) return;

//             isOrdering = true;

//             addToCart({...selectedItem});

//             setTimeout(()=>{
//                 isOrdering = false;
//             }, 200); 
//         });

//         let cart = [];

//         function addToCart(item) {
//             cart.push(item);

//             orderNmr.textContent = cart.length;
//             renderCart();
//         }

//         function removeFromCart(index){
//             cart.splice(index,1);

//             orderNmr.textContent = cart.length;
//             renderCart();
//         }

//         function renderCart(){
//             const cartItemsEl = document.getElementById('cart-items');
//             const totalPriceEl = document.getElementById('cart-total-price');

//             cartItemsEl.innerHTML = "";

//             let total = 0;
//             cart.forEach((item,index) =>{
//                 total += item.price;

//                 const li = document.createElement('li');
//                 li.className = 'cart-item';

//                 const text = document.createElement('span');
//                 text.textContent = `${item.name} - ${item.price} ETB`;

//                 const removeBtn = document.createElement('button');
//                 removeBtn.textContent = "❌";

//                 removeBtn.addEventListener('click',()=>{
//                     removeFromCart(index);
//                 });

//                 li.appendChild(text);
//                 li.appendChild(removeBtn);
//                 cartItemsEl.appendChild(li);
//             });
            
//             totalPriceEl.textContent = `${total} ETB` 
//         }

//         const backMenuBtn = document.getElementById('back-menu-btn');

//         backMenuBtn.addEventListener('click',()=>{
//             cartPanel.classList.remove('show');
//         });

//         orderList.addEventListener('click',()=>{
//             cartPanel.classList.add('show');
//         });

//     // --- Previous / Next ---

//     prevBtn.addEventListener('click', () => {
//       if(!isLoadingModel){
//         const newIndex = (currentItemIndex - 1 + currentDisplayedItems.length) % currentDisplayedItems.length;
//         updateDisplayedItem(newIndex);
//       }
//     });

//     nextBtn.addEventListener('click', () => {
//       if(!isLoadingModel){
//         const newIndex = (currentItemIndex + 1) % currentDisplayedItems.length;
//         updateDisplayedItem(newIndex);
//       }
//     });

//     // --- Anchor and AR Start ---
//     anchor = mindarThree.addAnchor(0);
//     const cssAnchor = mindarThree.addCSSAnchor(0);

//     cssAnchor.onTargetFound = () =>{
//       console.log("Target found");
//       categoriesEl.style.visibility = "visible";
//       view3dEl.style.visibility = "visible";
//       orderSectionEl.style.visibility = "visible";
//       foodListEl.style.visibility = "visible";
//     }

//     cssAnchor.onTargetLost = ()=>{
//       console.log("Target lost!");
//       categoriesEl.style.visibility = 'hidden';
//       view3dEl.style.visibility = 'hidden';
//       foodListEl.style.visibility = 'hidden';
//       orderSectionEl.style.visibility = 'hidden';
//     }

//     // --- Initial Load ---
//     setActive(allBtn);
//     firstData('all');

//     await mindarThree.start();

//     renderer.setAnimationLoop(()=>{
//       if (currentModel) currentModel.rotation.y += 0.01;
//       cssRenderer.render(cssScene, camera);
//       renderer.render(scene, camera);
//     });
//   }

//   start();
// });