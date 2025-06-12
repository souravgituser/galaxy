fetch("data/product.json")
  .then((response) => response.json())
  .then((data) => {
    const productList = document.getElementById("productList");
    const productList2 = document.getElementById("productList2");
    const categorySwiper = document.getElementById("categorySwiper");

    // const featureProducts = data.products.slice(0, 4)

    console.log("data.products", data.products);
    const bestSeller = data.products.slice(0, 4);

    const filterProducts = data.products?.filter((item) => item.featured);
    6;
    const categoryCounts = {};
    data.products.forEach((item) => {
      if (item.category && item.category.slug) {
        categoryCounts[item.category.slug] =
          (categoryCounts[item.category.slug] || 0) + 1;
      }
    });

    const uniqueCategories = {};
    const getCategoryProduct = data.products.filter((item) => {
      if (item.category && !uniqueCategories[item.category.slug]) {
        uniqueCategories[item.category.slug] = true;
        return true;
      }
      return false;
    });

    console.log("getCategoryProduct", getCategoryProduct);

    console.log("filter", filterProducts);

    filterProducts.forEach((product) => {
      const li = document.createElement("li");
      li.innerHTML = `
          <div class="cus-card">
            <div class="cusCardimg">
              <img src="${product.thumbnailImage}" class="img-fluid" alt="${
        product.title
      }">
            </div>
            <div class="cardContent">
              <h4 class="h4Title"><a href="product.html" onclick='viewProduct(${JSON.stringify(
                product
              )})'>${product.title}</a></h4>
              <div class="priceWrap">
                <div class="price">
                  Rs. <span>${product.price?.regular}</span>
                </div>
                <div class="priceMrp">
                  Rs. <span>${product.price?.sale}</span>
                </div>
              </div>
              <div class="btnWrap">
                <button class="btn btn-outline-light" onclick="addToCart('${
                  product.id
                }')">ADD TO CART</button>
                <a href="product.html" class="btn btn-light" onclick='viewProduct(${JSON.stringify(
                  product
                )})'>VIEW PRODUCT</a>
              </div>
            </div>
          </div>
        `;
      productList2.appendChild(li);
    });
    bestSeller.forEach((product) => {
      const li = document.createElement("li");
      li.innerHTML = `
          <div class="cus-card">
            <div class="cusCardimg">
              <img src="${product.thumbnailImage}" class="img-fluid" alt="${
        product.title
      }">
            </div>
            <div class="cardContent">
              <h4 class="h4Title"><a href="product.html" onclick='viewProduct(${JSON.stringify(
                product
              )})'>${product.title}</a></h4>
              <div class="priceWrap">
                <div class="price">
                  Rs. <span>${product.price?.regular}</span>
                </div>
                <div class="priceMrp">
                  Rs. <span>${product.price?.sale}</span>
                </div>
              </div>
              <div class="btnWrap">
                <button class="btn btn-outline-light" onclick="addToCart('${
                  product.id
                }')">ADD TO CART</button>
                <a href="product.html" class="btn btn-light" onclick='viewProduct(${JSON.stringify(
                  product
                )})'>VIEW PRODUCT</a>
              </div>
            </div>
          </div>
        `;
      productList.appendChild(li);
    });
    const categoryHtml = getCategoryProduct
      .map((item) => {
        const count = categoryCounts[item.category.slug];
        return `
      <div class="swiper-slide">
        <a href="/categories.html?category=${item?.category?.slug}">
          <img
            src=${item?.category?.catimage}
            class="img-fluid"
            alt="categoies"
          />
        </a>
        <div class="cateTitle">
          <h3 class="text-center">${item?.category?.name}</h3>
        </div>
        <div class="cateCount text-center">
          <span>${count} Items</span>
        </div>
      </div>
      `;
      })
      .join("");
    categorySwiper.innerHTML = categoryHtml;
  })
  .catch((error) => {
    console.error("Error loading products:", error);
  });
