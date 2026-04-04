import { CSS3DObject } from "./libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js";
import { mockWithVideo } from "./libs/camera-mock.js";
import {initGLTFLoader,loadGLTF } from "./libs/loader.js";

const THREE = window.MINDAR.IMAGE.THREE;
THREE.Cache.enabled = false;
// const { CSS3DObject } = THREE;

const modelCache = {}; // <-- Sliding preload cache
document.addEventListener('DOMContentLoaded',()=>{
    const start = async ()=>{
        mockWithVideo('./assets/mock.mp4');
        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.body,
            // container: document.querySelector("#container"),
            imageTargetSrc:'./assets/bussines.mind',
            // imageTargetSrc:'./assets/g2.mind',
            // uiScanning: "#scanning",
            // uiLoading: "no",
            // filterMinCF: 0.001,
            // filterBeta: 0.01
        });

        let currentModel = null;
        let currentItemIndex = 0;
        let anchor = null;
        let isLoadingModel = false;
        let menuItemElements = [];
        let priceItemElements = [];
        let rotationGroup = null;
        let isRotating = false;
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const menu = [
            { id: 1, calorie: 350, name: "Burger", price: 150, glt:"./assets/pza-8f.glb", catagorie:"breakfast" },
            { id: 2, calorie: 35, name: "Cheese Burger", price: 180, glt:"./assets/tco-8f.glb", catagorie:"breakfast" },
            { id: 3, calorie: 400, name: "Pizza Margherita", price: 250, glt:"./assets/tbs-12f.glb", catagorie:"breakfast" },
            { id: 4, calorie: 360, name: "Chicken Pizza", price: 300, glt:"./assets/gnf-7f.glb", catagorie:"breakfast" },
            { id: 5, calorie: 30, name: "Pasta Alfredo", price: 220, glt:"./assets/fir.glb", catagorie:"breakfast" },
            { id: 6, calorie: 350, name: "Pasta Bolognese", price: 240, glt:"./assets/hb-f.glb", catagorie:"breakfast" },
            { id: 7, calorie: 360, name: "Kitfo", price: 300, glt:"./assets/pza-8f.glb", catagorie:"breakfast" },
            { id: 8, calorie: 380, name: "Tibs", price: 280, glt:"./assets/tbs-12f.glb", catagorie:"breakfast" },
            { id: 9, calorie: 750, name: "Shiro", price: 120, glt:"./assets/gnf-7f.glb", catagorie:"lumch" },
            { id: 10, calorie: 250, name: "Firfir", price: 100, glt:"./assets/fir.glb", catagorie:"lunch" },
            { id: 11, calorie: 550, name: "French Fries", price: 80, glt:"./assets/tco-8f.glb", catagorie:"lunch" },
            { id: 12, calorie: 250, name: "Chicken Sandwich", price: 200, glt:"./assets/pza-8f.glb", catagorie:"lunch" },
            { id: 13, calorie: 120, name: "Beef Sandwich", price: 220, glt:"./assets/tbs-12f.glb", catagorie:"lunch" },
            { id: 14, calorie: 130, name: "Vegetable Pizza", price: 270, glt:"./assets/fir.glb", catagorie:"lunch" },
            { id: 15, calorie: 300, name: "Seafood Pizza", price: 350, glt:"./assets/tbs-12f.glb", catagorie:"lunch" },
            { id: 16, calorie: 600, name: "Spaghetti Carbonara", price: 260, glt:"./assets/gnf-7f.glb", catagorie:"lunch" },
            { id: 17, calorie: 300, name: "Lasagna", price: 280, glt:"./assets/fir.glb", catagorie:"lunch" },
            { id: 18, calorie: 330, name: "Doro Wat", price: 320, glt:"./assets/tco-8f.glb", catagorie:"dinner" },
            { id: 19, calorie: 340, name: "Gomen", price: 140, glt:"./assets/pza-8f.glb", catagorie:"dinner" },
            { id: 20, calorie: 390, name: "Misir Wat", price: 150, glt:"./assets/tbs-12f.glb", catagorie:"dinner" },
            { id: 21, calorie: 240, name: "Foul Medames", price: 130, glt:"./assets/gnf-7f.glb", catagorie:"dinner" },
            { id: 22, calorie: 350, name: "Egg Firfir", price: 140, glt:"./assets/hb-f.glb", catagorie:"dinner" },
            { id: 23, calorie: 670, name: "Rice with Chicken", price: 240, glt:"./assets/tco-8f.glb", catagorie:"dinner" },
            { id: 24, calorie: 378, name: "Beef Sandwich", price: 220, glt:"./assets/pza-8f.glb", catagorie:"dinner" },
            { id: 25, calorie: 352, name: "Vegetable Pizza", price: 270, glt:"./assets/gnf-7f.glb", catagorie:"dinner" },
            { id: 26, calorie: 323, name: "Seafood Pizza", price: 350, glt:"./assets/hb-f.glb", catagorie:"dinner" },
            { id: 27, calorie: 385, name: "Spaghetti Carbonara", price: 260, glt:"./assets/tco-8f.glb", catagorie:"dinner" },
            { id: 28, calorie: 356, name: "Lasagna", price: 280, glt:"./assets/gnf-7f.glb", catagorie:"dinner" },
            { id: 29, calorie: 325, name: "Doro Wat", price: 320, glt:"./assets/tbs-12f.glb", catagorie:"fasting" },
            { id: 30, calorie: 643, name: "Gomen", price: 140, glt:"./assets/hb-f.glb", catagorie:"fasting" },
            { id: 31, calorie: 312, name: "Misir Wat", price: 150, glt:"./assets/fir.glb", catagorie:"fasting" },
            { id: 32, calorie: 177, name: "Foul Medames", price: 130, glt:"./assets/gnf-7f.glb", catagorie:"fasting" },
            { id: 33, calorie: 324, name: "Egg Firfir", price: 140, glt:"./assets/pza-8f.glb", catagorie:"fasting" },
            { id: 34, calorie: 333, name: "Rice with Chicken", price: 240, glt:"./assets/tco-8f.glb", catagorie:"fasting" },
            { id: 35, calorie: 400, name: "Rice with Beef", price: 260, glt:"./assets/fir.glb", catagorie:"fasting" },
            { id: 36, calorie: 390, name: "Misir Wat", price: 150, glt:"./assets/tbs-12f.glb", catagorie:"dinner" },
            { id: 37, calorie: 240, name: "Foul Medames", price: 130, glt:"./assets/gnf-7f.glb", catagorie:"dinner" },
            { id: 38, calorie: 350, name: "Egg Firfir", price: 140, glt:"./assets/hb-f.glb", catagorie:"dinner" },
            { id: 39, calorie: 670, name: "Rice with Chicken", price: 240, glt:"./assets/tco-8f.glb", catagorie:"dinner" },
            { id: 40, calorie: 378, name: "Beef Sandwich", price: 220, glt:"./assets/pza-8f.glb", catagorie:"dinner" },
            { id: 41, calorie: 352, name: "Vegetable Pizza", price: 270, glt:"./assets/gnf-7f.glb", catagorie:"dinner" },
            { id: 42, calorie: 323, name: "Seafood Pizza", price: 350, glt:"./assets/hb-f.glb", catagorie:"dinner" },
            { id: 43, calorie: 385, name: "Spaghetti Carbonara", price: 260, glt:"./assets/tco-8f.glb", catagorie:"dinner" },
            { id: 44, calorie: 356, name: "Lasagna", price: 280, glt:"./assets/gnf-7f.glb", catagorie:"dinner" },
            { id: 45, calorie: 325, name: "Doro Wat", price: 320, glt:"./assets/tbs-12f.glb", catagorie:"fasting" },
            { id: 46, calorie: 643, name: "Gomen", price: 140, glt:"./assets/hb-f.glb", catagorie:"fasting" },
            { id: 47, calorie: 312, name: "Misir Wat", price: 150, glt:"./assets/fir.glb", catagorie:"fasting" },
            { id: 48, calorie: 177, name: "Foul Medames", price: 130, glt:"./assets/gnf-7f.glb", catagorie:"fasting" },
            { id: 49, calorie: 324, name: "Egg Firfir", price: 140, glt:"./assets/pza-8f.glb", catagorie:"fasting" },
            { id: 50, calorie: 333, name: "Rice with Chicken", price: 240, glt:"./assets/tco-8f.glb", catagorie:"fasting" },
            { id: 51, calorie: 400, name: "Rice with Beef", price: 260, glt:"./assets/fir.glb", catagorie:"fasting" }
        ];

        const {renderer, cssRenderer, scene, cssScene, camera} = mindarThree;

        initGLTFLoader(renderer);

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff,1);
        scene.add(light);

        const categoriesEl = document.getElementById('categories');
        const view3dEl = document.getElementById('view3d');
        const orderSectionEl = document.getElementById('orderSection');
        const foodListEl = document.getElementById('foodList');
        const nameContainer = document.getElementById('nameContainer');
        const priceContainer = document.getElementById('priceContainer');
        const prevBtn = document.querySelector('#prevBtn');
        const nextBtn = document.querySelector('#nextBtn');
        const fullItem = document.getElementById('full-item');
        const orderBtn = document.getElementById('order-btn');
        const orderNmr = document.getElementById('order-nbr');
        const allBtn = document.getElementById('all');
        const breakfast = document.getElementById('breakfast');
        const lunch = document.getElementById('lunch');
        const dinner = document.getElementById('dinner');
        const fasting = document.getElementById('fasting');
        const orderList = document.getElementById('order-list');
        const menuIconBtn = document.getElementById('menu-icon-btn');
        const foodList = document.getElementById('foodList');
        const lower = document.getElementById('lower');
        const cancelBtn = document.getElementById('cancel');
        const menuItems = document.querySelector('.menu-item');
        const menuICancel = document.querySelector('.menu-icon');  
        const lowerPrice = document.getElementById('lower-price');
        const lowerName = document.getElementById('lower-name');
        const lowerCalorie = document.getElementById('lower-calorie');      

        function highlightCurrentMenuItem(index){
            menuItemElements.forEach((item,i) => {
                if(i === index){
                    item.classList.add('highlighted');
                    if(priceItemElements[i]){
                        priceItemElements[i].classList.add('highlighted');
                    }
                } else {
                    item.classList.remove('highlighted');
                    if (priceItemElements[i]){
                        priceItemElements[i].classList.remove('highlighted');
                    }
                }
            });
        };

        allBtn.addEventListener('click', ()=>{
            allBtn.classList.add('highlighted');
        })

        function disposeModel(object) {
          if (!object) return;

          object.traverse((child) => {
            if (!child.isMesh) return;

            // Geometry
            if (child.geometry) {
              child.geometry.dispose();
              child.geometry = null;
            }

            // Material(s)
            if (child.material) {
              const materials = Array.isArray(child.material)
                ? child.material
                : [child.material];

                materials.forEach((mat) => {
                  // Dispose textures inside material
                  for (const key in mat) {
                    if (mat[key] && mat[key].isTexture) {
                      mat[key].dispose();
                      mat[key] = null;
                    }
                  }
                  mat.dispose();
                });

              child.material = null;
            }
          });
        }

        function resetAnchor(anchor) {
          if (!anchor) return;

          while (anchor.group.children.length > 0) {
            const obj = anchor.group.children[0];
            anchor.group.remove(obj);
            disposeModel(obj);
          }
        }

        function forceTextureCleanup(renderer) {
          renderer.properties.dispose();
        }

        let currentDisplayedItems = [];
        let selectedItem = null;

        function displayItems(array){
            nameContainer.innerHTML = "";
            priceContainer.innerHTML = '';

            menuItemElements = [];
            priceItemElements = [];

            array.forEach((item, index) =>{
                const nameDiv = document.createElement('div');
                nameDiv.className = 'menu-item';
                nameDiv.textContent = item.name;
            nameDiv.addEventListener('click', () => {
                selectedItem = item;
                currentItemIndex = index;
                update3DModel(item);
                highlightCurrentMenuItem(index);

                updateLowerUI(item); 
            })

                const priceDiv = document.createElement('div');
                priceDiv.className = 'price-item';
                priceDiv.innerHTML = `${item.price} ETB`;

                nameContainer.appendChild(nameDiv);
                priceContainer.appendChild(priceDiv);
                
                menuItemElements.push(nameDiv);
                priceItemElements.push(priceDiv);
            });
        }

        const setFirstItemActive = () =>{
            if (currentDisplayedItems.length === 0) return;

            const firstItem = currentDisplayedItems[0];

            selectedItem = firstItem;
            currentItemIndex = 0;

            highlightCurrentMenuItem(0);
            update3DModel(firstItem);

            updateLowerUI(firstItem);
        }


        const firstData = (category) => {
          // HARD cleanup first
          if (currentModel && anchor) {
            anchor.group.remove(currentModel);
            disposeModel(currentModel);
            currentModel = null;
          }

          // Clear cached models
          for (const id in modelCache) {
            disposeModel(modelCache[id]);
            delete modelCache[id];
          } 

          // Reset anchor children
          resetAnchor(anchor);

          // Filter menu
          currentDisplayedItems = category === 'all'
            ? menu
            : menu.filter(item => item.catagorie === category);

          // Update DOM
          displayItems(currentDisplayedItems);

          // Set first item active
          setFirstItemActive();
        };

        function setActive(btn){
            [allBtn, breakfast, lunch, dinner, fasting].forEach(b =>{
                b.classList.remove('highlighted');
            });

            btn.classList.add('highlighted');
        }

        allBtn.addEventListener('click', () => {
            setActive(allBtn);
            firstData('all');  
        });

        breakfast.addEventListener('click',()=>{
            setActive(breakfast);
            firstData('breakfast');
        });

        lunch.addEventListener('click',()=>{
            setActive(lunch);
            firstData('lunch');
        });

        dinner.addEventListener('click',()=>{
            setActive(dinner);
            firstData('dinner');
        });

        fasting.addEventListener('click',()=>{
            setActive(fasting);
            firstData('fasting');
        });

        function updateDisplayedItem(index){
            const item = currentDisplayedItems[index];
            if (!item) return;

            selectedItem = item;
            highlightCurrentMenuItem(index);
            update3DModel(item);
            updateLowerUI(item);
        }


        async function update3DModel(item) {
          if (isLoadingModel) return;
          isLoadingModel = true;

          try {
            // 1️⃣ HARD cleanup first
            if (currentModel && anchor) {
              const oldModel = currentModel;         // save the old model
              anchor.group.remove(oldModel);          // remove immediately
              currentModel = null;

              // Wait a tiny bit before disposing
              setTimeout(() => {
                disposeModel(oldModel);
                resetAnchor(anchor);                 // clean anchor children after disposal
              }, 300);

              renderer.renderLists.dispose();         // optional, keep for safety
              renderer.info.reset();
              forceTextureCleanup(renderer);
            }

            // 2️⃣ Let GC breathe
            await new Promise(r => setTimeout(r, 0));

            // 3️⃣ Load fresh model
            const gltf = await loadGLTF(item.glt, renderer);
            currentModel = gltf.scene;

            currentModel.scale.set(1.5, 1.5, 1.5);
            currentModel.position.set(0, -0.3, 0);

            rotationGroup = new THREE.Group();
            rotationGroup.add(currentModel);
            anchor.group.add(rotationGroup);

            console.log("After model load:");
            console.log("Textures:", renderer.info.memory.textures);
            console.log("Geometries:", renderer.info.memory.geometries);
          } catch (e) {
            console.error(e);
          } finally {
            isLoadingModel = false;
          }
        }

        const cartPanel = document.getElementById('cart-panel');

        let isOrdering = false;

        orderBtn.addEventListener('click',()=>{
            if(isOrdering || !selectedItem) return;

            isOrdering = true;

            addToCart({...selectedItem});

            setTimeout(()=>{
                isOrdering = false;
            }, 200); 
        });

        let cart = [];

        function addToCart(item) {
            cart.push(item);

            orderNmr.textContent = cart.length;
            renderCart();
        }

        function removeFromCart(index){
            cart.splice(index,1);

            orderNmr.textContent = cart.length;
            renderCart();
        }

        function renderCart(){
            const cartItemsEl = document.getElementById('cart-items');
            const totalPriceEl = document.getElementById('cart-total-price');

            cartItemsEl.innerHTML = "";

            let total = 0;
            cart.forEach((item,index) =>{
                total += item.price;

                const li = document.createElement('li');
                li.className = 'cart-item';

                const text = document.createElement('span');
                text.textContent = `${item.name} - ${item.price} ETB`;

                const removeBtn = document.createElement('button');
                const img = document.createElement('img');
                img.src = "./assets/delete.png";  // your icon
                img.style.width = "16px";
                img.style.height = "16px";

                removeBtn.appendChild(img);

                removeBtn.addEventListener('click',()=>{
                    removeFromCart(index);
                });

                li.appendChild(text);
                li.appendChild(removeBtn);
                cartItemsEl.appendChild(li);
            });
            
            totalPriceEl.textContent = `${total} ETB` 
        }

        const backMenuBtn = document.getElementById('back-menu-btn');

        backMenuBtn.addEventListener('click',()=>{
            cartPanel.classList.remove('show');
        });

        orderList.addEventListener('click',()=>{
            cartPanel.classList.add('show');
        });

        // const scanningEl = document.getElementById('scanning');
        // scanningEl.classList.remove('hidden');

        const cssAnchor = mindarThree.addCSSAnchor(0);

        prevBtn.addEventListener('click',()=>{
            if (!isLoadingModel){
                currentItemIndex = (currentItemIndex - 1 + currentDisplayedItems.length) % currentDisplayedItems.length;
                updateDisplayedItem(currentItemIndex);
            }
        });
        
        nextBtn.addEventListener('click',()=>{
            if(!isLoadingModel){
                currentItemIndex = (currentItemIndex + 1) % currentDisplayedItems.length;
                updateDisplayedItem(currentItemIndex)
            }
        });

        // Show food list
        menuIconBtn.addEventListener('click', () => {
          foodList.style.visibility = 'visible';
          // menuICancel.style.visibility = 'visible';
          lower.style.visibility = 'hidden';
          // menuItems.style.visibility = 'visible';
          menuIconBtn.style.visibility = 'hidden';
        });

        // Hide food list
        cancelBtn.addEventListener('click', () => {
          foodList.style.visibility = 'hidden';
          // menuICancel.style.visibility = 'hidden';
          lower.style.visibility = 'visible';
          menuIconBtn.style.visibility = 'visible';
          // menuItems.style.visibility = 'hidden';
        });

        // Show food list
      menuIconBtn.addEventListener('click', () => {

        // Step 1: fade out lower
        lower.style.visibility = 'hidden';
        menuIconBtn.style.visibility = 'hidden';
        // Step 2: wait → then show foodList
        setTimeout(() => {
          foodList.classList.remove('hidden-ui');
          foodList.classList.add('show-ui');
        }, 300); // same as CSS transition
      });


      // Hide food list
      cancelBtn.addEventListener('click', () => {

        // Step 1: fade out foodList
        foodList.classList.remove('show-ui');
        foodList.classList.add('hidden-ui');

        // Step 2: wait → then show lower
        setTimeout(() => {
          lower.style.visibility = 'visible';
          menuIconBtn.style.visibility = 'visible';
        }, 300);
      });

        function updateLowerUI(item) {
          if (!item) return;

          lowerPrice.textContent = `${item.price} birr`;
          lowerName.textContent = item.name;
          lowerCalorie.textContent = item.calorie || "N/A";
        }


        function isModelClicked(event) {
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

          raycaster.setFromCamera(mouse, camera);

          if (!rotationGroup) return false;

          const intersects = raycaster.intersectObjects(
            rotationGroup.children,
            true
          );

          return intersects.length > 0;
        }

        anchor = mindarThree.addAnchor(0);
        updateDisplayedItem(currentItemIndex);

        cssAnchor.onTargetFound = () =>{
            // scanningEl.classList.add('hidden');
            console.log("Target found");
            categoriesEl.style.visibility = "visible";
            view3dEl.style.visibility = "visible";
            orderSectionEl.style.visibility = "visible";
            // foodListEl.style.visibility = "visible";        // const scanningEl = document.getElementById('scanning');
        // scanningEl.classList.remove('hidden');
lower.classList.remove('hidden-ui');
lower.classList.add('show-ui');
            menuIconBtn.style.visibility = 'visible';

        }

        cssAnchor.onTargetLost = ()=>{
            // scanningEl.classList.remove('hidden');
            console.log("Target lost!");
            categoriesEl.style.visibility = 'hidden';
            view3dEl.style.visibility = 'hidden';
            // foodListEl.style.visibility = 'hidden';
            orderSectionEl.style.visibility = 'hidden'; 
            lower.classList.add('hidden-ui');
lower.classList.remove('show-ui');
            menuIconBtn.style.visibility = 'hidden';
        }

        updateDisplayedItem(currentItemIndex);
        setActive(allBtn);
        firstData('all');

        let isDragging = false;
        let lastX = 0;
        let lastY = 0;

        const ROTATE_SPEED = 0.005;

        window.addEventListener("touchstart", (e) => {
          if (!rotationGroup) return;
          isDragging = true;
          lastX = e.touches[0].clientX;
          lastY = e.touches[0].clientY;
        });

        window.addEventListener("touchmove", (e) => {
          if (!isDragging || !rotationGroup) return;

          const x = e.touches[0].clientX;
          const y = e.touches[0].clientY;

          const deltaX = x - lastX;
          const deltaY = y - lastY;

          rotationGroup.rotation.y += deltaX * ROTATE_SPEED;
          rotationGroup.rotation.x += deltaY * ROTATE_SPEED;

          // Clamp vertical rotation (no upside-down food 🍔)
          rotationGroup.rotation.x = THREE.MathUtils.clamp(
            rotationGroup.rotation.x,
            -Math.PI / 4,
            Math.PI / 4
          );

          lastX = x;
          lastY = y;
        });

        window.addEventListener("touchend", () => {
          isDragging = false;
        });

        window.addEventListener("mousedown", (e) => {
          if (!isModelClicked(e)) return;

          isRotating = true;
          lastX = e.clientX;
          lastY = e.clientY;
        });

        window.addEventListener("mousemove", (e) => {
          if (!isRotating || !rotationGroup) return;

          const dx = e.clientX - lastX;
          const dy = e.clientY - lastY;

          rotationGroup.rotation.y += dx * 0.005;
          rotationGroup.rotation.x += dy * 0.005;

          rotationGroup.rotation.x = THREE.MathUtils.clamp(
            rotationGroup.rotation.x,
            -Math.PI / 4,
            Math.PI / 4
          );

          lastX = e.clientX;
          lastY = e.clientY;
        });

        window.addEventListener("mouseup", () => {
          isRotating = false;
        });

        setActive(allBtn);
        firstData('all');
        await mindarThree.start();
        // console.log("MindAR started");


        renderer.setAnimationLoop(()=>{

            cssRenderer.render(cssScene,camera);
            renderer.render(scene,camera);
        });
    };
    start();
})