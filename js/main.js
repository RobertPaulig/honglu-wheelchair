document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("active");
      nav.classList.toggle("active");
      document.body.style.overflow = nav.classList.contains("active") ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        nav.classList.remove("active");
        burger.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }

  // Header shadow on scroll
  const header = document.querySelector(".header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 10);
    });
  }

  // Scroll to top
  const scrollBtn = document.querySelector(".scroll-top");
  if (scrollBtn) {
    window.addEventListener("scroll", () => {
      scrollBtn.classList.toggle("visible", window.scrollY > 400);
    });
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Render by page type
  const page = document.body.dataset.page;
  if (page === "home") renderHome();
  if (page === "catalog") renderCatalog();
  if (page === "category") renderCategory();
  if (page === "product") renderProduct();
});

// ===== HOME =====
function renderHome() {
  const grid = document.getElementById("popular-products");
  if (!grid) return;
  const popular = ["king-kong-600w", "cloudrise", "th201", "future-q1-rear", "fullback-h4", "rehab-little-bee", "blackhawks-h2", "th101"];
  popular.forEach(id => {
    const p = getProductById(id);
    if (p) grid.innerHTML += productCard(p);
  });
}

// ===== CATALOG =====
function renderCatalog() {
  const grid = document.getElementById("categories-grid");
  if (!grid) return;
  CATEGORIES.forEach(cat => {
    const count = getProductsByCategory(cat.id).length;
    grid.innerHTML += `
      <a href="category.html?cat=${cat.id}" class="category-card">
        <div class="category-card-img-wrap">
          <img src="${cat.img}" alt="${cat.name}" class="category-card-img" onerror="this.src='img/hero-banner.jpg'">
        </div>
        <div class="category-card-body">
          <h3>${cat.name}</h3>
          <p>${cat.desc}</p>
        </div>
        <div class="category-card-count">${count}</div>
      </a>`;
  });
}

// ===== CATEGORY =====
function renderCategory() {
  const params = new URLSearchParams(window.location.search);
  const catId = params.get("cat");
  const cat = getCategoryById(catId);
  if (!cat) { document.getElementById("category-content").innerHTML = "<p style='padding:40px;text-align:center;'>Категория не найдена</p>"; return; }

  document.getElementById("category-title").textContent = cat.name;
  document.getElementById("category-desc").textContent = cat.desc;
  document.title = cat.name + " — Taihe Wheelchair";
  const bc = document.getElementById("breadcrumb-cat");
  if (bc) bc.textContent = cat.name;

  const grid = document.getElementById("category-products");
  getProductsByCategory(catId).forEach(p => { grid.innerHTML += productCard(p); });
}

// ===== PRODUCT =====
function renderProduct() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const p = getProductById(productId);
  if (!p) { document.getElementById("product-content").innerHTML = "<p style='padding:100px 40px;text-align:center;font-size:1.1rem;color:#5a6275;'>Товар не найден</p>"; return; }

  const cat = getCategoryById(p.category);
  document.title = p.name + " — купить | Taihe Wheelchair";

  // Meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = p.shortDesc + ". Цена " + formatPrice(p.price) + ". Доставка по РФ, гарантия 12 мес.";

  // Category link
  const catLink = document.getElementById("product-cat-link");
  if (catLink && cat) { catLink.href = "category.html?cat=" + cat.id; catLink.textContent = cat.name; }

  // Carousel
  initCarousel(p.images, p.name);

  // Basic info
  document.getElementById("product-name").textContent = p.name;
  document.getElementById("product-price").textContent = formatPrice(p.price);
  document.getElementById("product-desc").textContent = p.description;

  // Sticky bar price
  const stickyPrice = document.getElementById("sticky-price");
  if (stickyPrice) stickyPrice.textContent = formatPrice(p.price);

  // Quick specs badges
  const quickSpecs = document.getElementById("product-quick-specs");
  if (quickSpecs) {
    const badges = [];
    const weight = p.specs["Вес с АКБ"] || p.specs["Вес без АКБ"] || p.specs["Вес"] || "";
    const speed = p.specs["Макс. скорость"] || "";
    const range = p.specs["Запас хода"] || "";
    const motor = p.specs["Мотор"] || p.specs["Двигатель"] || "";
    const load = p.specs["Макс. нагрузка"] || p.specs["Грузоподъёмность"] || "";
    if (weight) badges.push({icon: "&#9878;", label: "Вес", value: weight});
    if (speed) badges.push({icon: "&#9889;", label: "Скорость", value: speed});
    if (range) badges.push({icon: "&#128267;", label: "Запас хода", value: range});
    if (motor) badges.push({icon: "&#9881;", label: "Мотор", value: motor});
    if (load) badges.push({icon: "&#128170;", label: "Нагрузка", value: load});
    badges.forEach(b => {
      quickSpecs.innerHTML += `<div class="quick-spec"><div class="quick-spec-value">${b.value}</div><div class="quick-spec-label">${b.label}</div></div>`;
    });
  }

  // Features
  const featList = document.getElementById("product-features");
  const featSection = document.getElementById("product-features-section");
  if (featList && p.features.length > 0) {
    p.features.forEach(f => {
      featList.innerHTML += `<div class="feature-item"><div class="feature-check">&#10003;</div><span>${f}</span></div>`;
    });
  } else if (featSection) {
    featSection.style.display = "none";
  }

  // Specs
  const specsTable = document.getElementById("product-specs");
  if (specsTable) {
    Object.entries(p.specs).forEach(([key, val]) => {
      specsTable.innerHTML += `<tr><td>${key}</td><td>${val}</td></tr>`;
    });
  }

  // Options
  const optsList = document.getElementById("product-options");
  const optsSection = document.getElementById("product-options-section");
  if (optsList && p.options.length > 0) {
    p.options.forEach(o => {
      optsList.innerHTML += `<span class="option-tag">${o}</span>`;
    });
  } else if (optsSection) {
    optsSection.style.display = "none";
  }

  // Model in form
  const modelInput = document.getElementById("request-model");
  if (modelInput) modelInput.value = p.name;

  // Show sticky bar
  document.querySelector(".product-sticky-bar").classList.add("visible");
}

