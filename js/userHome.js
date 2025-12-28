// User storefront (public shop UI for regular users)
const userHome = {
  products: [],
  filteredProducts: [],
  cart: [],
  _gridBound: false,

  render() {
    return `
      <div class="user-store pb-5">
        <!-- Hero / Banner -->
        <section class="bg-light border-bottom mb-4">
          <div class="container-fluid py-4">
            <div class="row align-items-center g-4">
              <div class="col-lg-8">
                <h1 class="display-5 fw-bold mb-2">
                  <i class="fas fa-shopping-bag me-2"></i>
                  Bienvenue dans la boutique démo
                </h1>
                <p class="lead text-muted mb-3">
                  Explorez les produits gérés dans l’interface admin : cette page est une
                  vitrine e-commerce pour la démo.
                </p>
                <button id="storeScrollToProducts" class="btn btn-primary btn-lg" type="button">
                  <i class="fas fa-arrow-down me-2"></i> Voir les produits
                </button>
              </div>

              <div class="col-lg-4 d-flex justify-content-lg-end justify-content-start">
                <button 
  id="storeCartButton"
  class="btn btn-primary btn-lg position-relative"
  type="button"
>

                  <i class="fas fa-shopping-cart me-2"></i>
                  Mon panier
                  <span 
                    id="storeCartCount" 
                    class="badge bg-danger position-absolute top-0 start-100 translate-middle"
                  >0</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Filters + Products -->
        <section class="container-fluid" id="storeProductsSection">
          <!-- Filters -->
          <div class="card shadow-sm mb-4">
            <div class="card-body">
              <div class="row g-3 align-items-center">
                <div class="col-12 col-md-4">
                  <label class="form-label fw-semibold mb-1">Recherche</label>
                  <input 
                    type="text" 
                    id="storeSearch" 
                    class="form-control" 
                    placeholder="Rechercher un produit..."
                  >
                </div>

                <div class="col-12 col-md-4">
                  <label class="form-label fw-semibold mb-1">Catégorie</label>
                  <select id="storeCategoryFilter" class="form-select">
                    <option value="all">Toutes les catégories</option>
                  </select>
                </div>

                <div class="col-12 col-md-3">
                  <label class="form-label fw-semibold mb-1">Trier par</label>
                  <select id="storeSort" class="form-select">
                    <option value="featured">Mis en avant</option>
                    <option value="priceAsc">Prix : croissant</option>
                    <option value="priceDesc">Prix : décroissant</option>
                    <option value="newest">Nouveautés</option>
                  </select>
                </div>

                <div class="col-12 col-md-1 text-md-end">
                  <button 
                    id="storeResetFilters" 
                    class="btn btn-outline-secondary w-100 mt-3 mt-md-0"
                    title="Réinitialiser les filtres"
                    type="button"
                  >
                    <i class="fas fa-rotate-left"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Products grid -->
          <div id="storeProductsGrid" class="row g-4">
            <!-- Cards injected here -->
          </div>

          <!-- Empty state -->
          <div id="storeEmptyState" class="text-center text-muted py-5 d-none">
            <i class="fas fa-box-open fa-3x mb-3"></i>
            <p class="mb-0">Aucun produit ne correspond à votre recherche.</p>
          </div>
        </section>
      </div>
    `;
  },

  init() {
    // 1) Charger produits & panier (mêmes produits que l’admin)
    this.products = storage.getData('products') || [];
    this.filteredProducts = [...this.products];
    this.cart = storage.getData('cart') || [];

    // 2) Préparer filtres + rendu
    this.populateCategoryFilter();
    this.renderProducts();
    this.updateCartCount();

    // 3) Événements
    this.setupEvents();
    this.bindGridEvents();
  },

  setupEvents() {
    const searchInput = document.getElementById('storeSearch');
    const categorySelect = document.getElementById('storeCategoryFilter');
    const sortSelect = document.getElementById('storeSort');
    const resetBtn = document.getElementById('storeResetFilters');
    const scrollBtn = document.getElementById('storeScrollToProducts');
    const cartBtn = document.getElementById('storeCartButton');

    if (searchInput) {
      searchInput.addEventListener('input', () => this.applyFilters());
    }

    if (categorySelect) {
      categorySelect.addEventListener('change', () => this.applyFilters());
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', () => this.applyFilters());
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        categorySelect.value = 'all';
        sortSelect.value = 'featured';
        this.filteredProducts = [...this.products];
        this.renderProducts();
      });
    }

    if (scrollBtn) {
      scrollBtn.addEventListener('click', () => this.scrollToProducts());
    }

    if (cartBtn) {
      cartBtn.addEventListener('click', () => this.showCart());
    }
  },

  bindGridEvents() {
    const grid = document.getElementById('storeProductsGrid');
    if (!grid || this._gridBound) return;

    grid.addEventListener('click', (event) => {
      // Add to cart button
      const addBtn = event.target.closest('[data-add-to-cart]');
      if (addBtn) {
        const id = Number(addBtn.getAttribute('data-add-to-cart'));
        if (!Number.isNaN(id)) this.handleAddToCart(id);
        return;
      }

      // Click on card -> détail produit
      const card = event.target.closest('.store-product-card');
      if (card) {
        const id = Number(card.getAttribute('data-product-id'));
        if (!Number.isNaN(id)) this.showProductDetail(id);
      }
    });

    this._gridBound = true;
  },

  scrollToProducts() {
    const section = document.getElementById('storeProductsSection');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  populateCategoryFilter() {
    const select = document.getElementById('storeCategoryFilter');
    if (!select) return;

    const categories = Array.from(
      new Set(this.products.map(p => p.category).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));

    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      select.appendChild(option);
    });
  },

  applyFilters() {
    const searchValue = (document.getElementById('storeSearch')?.value || '').toLowerCase();
    const categoryValue = document.getElementById('storeCategoryFilter')?.value || 'all';
    const sortValue = document.getElementById('storeSort')?.value || 'featured';

    let result = [...this.products];

    // Recherche
    if (searchValue.trim() !== '') {
      result = result.filter(p => {
        const haystack = (
          (p.name || '') +
          ' ' +
          (p.description || '') +
          ' ' +
          (p.category || '')
        ).toLowerCase();
        return haystack.includes(searchValue);
      });
    }

    // Catégorie
    if (categoryValue !== 'all') {
      result = result.filter(p => p.category === categoryValue);
    }

    // Tri
    result.sort((a, b) => this.sortComparator(a, b, sortValue));

    this.filteredProducts = result;
    this.renderProducts();
  },

  sortComparator(a, b, mode) {
    const priceA = Number(a.price) || 0;
    const priceB = Number(b.price) || 0;
    const dateA = new Date(a.createdAt || '1970-01-01');
    const dateB = new Date(b.createdAt || '1970-01-01');

    switch (mode) {
      case 'priceAsc':
        return priceA - priceB;
      case 'priceDesc':
        return priceB - priceA;
      case 'newest':
        return dateB - dateA;
      case 'featured':
      default:
        if (dateB.getTime() !== dateA.getTime()) {
          return dateB - dateA;
        }
        return priceB - priceA;
    }
  },

  renderProducts() {
    const grid = document.getElementById('storeProductsGrid');
    const emptyState = document.getElementById('storeEmptyState');
    if (!grid) return;

    if (!this.filteredProducts.length) {
      grid.innerHTML = '';
      if (emptyState) emptyState.classList.remove('d-none');
      return;
    }

    if (emptyState) emptyState.classList.add('d-none');

    grid.innerHTML = this.filteredProducts
      .map(p => this.renderProductCard(p))
      .join('');
  },

  renderProductCard(p) {
    const price = this.formatPrice(p.price);
    const stockBadge = this.renderStockBadge(p.stock);
    const image = p.image || 'https://via.placeholder.com/300x200?text=Produit';

    const rawDesc = (p.description || '').toString();
    const shortDesc = rawDesc.substring(0, 90).trim();
    const desc = shortDesc
      ? `${shortDesc}${rawDesc.length > 90 ? '…' : ''}`
      : 'Aucune description.';

    return `
      <div class="col-12 col-sm-6 col-md-4 col-xl-3">
        <div class="card h-100 shadow-sm border-0 store-product-card" data-product-id="${p.id}">
          <div class="position-relative overflow-hidden" style="height: 190px;">
            <img 
              src="${image}" 
              class="card-img-top h-100 w-100" 
              alt="${this.escapeHtml(p.name || 'Produit')}"
              style="object-fit: cover;"
              onerror="this.src='https://via.placeholder.com/300x200?text=Produit';"
            >
            <span class="badge bg-primary position-absolute top-0 start-0 m-2">
              ${this.escapeHtml(p.category || 'Sans catégorie')}
            </span>
            ${stockBadge}
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title mb-1">${this.escapeHtml(p.name || 'Produit')}</h5>
            <p class="card-text text-muted small mb-2">${this.escapeHtml(desc)}</p>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <span class="fw-bold fs-5">${price}</span>
              <button 
                class="btn btn-sm btn-outline-primary"
                type="button"
                data-add-to-cart="${p.id}"
              >
                <i class="fas fa-cart-plus me-1"></i>
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderStockBadge(stock) {
    const s = Number(stock);
    if (Number.isNaN(s)) return '';
    if (s <= 0) {
      return `
        <span class="badge bg-danger position-absolute top-0 end-0 m-2">
          Rupture
        </span>
      `;
    }
    if (s <= 5) {
      return `
        <span class="badge bg-warning text-dark position-absolute top-0 end-0 m-2">
          Dernières pièces
        </span>
      `;
    }
    return `
      <span class="badge bg-success position-absolute top-0 end-0 m-2">
        En stock
      </span>
    `;
  },

  // ---------- PANIER ----------

  handleAddToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const existing = this.cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price) || 0,
        image: product.image || '',
        quantity: 1
      });
    }

    storage.setData('cart', this.cart);
    this.updateCartCount();

    if (window.Swal) {
      Swal.fire({
        icon: 'success',
        title: 'Ajouté au panier',
        text: product.name || 'Produit',
        timer: 1200,
        showConfirmButton: false
      });
    }
  },

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    storage.setData('cart', this.cart);
    this.updateCartCount();
    this.showCart();
  },

  updateCartCount() {
    const badge = document.getElementById('storeCartCount');
    if (!badge) return;
    const totalQty = this.cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    badge.textContent = totalQty.toString();
  },

    showCart() {
    if (!this.cart.length) {
      if (window.Swal) {
        Swal.fire({
          icon: 'info',
          title: 'Panier vide',
          text: 'Ajoutez des produits au panier depuis la boutique.'
        });
      } else {
        alert('Panier vide');
      }
      return;
    }

    const rowsHtml = this.cart
      .map(item => {
        const lineTotal = (item.price || 0) * (item.quantity || 0);
        return `
          <tr>
            <td>${this.escapeHtml(item.name)}</td>
            <td class="text-center">${item.quantity}</td>
            <td class="text-end">${this.formatPrice(item.price)}</td>
            <td class="text-end">${this.formatPrice(lineTotal)}</td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-danger" type="button"
                data-remove-from-cart="${item.id}">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        `;
      })
      .join('');

    const total = this.cart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );

    const html = `
      <div class="table-responsive text-start">
        <table class="table table-sm align-middle">
          <thead>
            <tr>
              <th>Produit</th>
              <th class="text-center">Qté</th>
              <th class="text-end">Prix</th>
              <th class="text-end">Total</th>
              <th class="text-end">Action</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
        <div class="d-flex justify-content-end mt-2">
          <h5>Total : ${this.formatPrice(total)}</h5>
        </div>
        <p class="text-muted small mt-2 mb-0">
          Démo uniquement : aucune commande réelle n’est créée.
        </p>
      </div>
    `;

    if (window.Swal) {
      Swal.fire({
        title: 'Mon panier',
        html,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Fermer',
        width: 720,
        didOpen: () => {
          const container = Swal.getHtmlContainer();
          if (!container) return;
          container.querySelectorAll('[data-remove-from-cart]').forEach(btn => {
            btn.addEventListener('click', () => {
              const id = Number(btn.getAttribute('data-remove-from-cart'));
              if (!Number.isNaN(id)) {
                this.removeFromCart(id);
              }
            });
          });
        }
      });
    } else {
      alert('Total panier : ' + this.formatPrice(total));
    }
  },

  // ---------- POPUP DÉTAIL PRODUIT ----------

  showProductDetail(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const price = this.formatPrice(product.price);
    const stockBadge = this.renderStockBadge(product.stock);
    const image = product.image || 'https://via.placeholder.com/600x300?text=Produit';

    const desc = this.escapeHtml(product.description || 'Aucune description.');

    const html = `
      <div class="text-start">
        <div class="position-relative mb-3">
          <img 
            src="${image}" 
            alt="${this.escapeHtml(product.name || 'Produit')}" 
            class="img-fluid w-100"
            style="max-height:260px; object-fit:cover;"
            onerror="this.src='https://via.placeholder.com/600x300?text=Produit';"
          >
          <div class="position-absolute top-0 start-0 m-2">
            <span class="badge bg-primary me-2">
              ${this.escapeHtml(product.category || 'Sans catégorie')}
            </span>
          </div>
          <div class="position-absolute top-0 end-0 m-2">
            ${stockBadge}
          </div>
        </div>
        <p class="mb-2"><strong>Prix :</strong> ${price}</p>
        <p class="mb-2"><strong>Description :</strong></p>
        <p class="text-muted">${desc}</p>
      </div>
    `;

    if (window.Swal) {
      Swal.fire({
        title: this.escapeHtml(product.name || 'Produit'),
        html,
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-cart-plus me-1"></i> Ajouter au panier',
        cancelButtonText: 'Fermer',
        width: 750
      }).then((result) => {
        if (result.isConfirmed) {
          this.handleAddToCart(productId);
        }
      });
    } else {
      alert(`${product.name}\n\n${product.description || ''}\n\nPrix: ${price}`);
    }
  },

  // ---------- UTILITAIRES ----------

  formatPrice(value) {
    const num = Number(value);
    if (Number.isNaN(num)) return (value ?? '').toString();
    return `${num.toLocaleString('fr-FR')} DH`;
  },

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

// Global (used by app.js)
window.userHome = userHome;