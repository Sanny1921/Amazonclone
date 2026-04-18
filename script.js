// ================= FETCH REAL API =================

async function fetchProducts() {
    try {
        const res = await fetch("https://dummyjson.com/products?limit=200");
        const data = await res.json();

        // Transform data into categories
        const categorized = categorizeProducts(data.products);

        initPage(categorized);

    } catch (err) {
        console.error("API Error:", err);
    }
}

// ================= CATEGORY MAPPING =================

function categorizeProducts(products) {
    return {
        kitchen: products.filter(p =>
            p.category.includes("groceries") || p.category.includes("home")
        ).slice(0, 4),

        fashion: products.filter(p =>
            p.category.includes("clothing") || p.category.includes("mens") || p.category.includes("womens")
        ).slice(0, 4),

        electronics: products.filter(p =>
            p.category.includes("laptops") || p.category.includes("smartphones")
        ).slice(0, 4),

        beauty: products.filter(p =>
            p.category.includes("beauty")
        ).slice(0, 4)
    };
}

// ================= INIT =================

function initPage(data) {
    createSection("Starting ₹999 | Trending kitchen essentials", data.kitchen);
    createSection("Best Sellers in Clothing & Accessories", data.fashion);
    createSection("Up to 40% off | Electronics", data.electronics);
    createSection("Best Sellers in Beauty", data.beauty);
}

// ================= CREATE SECTION =================

function createSection(title, products) {
    const section = document.createElement("div");
    section.className = "section";

    section.innerHTML = `
        <h2>${title}</h2>
        <div class="products-grid">
            ${products.map(p => `
                <div class="card">
                    <img src="${p.thumbnail}" loading="lazy">
                    <h4>${p.title}</h4>
                    <div class="price">₹${Math.round(p.price * 80)}</div>
                    <div class="discount">${Math.round(p.discountPercentage)}% off</div>
                    <button onclick="addToCart()">Add to Cart</button>
                </div>
            `).join("")}
        </div>
    `;

    document.getElementById("content").appendChild(section);
}

// ================= CART =================

let cartCount = 0;

function addToCart() {
    cartCount++;
    document.getElementById("cartCount").innerText = cartCount;
}

// ================= SEARCH =================

document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.querySelector(".nav-search input").value;
    console.log("Search:", query);
});

// ================= HERO SLIDER =================

const heroImages = [
    "https://images-eu.ssl-images-amazon.com/images/G/31/events/MegaDealsEvents/PCHomepageHERO/KV_PC._CB781365480_.jpg",
    "https://images-eu.ssl-images-amazon.com/images/G/31/img23/Beauty/GW/yesbank/makeup_PC._CB796616147_.png",
    "https://images-eu.ssl-images-amazon.com/images/G/31/img24/Media/Toyfiesta/toys/Desktop_tall_Hero_3000x1200_pools._CB785376404_.jpg"
];

let currentSlide = 0;
const slider = document.getElementById("heroSlider");

// Render images
slider.innerHTML = heroImages.map(img => `
    <img src="${img}" alt="banner">
`).join("");

// Force correct width after load (important for some browsers)
function updateSlide() {
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Auto slide
setInterval(() => {
    currentSlide++;
    if (currentSlide >= heroImages.length) currentSlide = 0;
    updateSlide();
}, 4000);

// Buttons
document.querySelector(".hero-btn.left").onclick = () => {
    currentSlide--;
    if (currentSlide < 0) currentSlide = heroImages.length - 1;
    updateSlide();
};

document.querySelector(".hero-btn.right").onclick = () => {
    currentSlide++;
    if (currentSlide >= heroImages.length) currentSlide = 0;
    updateSlide();
};



// ================= CATEGORY GRID =================

function createCategoryGrid(products) {
    const container = document.getElementById("categoryGrid");

    const sample = products.slice(0, 8);

    container.innerHTML = `
        ${[0,1,2,3].map(i => `
            <div class="category-box">
                <h3>Top picks for you</h3>
                <div class="category-items">
                    ${sample.slice(i*2, i*2+4).map(p => `
                        <div>
                            <img src="${p.thumbnail}">
                            <p>${p.title}</p>
                        </div>
                    `).join("")}
                </div>
            </div>
        `).join("")}
    `;
}

// ================= CAROUSEL =================

function createCarousel(title, products) {
    const section = document.createElement("div");
    section.className = "carousel-container";

    section.innerHTML = `
        <h2 class="carousel-title">${title}</h2>
        <button class="carousel-btn left">❮</button>
        <div class="carousel">
            ${products.map(p => `
                <div class="card">
                    <img src="${p.thumbnail}">
                    <h4>${p.title}</h4>
                    <div class="price">₹${Math.round(p.price * 80)}</div>
                </div>
            `).join("")}
        </div>
        <button class="carousel-btn right">❯</button>
    `;

    const carousel = section.querySelector(".carousel");

    section.querySelector(".left").onclick = () => {
        carousel.scrollBy({
            left: -300,
            behavior: "smooth"
        });
    };

    section.querySelector(".right").onclick = () => {
        carousel.scrollBy({
            left: 300,
            behavior: "smooth"
        });
    };

    document.getElementById("productSections").appendChild(section);
}

// ================= UPDATE INIT =================

function initPage(data) {

    const allProducts = [
        ...data.kitchen,
        ...data.fashion,
        ...data.electronics,
        ...data.beauty
    ];

    // CATEGORY GRID
    createCategoryGrid(allProducts);

    // CAROUSELS
    createCarousel("Best Sellers", allProducts);
    createCarousel("Top Deals", data.electronics);
    createCarousel("Trending Now", data.fashion);
}




// ================= BACK TO TOP =================

document.querySelector(".back-to-top").onclick = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};

// ================= HOVER FEEDBACK =================

document.addEventListener("mouseover", (e) => {
    if (e.target.closest(".card")) {
        e.target.closest(".card").style.cursor = "pointer";
    }
});



const searchDropdown = document.querySelector(".search-dropdown");
const selected = searchDropdown.querySelector(".selected");
const options = searchDropdown.querySelectorAll(".dropdown-list p");

selected.onclick = () => {
    searchDropdown.classList.toggle("active");
};

options.forEach(opt => {
    opt.onclick = () => {
        selected.innerHTML = opt.innerText + ' <i class="fa fa-caret-down"></i>';
        searchDropdown.classList.remove("active");
    };
});

// CLOSE ON OUTSIDE CLICK
document.addEventListener("click", (e) => {
    if (!searchDropdown.contains(e.target)) {
        searchDropdown.classList.remove("active");
    }
});

// ================= START =================

fetchProducts();