//Add to Cart
function addToCart(productId) {
  fetch("data/product.json")
    .then((response) => response.json())
    .then((data) => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const product = data.products.find((p) => p.id === productId);
      const cartCounter = document.getElementById("cartCount");
      if (product) {
        const existing = cart.find((item) => item.id === productId);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({ ...product, quantity: 1 });
        }
        cartCounter.textContent = cart.length;
        localStorage.setItem("cart", JSON.stringify(cart));
        // alert(`${product.title} added to cart.`);
        console.log("cart", cart.length);
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      }
    })
    .catch((error) => {
      console.error("Error loading products:", error);
    });
}

//KNOW MORE
function buyNow(productId) {
  let products = JSON.parse(localStorage.getItem("cart")) || [];
  const product = products.find((p) => p.id === productId);
  if (product) {
    alert(`Redirecting to checkout for ${product.title}...`);
    window.location.href = `/checkout.html?productId=${product.id}`;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.getElementById("cartCount").textContent = cart.length;
});

//Cart Page
document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.querySelector(".cartItems");
  const totalPriceEl = document.querySelector(".totalPrice");
  const cartData = JSON.parse(localStorage.getItem("cart")) || [];

  if (!cartData || cartData.length === 0) {
    cartContainer.innerHTML = `
      <div class="row">
        <div class="col-12 text-center py-5">
          <img src="images/empty-cart.png" alt="Empty Cart" style="max-width: 150px; opacity: 0.6;" />
          <h4 class="mt-3 text-white">Your cart is empty</h4>
          <a href="/" class="btn btn-outline-light mt-3">Continue Shopping</a>
        </div>
      </div>
    `;
    totalPriceEl.textContent = 0;
    return;
  }

  let total = 0;
  cartData.forEach((item, index) => {
    const itemTotal = item.price?.sale * item.quantity;
    total += itemTotal;

    const cartItemHtml = `
        <div class="row carttableRow align-items-center">
          <div class="col-md-7 col-6">
            <div class="cartProductdetails">
              <div class="cartMedia">
                <img src="${item.thumbnailImage}" class="img-fluid" alt="${item.title}" />
              </div>
              <div class="cartdetails">
                <h4>${item.title}</h4>
                <div class="cartsinPrice">Rs. <span>${item.price?.sale}</span></div>
                <div class="cartColor">Color: <span>${item.color}</span></div>
              </div>
            </div>
          </div>
          <div class="col-3 cartQtyWrap">
            <div class="input-group">
              <button class="btn btn-outline-secondary minus-btn" type="button" data-id="${item.id}">-</button>
              <input type="text" class="form-control text-center bg-transparent" value="${item.quantity}" readonly />
              <button class="btn btn-outline-secondary plus-btn" type="button" data-id="${item.id}">+</button>
            </div>
            <div class="deleteIcon delete-btn" data-id="${item.id}">
              <img src="images/delCart.png" class="img-fluid" alt="Remove" />
            </div>
          </div>
          <div class="col-md-2 col-3 text-end">
            <div class="profinalPrice">Rs. <span>${itemTotal}</span></div>
          </div>
        </div>
      `;

    cartContainer.insertAdjacentHTML("beforeend", cartItemHtml);
  });

  totalPriceEl.textContent = total;

  // === Event Handlers: Increment, Decrement, Delete ===
  document.addEventListener("click", function (e) {
    const target = e.target;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    console.log(target);

    // Plus button
    if (target.classList.contains("plus-btn")) {
      const id = target.dataset.id;
      const index = cart.findIndex((item) => item.id === id);
      if (index !== -1) {
        cart[index].quantity += 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        location.reload();
      }
    }

    // Minus button
    if (target.classList.contains("minus-btn")) {
      const id = target.dataset.id;
      const index = cart.findIndex((item) => item.id === id);
      if (index !== -1 && cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        location.reload();
      }
    }

    // Delete button (Fix here)
    const deleteBtn = target.closest(".delete-btn");
    if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      cart = cart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(cart));
      location.reload();
    }
  });
});