// ===== CAROUSEL =====
function initCarousel(images, altText) {
  const track = document.getElementById("carousel-track");
  const dotsWrap = document.getElementById("carousel-dots");
  const thumbsWrap = document.getElementById("carousel-thumbs");
  if (!track) return;

  const validImages = images.filter(Boolean);
  if (validImages.length === 0) return;

  let current = 0;

  // Build slides
  validImages.forEach((src, i) => {
    const slide = document.createElement("div");
    slide.className = "carousel-slide";
    const img = document.createElement("img");
    img.src = src;
    img.alt = altText + " фото " + (i + 1);
    img.onerror = function() { this.parentElement.style.display = "none"; };
    slide.appendChild(img);
    track.appendChild(slide);
  });

  // Dots
  if (dotsWrap) {
    validImages.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "carousel-dot" + (i === 0 ? " active" : "");
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  }

  // Thumbs
  if (thumbsWrap) {
    validImages.forEach((src, i) => {
      const thumb = document.createElement("div");
      thumb.className = "carousel-thumb" + (i === 0 ? " active" : "");
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.onerror = function() { this.parentElement.style.display = "none"; };
      thumb.appendChild(img);
      thumb.addEventListener("click", () => goTo(i));
      thumbsWrap.appendChild(thumb);
    });
  }

  // Counter
  const counterEl = document.getElementById("carousel-counter");
  if (counterEl) counterEl.textContent = `1 / ${validImages.length}`;

  function goTo(index) {
    current = Math.max(0, Math.min(index, validImages.length - 1));
    track.style.transform = `translateX(-${current * 100}%)`;
    // Update counter
    if (counterEl) counterEl.textContent = `${current + 1} / ${validImages.length}`;
    // Update dots
    if (dotsWrap) {
      dotsWrap.querySelectorAll(".carousel-dot").forEach((d, i) => d.classList.toggle("active", i === current));
    }
    // Update thumbs
    if (thumbsWrap) {
      thumbsWrap.querySelectorAll(".carousel-thumb").forEach((t, i) => t.classList.toggle("active", i === current));
      const activeThumb = thumbsWrap.children[current];
      if (activeThumb) activeThumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }

  // Nav buttons
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  if (prevBtn) prevBtn.addEventListener("click", () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => goTo(current + 1));

  // Touch swipe
  let startX = 0, startY = 0, isDragging = false, diffX = 0;

  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
    track.style.transition = "none";
  }, { passive: true });

  track.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    diffX = e.touches[0].clientX - startX;
    const diffY = e.touches[0].clientY - startY;
    if (Math.abs(diffY) > Math.abs(diffX)) { isDragging = false; return; }
    const offset = -current * track.offsetWidth + diffX;
    track.style.transform = `translateX(${offset}px)`;
  }, { passive: true });

  track.addEventListener("touchend", () => {
    if (!isDragging) { track.style.transition = ""; goTo(current); return; }
    isDragging = false;
    track.style.transition = "";
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) goTo(current - 1);
      else goTo(current + 1);
    } else {
      goTo(current);
    }
    diffX = 0;
  });
}

// ===== HELPERS =====
function productCard(p) {
  const weight = p.specs["Вес с АКБ"] || p.specs["Вес без АКБ"] || p.specs["Вес"] || "";
  const speed = p.specs["Макс. скорость"] || "";
  const range = p.specs["Запас хода"] || "";
  const motor = p.specs["Мотор"] || p.specs["Двигатель"] || "";

  let tagsHtml = "";
  if (motor) tagsHtml += `<span class="card-tag">${motor}</span>`;
  if (speed) tagsHtml += `<span class="card-tag">${speed}</span>`;
  if (range) tagsHtml += `<span class="card-tag">${range}</span>`;
  if (weight) tagsHtml += `<span class="card-tag">${weight}</span>`;

  return `
    <a href="product.html?id=${p.id}" class="product-card">
      <div class="product-card-img-wrap">
        <img src="${p.images[0]}" alt="${p.name}" class="product-card-img" loading="lazy" onerror="this.src='img/hero-banner.jpg'">
      </div>
      <div class="product-card-body">
        <div class="product-card-price">${formatPrice(p.price)}</div>
        <h3 class="product-card-name">${p.name}</h3>
        <p class="product-card-desc">${p.shortDesc}</p>
        <div class="product-card-tags">${tagsHtml}</div>
      </div>
    </a>`;
}

function pluralize(n, one, few, many) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

// ===== REQUEST MODAL =====
function openRequestModal(modelName) {
  const overlay = document.getElementById("request-modal");
  if (overlay) {
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
    const input = overlay.querySelector("[name='model']");
    if (input && modelName) input.value = modelName;
  }
}

function closeRequestModal() {
  const overlay = document.getElementById("request-modal");
  if (overlay) {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Close modal on overlay click
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) closeRequestModal();
});
