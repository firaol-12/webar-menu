import { mockWithVideo } from "./libs/camera-mock.js";
import { initGLTFLoader, loadGLTF } from "./libs/loader.js";

const THREE = window.MINDAR.IMAGE.THREE;
THREE.Cache.enabled = false;

const modelCache = {};

document.addEventListener('DOMContentLoaded', () => {
    const start = async () => {
        // mockWithVideo('./assets/mock.mp4');
        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            imageTargetSrc: './assets/restaurant_logo.mind',
            container: document.querySelector("#container"),
            uiScanning: "#scanning",
            uiLoading: "no",
        });

        let currentModel = null;
        let currentItemIndex = 0;
        let anchor = null;
        let isLoadingModel = false;
        let menuItemElements = [];
        let priceItemElements = [];
        let rotationGroup = null;
        let isRotating = false;
        let isFoodListVisible = false;
        
        // 🔧 FREEZE VARIABLES
        let isFrozen = false;
        let frozenModelGroup = null;
        let frozenWorldPosition = new THREE.Vector3();
        let frozenWorldQuaternion = new THREE.Quaternion();
        let frozenWorldScale = new THREE.Vector3();
        let isTargetFound = false;
        
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const menu = [
            { id: 1, calorie: 350, name: "Burger", price: 150, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518831/hb-f_ggiyqa.glb", catagorie: "breakfast" },
            { id: 2, calorie: 35, name: "Cheese Burger", price: 180, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518856/tco-8f_gmvnn2.glb", catagorie: "breakfast" },
            { id: 3, calorie: 400, name: "Pizza Margherita", price: 250, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518858/tbs-12f_yz30yx.glb", catagorie: "breakfast" },
            { id: 4, calorie: 360, name: "Chicken Pizza", price: 300, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518831/gnf-7f_tfdhmn.glb", catagorie: "breakfast" },
            { id: 5, calorie: 30, name: "Pasta Alfredo", price: 220, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518827/fir_kx7h5f.glb", catagorie: "breakfast" },
            { id: 6, calorie: 350, name: "Pasta Bolognese", price: 240, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518831/hb-f_ggiyqa.glb", catagorie: "breakfast" },
            { id: 7, calorie: 360, name: "Kitfo", price: 300, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518848/pza-8f_phh4wk.glb", catagorie: "breakfast" },
            { id: 8, calorie: 380, name: "Tibs", price: 280, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518858/tbs-12f_yz30yx.glb", catagorie: "breakfast" },
            { id: 9, calorie: 750, name: "Shiro", price: 120, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518831/gnf-7f_tfdhmn.glb", catagorie: "lunch" },
            { id: 10, calorie: 250, name: "Firfir", price: 100, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518827/fir_kx7h5f.glb", catagorie: "lunch" },
            { id: 11, calorie: 550, name: "French Fries", price: 80, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518856/tco-8f_gmvnn2.glb", catagorie: "lunch" },
            { id: 12, calorie: 250, name: "Chicken Sandwich", price: 200, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518848/pza-8f_phh4wk.glb", catagorie: "lunch" },
            { id: 13, calorie: 120, name: "Beef Sandwich", price: 220, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518858/tbs-12f_yz30yx.glb", catagorie: "lunch" },
            { id: 14, calorie: 130, name: "Vegetable Pizza", price: 270, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518827/fir_kx7h5f.glb", catagorie: "lunch" },
            { id: 15, calorie: 300, name: "Seafood Pizza", price: 350, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518858/tbs-12f_yz30yx.glb", catagorie: "lunch" },
            { id: 16, calorie: 600, name: "Spaghetti Carbonara", price: 260, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518831/gnf-7f_tfdhmn.glb", catagorie: "lunch" },
            { id: 17, calorie: 300, name: "Lasagna", price: 280, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518827/fir_kx7h5f.glb", catagorie: "lunch" },
            { id: 18, calorie: 330, name: "Doro Wat", price: 320, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518856/tco-8f_gmvnn2.glb", catagorie: "dinner" },
            { id: 19, calorie: 340, name: "Gomen", price: 140, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518848/pza-8f_phh4wk.glb", catagorie: "dinner" },
            { id: 20, calorie: 390, name: "Misir Wat", price: 150, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518858/tbs-12f_yz30yx.glb", catagorie: "dinner" },
            { id: 21, calorie: 240, name: "Foul Medames", price: 130, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518831/gnf-7f_tfdhmn.glb", catagorie: "dinner" },
            { id: 22, calorie: 350, name: "Egg Firfir", price: 140, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518831/hb-f_ggiyqa.glb", catagorie: "dinner" },
            { id: 23, calorie: 670, name: "Rice with Chicken", price: 240, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518856/tco-8f_gmvnn2.glb", catagorie: "dinner" },
            { id: 24, calorie: 378, name: "Beef Sandwich", price: 220, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518848/pza-8f_phh4wk.glb", catagorie: "dinner" },
            { id: 25, calorie: 352, name: "Vegetable Pizza", price: 270, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518831/gnf-7f_tfdhmn.glb", catagorie: "dinner" },
            { id: 26, calorie: 323, name: "Seafood Pizza", price: 350, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518831/hb-f_ggiyqa.glb", catagorie: "dinner" },
            { id: 27, calorie: 385, name: "Spaghetti Carbonara", price: 260, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518856/tco-8f_gmvnn2.glb", catagorie: "dinner" },
            { id: 28, calorie: 356, name: "Lasagna", price: 280, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518831/gnf-7f_tfdhmn.glb", catagorie: "dinner" },
            { id: 29, calorie: 325, name: "Doro Wat", price: 320, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518858/tbs-12f_yz30yx.glb", catagorie: "fasting" },
            { id: 30, calorie: 643, name: "Gomen", price: 140, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518831/hb-f_ggiyqa.glb", catagorie: "fasting" },
            { id: 31, calorie: 312, name: "Misir Wat", price: 150, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518827/fir_kx7h5f.glb", catagorie: "fasting" },
            { id: 32, calorie: 177, name: "Foul Medames", price: 130, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518831/gnf-7f_tfdhmn.glb", catagorie: "fasting" },
            { id: 33, calorie: 324, name: "Egg Firfir", price: 140, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518848/pza-8f_phh4wk.glb", catagorie: "fasting" },
            { id: 34, calorie: 333, name: "Rice with Chicken", price: 240, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518856/tco-8f_gmvnn2.glb", catagorie: "fasting" },
            { id: 35, calorie: 400, name: "Rice with Beef", price: 260, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518827/fir_kx7h5f.glb", catagorie: "fasting" },
            { id: 36, calorie: 390, name: "Misir Wat", price: 150, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518858/tbs-12f_yz30yx.glb", catagorie: "dinner" },
            { id: 37, calorie: 240, name: "Foul Medames", price: 130, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518831/gnf-7f_tfdhmn.glb", catagorie: "dinner" },
            { id: 38, calorie: 350, name: "Egg Firfir", price: 140, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518831/hb-f_ggiyqa.glb", catagorie: "dinner" },
            { id: 39, calorie: 670, name: "Rice with Chicken", price: 240, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518856/tco-8f_gmvnn2.glb", catagorie: "dinner" },
            { id: 40, calorie: 378, name: "Beef Sandwich", price: 220, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518848/pza-8f_phh4wk.glb", catagorie: "dinner" },
            { id: 41, calorie: 352, name: "Vegetable Pizza", price: 270, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518831/gnf-7f_tfdhmn.glb", catagorie: "dinner" },
            { id: 42, calorie: 323, name: "Seafood Pizza", price: 350, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518831/hb-f_ggiyqa.glb", catagorie: "dinner" },
            { id: 43, calorie: 385, name: "Spaghetti Carbonara", price: 260, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518856/tco-8f_gmvnn2.glb", catagorie: "dinner" },
            { id: 44, calorie: 356, name: "Lasagna", price: 280, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518831/gnf-7f_tfdhmn.glb", catagorie: "dinner" },
            { id: 45, calorie: 325, name: "Doro Wat", price: 320, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518858/tbs-12f_yz30yx.glb", catagorie: "fasting" },
            { id: 46, calorie: 643, name: "Gomen", price: 140, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518831/hb-f_ggiyqa.glb", catagorie: "fasting" },
            { id: 47, calorie: 312, name: "Misir Wat", price: 150, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518827/fir_kx7h5f.glb", catagorie: "fasting" },
            { id: 48, calorie: 177, name: "Foul Medames", price: 130, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518831/gnf-7f_tfdhmn.glb", catagorie: "fasting" },
            { id: 49, calorie: 324, name: "Egg Firfir", price: 140, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518848/pza-8f_phh4wk.glb", catagorie: "fasting" },
            { id: 50, calorie: 333, name: "Rice with Chicken", price: 240, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518856/tco-8f_gmvnn2.glb", catagorie: "fasting" },
            { id: 51, calorie: 400, name: "Rice with Beef", price: 260, glt: "https://res.cloudinary.com/djw0srhou/image/upload/v1776518827/fir_kx7h5f.glb", catagorie: "fasting" }
        ];

        const { renderer, scene, camera } = mindarThree;

        initGLTFLoader(renderer);

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);
        
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight.position.set(1, 1, 1);
        scene.add(dirLight);

        // UI Elements
        const categoriesEl = document.getElementById('categories');
        const view3dEl = document.getElementById('view3d');
        const orderSectionEl = document.getElementById('orderSection');
        const foodListEl = document.getElementById('foodList');
        const nameContainer = document.getElementById('nameContainer');
        const priceContainer = document.getElementById('priceContainer');
        const prevBtn = document.querySelector('#prevBtn');
        const nextBtn = document.querySelector('#nextBtn');
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
        const lowerPrice = document.getElementById('lower-price');
        const lowerName = document.getElementById('lower-name');
        const lowerCalorie = document.getElementById('lower-calorie');
        
        // Freeze button
        const freezeBtn = document.getElementById('freezeBtn');
        const freezeIcon = document.getElementById('freezeIcon');
        const scanningEl = document.getElementById('scanning');

        // 🔧 FREEZE FUNCTION
        function freezeModel() {
            if (!rotationGroup || !anchor) return;
            
            console.log("🔒 FREEZING 3D MODEL!");
            
            // Save world position
            rotationGroup.getWorldPosition(frozenWorldPosition);
            rotationGroup.getWorldQuaternion(frozenWorldQuaternion);
            rotationGroup.getWorldScale(frozenWorldScale);
            
            // Create frozen group
            frozenModelGroup = new THREE.Group();
            
            while(rotationGroup.children.length > 0) {
                const child = rotationGroup.children[0];
                rotationGroup.remove(child);
                frozenModelGroup.add(child);
            }
            
            // Remove from anchor and add to scene
            anchor.group.remove(rotationGroup);
            scene.add(frozenModelGroup);
            
            // Set frozen position
            frozenModelGroup.position.copy(frozenWorldPosition);
            frozenModelGroup.quaternion.copy(frozenWorldQuaternion);
            frozenModelGroup.scale.copy(frozenWorldScale);
            
            rotationGroup = frozenModelGroup;
            
            isFrozen = true;
            freezeBtn.style.background = "#4CAF50";
            freezeIcon.src = 'https://res.cloudinary.com/djw0srhou/image/upload/q_auto:eco,f_auto,w_240,c_scale/v1776499186/unlock_twp3et.png';
            
            // Keep scanning hidden when frozen
            scanningEl.classList.add('hidden');
        }

        // 🔧 UNFREEZE FUNCTION - Show scanning immediately
        function unfreezeModel() {
            if (!frozenModelGroup || !anchor) return;
            
            console.log("🔓 UNFREEZING 3D MODEL!");
            
            // Create new rotation group
            const newRotationGroup = new THREE.Group();
            
            // Move children back
            while(frozenModelGroup.children.length > 0) {
                const child = frozenModelGroup.children[0];
                frozenModelGroup.remove(child);
                newRotationGroup.add(child);
            }
            
            // Remove from scene and add to anchor
            scene.remove(frozenModelGroup);
            anchor.group.add(newRotationGroup);
            
            // Reset position relative to anchor
            newRotationGroup.position.set(0, 0, 0);
            newRotationGroup.quaternion.identity();
            newRotationGroup.scale.set(1, 1, 1);
            
            rotationGroup = newRotationGroup;
            frozenModelGroup = null;
            
            isFrozen = false;
            freezeBtn.style.background = "rgba(0, 0, 0, 0.7)";
            freezeIcon.src = 'https://res.cloudinary.com/djw0srhou/image/upload/q_auto:eco,f_auto,w_240,c_scale/v1776499186/padlock_vuzsyt.png';
            
            // 🔧 Show scanning if target is not currently found
            if (!isTargetFound) {
                scanningEl.classList.remove('hidden');
                // Hide UI until target is found again
                hideAllUI();
            }
        }

        // 🔧 Hide all UI elements
        function hideAllUI() {
            categoriesEl.style.visibility = "hidden";
            view3dEl.style.visibility = "hidden";
            orderSectionEl.style.visibility = "hidden";
            lower.classList.remove('show-ui');
            lower.classList.add('hidden-ui');
            menuIconBtn.style.visibility = 'hidden';
            foodList.classList.remove('show-ui');
            foodList.classList.add('hidden-ui');
            isFoodListVisible = false;
            freezeBtn.style.visibility = 'hidden';
        }

        // 🔧 Show all UI elements
        function showAllUI() {
            categoriesEl.style.visibility = "visible";
            view3dEl.style.visibility = "visible";
            orderSectionEl.style.visibility = "visible";
            lower.classList.remove('hidden-ui');
            lower.classList.add('show-ui');
            menuIconBtn.style.visibility = 'visible';
            freezeBtn.style.visibility = 'visible';

        }

        // 🔧 FREEZE BUTTON
        if (freezeBtn) {
            freezeBtn.addEventListener('click', function() {
                if (!isFrozen) {
                    freezeModel();
                } else {
                    unfreezeModel();
                }
            });
        }

        function highlightCurrentMenuItem(index) {
            menuItemElements.forEach((item, i) => {
                if (i === index) {
                    item.classList.add('highlighted');
                    if (priceItemElements[i]) {
                        priceItemElements[i].classList.add('highlighted');
                    }
                } else {
                    item.classList.remove('highlighted');
                    if (priceItemElements[i]) {
                        priceItemElements[i].classList.remove('highlighted');
                    }
                }
            });
        }

        function disposeModel(object) {
            if (!object) return;

            object.traverse((child) => {
                if (!child.isMesh) return;

                if (child.geometry) {
                    child.geometry.dispose();
                    child.geometry = null;
                }

                if (child.material) {
                    const materials = Array.isArray(child.material)
                        ? child.material
                        : [child.material];

                    materials.forEach((mat) => {
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

        let currentDisplayedItems = [];
        let selectedItem = null;

        function displayItems(array) {
            nameContainer.innerHTML = "";
            priceContainer.innerHTML = "";

            menuItemElements = [];
            priceItemElements = [];

            array.forEach((item, index) => {
                const nameDiv = document.createElement('div');
                nameDiv.className = 'menu-item';
                nameDiv.textContent = item.name;
                nameDiv.addEventListener('click', () => {
                    selectedItem = item;
                    currentItemIndex = index;
                    update3DModel(item);
                    highlightCurrentMenuItem(index);
                    updateLowerUI(item);
                });

                const priceDiv = document.createElement('div');
                priceDiv.className = 'price-item';
                priceDiv.innerHTML = `${item.price} ETB`;

                nameContainer.appendChild(nameDiv);
                priceContainer.appendChild(priceDiv);

                menuItemElements.push(nameDiv);
                priceItemElements.push(priceDiv);
            });
        }

        const setFirstItemActive = () => {
            if (currentDisplayedItems.length === 0) return;

            const firstItem = currentDisplayedItems[0];
            selectedItem = firstItem;
            currentItemIndex = 0;

            highlightCurrentMenuItem(0);
            update3DModel(firstItem);
            updateLowerUI(firstItem);
        }

        const firstData = (category) => {
            if (currentModel) {
                if (isFrozen && frozenModelGroup) {
                    scene.remove(frozenModelGroup);
                } else if (rotationGroup && anchor) {
                    anchor.group.remove(rotationGroup);
                }
                disposeModel(currentModel);
                currentModel = null;
                rotationGroup = null;
                frozenModelGroup = null;
            }

            for (const id in modelCache) {
                disposeModel(modelCache[id]);
                delete modelCache[id];
            }

            currentDisplayedItems = category === 'all'
                ? menu
                : menu.filter(item => item.catagorie === category);

            displayItems(currentDisplayedItems);
            setFirstItemActive();
        };

        function setActive(btn) {
            [allBtn, breakfast, lunch, dinner, fasting].forEach(b => {
                b.classList.remove('highlighted');
            });
            btn.classList.add('highlighted');
        }

        allBtn.addEventListener('click', () => {
            setActive(allBtn);
            firstData('all');
        });

        breakfast.addEventListener('click', () => {
            setActive(breakfast);
            firstData('breakfast');
        });

        lunch.addEventListener('click', () => {
            setActive(lunch);
            firstData('lunch');
        });

        dinner.addEventListener('click', () => {
            setActive(dinner);
            firstData('dinner');
        });

        fasting.addEventListener('click', () => {
            setActive(fasting);
            firstData('fasting');
        });

        function updateDisplayedItem(index) {
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
                if (currentModel) {
                    if (isFrozen && frozenModelGroup) {
                        while(frozenModelGroup.children.length > 0) {
                            const child = frozenModelGroup.children[0];
                            frozenModelGroup.remove(child);
                        }
                        scene.remove(frozenModelGroup);
                    } else if (rotationGroup && anchor) {
                        anchor.group.remove(rotationGroup);
                    }
                    disposeModel(currentModel);
                    currentModel = null;
                    rotationGroup = null;
                }

                const gltf = await loadGLTF(item.glt, renderer);
                currentModel = gltf.scene;

                currentModel.scale.set(1.5, 1.5, 1.5);
                currentModel.position.set(0, -0.3, 0);

                if (isFrozen) {
                    frozenModelGroup = new THREE.Group();
                    frozenModelGroup.add(currentModel);
                    scene.add(frozenModelGroup);
                    
                    frozenModelGroup.position.copy(frozenWorldPosition);
                    frozenModelGroup.quaternion.copy(frozenWorldQuaternion);
                    frozenModelGroup.scale.copy(frozenWorldScale);
                    
                    rotationGroup = frozenModelGroup;
                    scanningEl.classList.add('hidden');
                } else {
                    rotationGroup = new THREE.Group();
                    rotationGroup.add(currentModel);
                    anchor.group.add(rotationGroup);
                    frozenModelGroup = null;
                }
            } catch (e) {
                console.error(e);
            } finally {
                isLoadingModel = false;
            }
        }

        const cartPanel = document.getElementById('cart-panel');
        let isOrdering = false;

        orderBtn.addEventListener('click', () => {
            if (isOrdering || !selectedItem) return;
            isOrdering = true;
            addToCart({ ...selectedItem });
            setTimeout(() => { isOrdering = false; }, 200);
        });

        let cart = [];

        function addToCart(item) {
            cart.push(item);
            orderNmr.textContent = cart.length;
            renderCart();
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            orderNmr.textContent = cart.length;
            renderCart();
        }

        function renderCart() {
            const cartItemsEl = document.getElementById('cart-items');
            const totalPriceEl = document.getElementById('cart-total-price');
            cartItemsEl.innerHTML = "";
            let total = 0;
            
            cart.forEach((item, index) => {
                total += item.price;
                const li = document.createElement('li');
                li.className = 'cart-item';
                const text = document.createElement('span');
                text.textContent = `${item.name} - ${item.price} ETB`;
                const removeBtn = document.createElement('button');
                removeBtn.innerHTML = '✕';
                removeBtn.addEventListener('click', () => removeFromCart(index));
                li.appendChild(text);
                li.appendChild(removeBtn);
                cartItemsEl.appendChild(li);
            });

            totalPriceEl.textContent = `${total} ETB`;
        }

        const backMenuBtn = document.getElementById('back-menu-btn');
        backMenuBtn.addEventListener('click', () => {
            cartPanel.classList.remove('show');
        });

        orderList.addEventListener('click', () => {
            cartPanel.classList.add('show');
        });

        prevBtn.addEventListener('click', () => {
            if (!isLoadingModel) {
                currentItemIndex = (currentItemIndex - 1 + currentDisplayedItems.length) % currentDisplayedItems.length;
                updateDisplayedItem(currentItemIndex);
            }
        });

        nextBtn.addEventListener('click', () => {
            if (!isLoadingModel) {
                currentItemIndex = (currentItemIndex + 1) % currentDisplayedItems.length;
                updateDisplayedItem(currentItemIndex);
            }
        });

        // Show food list
        menuIconBtn.addEventListener('click', () => {
            if (!isFoodListVisible) {
                isFoodListVisible = true;
                lower.classList.remove('show-ui');
                lower.classList.add('hidden-ui');
                menuIconBtn.style.visibility = 'hidden';
                setTimeout(() => {
                    foodList.classList.remove('hidden-ui');
                    foodList.classList.add('show-ui');
                }, 50);
            }
        });

        // Hide food list
        cancelBtn.addEventListener('click', () => {
            if (isFoodListVisible) {
                isFoodListVisible = false;
                foodList.classList.remove('show-ui');
                foodList.classList.add('hidden-ui');
                lower.classList.remove('hidden-ui');
                lower.classList.add('show-ui');
                menuIconBtn.style.visibility = 'visible';
            }
        });

        function updateLowerUI(item) {
            if (!item) return;
            lowerPrice.textContent = `${item.price} birr`;
            lowerName.textContent = item.name;
            lowerCalorie.textContent = `${item.calorie} kcal` || "N/A";
        }

        anchor = mindarThree.addAnchor(0);

        // 🔧 Target found - Show UI and hide scanning
        anchor.onTargetFound = () => {
            isTargetFound = true;
            scanningEl.classList.add('hidden');
            
            // Show UI if not frozen (frozen UI is already managed)
            if (!isFrozen) {
                showAllUI();
            }
            console.log("Target found");
        }

        // 🔧 Target lost - Hide UI and show scanning if not frozen
        anchor.onTargetLost = () => {
            isTargetFound = false;
            
            if (!isFrozen) {
                scanningEl.classList.remove('hidden');
                hideAllUI();
            }
            console.log("Target lost - Frozen:", isFrozen);
        }

        // 🔧 Start with UI hidden, only scanning visible
        hideAllUI();
        scanningEl.classList.remove('hidden');

        updateDisplayedItem(currentItemIndex);
        setActive(allBtn);
        firstData('all');

        // Rotation controls
        let isDragging = false;
        let lastX = 0;
        let lastY = 0;
        const ROTATE_SPEED = 0.01;

        function handleRotateStart(x, y) {
            if (!rotationGroup) return;
            isDragging = true;
            lastX = x;
            lastY = y;
        }

        function handleRotateMove(x, y) {
            if (!isDragging || !rotationGroup) return;

            const deltaX = x - lastX;
            const deltaY = y - lastY;

            rotationGroup.rotation.y += deltaX * ROTATE_SPEED;
            rotationGroup.rotation.x += deltaY * ROTATE_SPEED;

            rotationGroup.rotation.x = THREE.MathUtils.clamp(
                rotationGroup.rotation.x,
                -Math.PI / 3,
                Math.PI / 3
            );

            lastX = x;
            lastY = y;
        }

        function handleRotateEnd() {
            isDragging = false;
        }

        window.addEventListener("touchstart", (e) => {
            handleRotateStart(e.touches[0].clientX, e.touches[0].clientY);
        });

        window.addEventListener("touchmove", (e) => {
            e.preventDefault();
            handleRotateMove(e.touches[0].clientX, e.touches[0].clientY);
        });

        window.addEventListener("touchend", handleRotateEnd);

        window.addEventListener("mousedown", (e) => {
            handleRotateStart(e.clientX, e.clientY);
        });

        window.addEventListener("mousemove", (e) => {
            handleRotateMove(e.clientX, e.clientY);
        });

        window.addEventListener("mouseup", handleRotateEnd);

        await mindarThree.start();

        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
        });
    };
    start();
});