//Shop Page
document.addEventListener("DOMContentLoaded", function () {
  fetch("data/product.json")
    .then((res) => res.json())
    .then((products) => {
      const productList = document.getElementById("product-list");
      //   const paginationContainer = document.getElementById("pagination");
      //   const productsPerPage = 4;
      //   let currentPage = 1;
      //   let productsData = [];

      products.products.forEach((product) => {
        const productHTML = `
            <li>
              <div class="cus-card">
                <div class="cusCardimg">                
                  <img src="${product.thumbnailImage}" class="img-fluid" alt="${
          product.title
        }" />
                </div>
                <div class="cardContent">
                  <h4 class="h4Title"><a href="product.html" onclick='viewProduct(${JSON.stringify(
                    product
                  )})'>${product.title}</a></h4>
                  <div class="priceWrap">
                    <div class="price">Rs. <span>${
                      product.price?.sale
                    }</span></div>
                    <div class="priceMrp">Rs. <span>${
                      product.price?.regular
                    }</span></div>
                  </div>
                  <div class="btnWrap">
                    <button class="btn btn-outline-light" onclick="addToCart('${
                      product.id
                    }')">ADD TO CART</button>
                    <a href="product.html" class="btn btn-light" onclick='viewProduct(${JSON.stringify(
                      product
                    )})'>VIEW PRODUCT</a>
                    
                  </div>
                </div>
              </div>
            </li>
          `;
        productList.insertAdjacentHTML("beforeend", productHTML);
      });
    })
    .catch((error) => {
      console.error("Error loading products:", error);
    });
});

// === Event Handlers: Delete ===
document.addEventListener("click", function (e) {
  const target = e.target;
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Delete button (Fix here)
  const deleteBtn = target.closest(".delete-btn");
  if (deleteBtn) {
    const id = deleteBtn.dataset.id;
    cart = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
  }
});

//Single Product

//Store Product Details in Local Storage by specific ID
function viewProduct(product) {
  localStorage.setItem("singleProduct", JSON.stringify(product));
}

const categoryProductDisplay = () => {
  if (!window.location.pathname.includes("categories.html")) return;

  const params = new URLSearchParams(window.location.search);
  const categorySlug = params.get("category");

  console.log("categorySlug", params);

  fetch("data/product.json")
    .then((res) => res.json())
    .then((data) => {
      const filtered = data.products.filter(
        (product) => product.category?.slug === categorySlug
      );

      const container = document.getElementById("categoryProductListing");

      if (filtered.length === 0) {
        container.innerHTML = "<li>No products found in this category.</li>";
        return;
      }

      const categoryHTML = filtered
        .map((item) => {
          return `<li>
                <div class="cus-card">
                  <div class="cusCardimg">
                    <img
                      src=${item?.thumbnailImage}
                      class="img-fluid"
                      alt=${item?.title}
                    />
                  </div>
                  <div class="cardContent">
                    <h4 class="h4Title">${item?.title}</h4>
                    <div class="priceWrap">
                      <div class="price">
                        Rs. <span id="priceMain">${item?.price?.sale}</span>
                      </div>
                      <div class="priceMrp">
                        Rs. <span id="priceMain">${item?.price?.regular}</span>
                      </div>
                    </div>
                    <div class="btnWrap">
                      <button class="btn btn-outline-light" onclick="addToCart('${
                        item.id
                      }')">ADD TO CART</button>
                      <a href='product.html' class="btn btn-light" onclick='viewProduct(${JSON.stringify(
                        item
                      )})'>Know More</a>
                    </div>
                  </div>
                </div>
              </li>`;
        })
        .join("");

      container.innerHTML = categoryHTML;
    })
    .catch((error) => {
      console.error("Error loading products:", error);
    });
};

categoryProductDisplay();
