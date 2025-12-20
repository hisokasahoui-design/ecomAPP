// Gestion des produits avec CRUD complet
class ProductManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.sortField = 'name';
        this.sortOrder = 'asc';
        this.searchTerm = '';
        this.filters = {
            category: 'all',
            minPrice: '',
            maxPrice: '',
            inStock: 'all'
        };
    }

    render() {
        return `
            <div class="products-container">
                <div class="table-header">
                    <h1 data-i18n="products.title">Gestion des Produits</h1>
                    <div class="table-controls">
                        <button class="btn btn-success" id="addProductBtn">
                            <i class="fas fa-plus"></i> <span data-i18n="products.addNew">Nouveau Produit</span>
                        </button>
                        <button class="btn btn-primary" id="exportProductsBtn">
                            <i class="fas fa-file-csv"></i> <span data-i18n="products.export">Exporter CSV</span>
                        </button>
                    </div>
                </div>

                <!-- Filtres -->
                <div class="filters-section">
                    <div class="filters-grid">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" id="productSearch" class="form-control" placeholder="Rechercher..." data-i18n-placeholder="products.search">
                        </div>
                        <div class="form-group">
                            <select id="categoryFilter" class="form-select">
                                <option value="all">Toutes les catégories</option>
                                <option value="Électronique">Électronique</option>
                                <option value="Mobilier">Mobilier</option>
                                <option value="Vêtements">Vêtements</option>
                                <option value="Accessoires">Accessoires</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <input type="number" id="minPriceFilter" class="form-control" placeholder="Prix min">
                        </div>
                        <div class="form-group">
                            <input type="number" id="maxPriceFilter" class="form-control" placeholder="Prix max">
                        </div>
                        <div class="form-group">
                            <select id="stockFilter" class="form-select">
                                <option value="all">Tous les stocks</option>
                                <option value="inStock">En stock</option>
                                <option value="lowStock">Stock faible (&lt;20)</option>
                                <option value="outOfStock">Rupture de stock</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Table -->
                <div class="table-container">
                    <div class="table-responsive" id="productsTableContainer">
                        <!-- Table sera injectée ici -->
                    </div>
                    <div class="pagination-container" id="productsPagination">
                        <!-- Pagination sera injectée ici -->
                    </div>
                </div>
            </div>

            <!-- Modal Créer/Modifier -->
            <div id="productModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="productModalTitle">Nouveau Produit</h3>
                        <button class="btn-close" id="closeProductModal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="productForm">
                            <input type="hidden" id="productId">
                            <div class="form-group">
                                <label data-i18n="products.name">Nom *</label>
                                <input type="text" id="productName" class="form-control" required>
                                <span class="error-message" id="nameError"></span>
                            </div>
                            <div class="form-group">
                                <label data-i18n="products.category">Catégorie *</label>
                                <select id="productCategory" class="form-select" required>
                                    <option value="">Sélectionner une catégorie</option>
                                    <option value="Électronique">Électronique</option>
                                    <option value="Mobilier">Mobilier</option>
                                    <option value="Vêtements">Vêtements</option>
                                    <option value="Accessoires">Accessoires</option>
                                </select>
                                <span class="error-message" id="categoryError"></span>
                            </div>
                            <div class="form-group">
                                <label data-i18n="products.price">Prix (DH) *</label>
                                <input type="number" id="productPrice" class="form-control" min="0" step="0.01" required>
                                <span class="error-message" id="priceError"></span>
                            </div>
                            <div class="form-group">
                                <label data-i18n="products.stock">Stock *</label>
                                <input type="number" id="productStock" class="form-control" min="0" required>
                                <span class="error-message" id="stockError"></span>
                            </div>
                            <div class="form-group">
                                <label data-i18n="products.description">Description</label>
                                <textarea id="productDescription" class="form-control" rows="3"></textarea>
                            </div>
                            <div class="form-group">
                                <label data-i18n="products.image">URL Image</label>
                                <input type="url" id="productImage" class="form-control">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="cancelProductBtn" data-i18n="common.cancel">Annuler</button>
                        <button class="btn btn-primary" id="saveProductBtn" data-i18n="common.save">Enregistrer</button>
                    </div>
                </div>
            </div>

            <!-- Modal Détails -->
            <div id="productDetailsModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 data-i18n="products.details">Détails du Produit</h3>
                        <button class="btn-close" id="closeDetailsModal">&times;</button>
                    </div>
                    <div class="modal-body" id="productDetailsContent">
                        <!-- Contenu sera injecté ici -->
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" id="exportProductPDF">
                            <i class="fas fa-file-pdf"></i> <span data-i18n="products.exportPDF">Exporter PDF</span>
                        </button>
                        <button class="btn btn-secondary" id="closeDetailsBtn" data-i18n="common.close">Fermer</button>
                    </div>
                </div>
            </div>
        `;
    }

    init() {
        this.setupEventListeners();
        this.renderTable();
    }

    setupEventListeners() {
        // Bouton ajouter
        document.getElementById('addProductBtn')?.addEventListener('click', () => {
            this.openModal();
        });

        // Fermer modals
        document.getElementById('closeProductModal')?.addEventListener('click', () => {
            this.closeModal();
        });
        
        document.getElementById('cancelProductBtn')?.addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('closeDetailsModal')?.addEventListener('click', () => {
            this.closeDetailsModal();
        });

        document.getElementById('closeDetailsBtn')?.addEventListener('click', () => {
            this.closeDetailsModal();
        });

        // Sauvegarder
        document.getElementById('saveProductBtn')?.addEventListener('click', () => {
            this.saveProduct();
        });

        // Recherche
        document.getElementById('productSearch')?.addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.currentPage = 1;
            this.renderTable();
        });

        // Filtres
        document.getElementById('categoryFilter')?.addEventListener('change', (e) => {
            this.filters.category = e.target.value;
            this.currentPage = 1;
            this.renderTable();
        });

        document.getElementById('minPriceFilter')?.addEventListener('input', (e) => {
            this.filters.minPrice = e.target.value;
            this.currentPage = 1;
            this.renderTable();
        });

        document.getElementById('maxPriceFilter')?.addEventListener('input', (e) => {
            this.filters.maxPrice = e.target.value;
            this.currentPage = 1;
            this.renderTable();
        });

        document.getElementById('stockFilter')?.addEventListener('change', (e) => {
            this.filters.inStock = e.target.value;
            this.currentPage = 1;
            this.renderTable();
        });

        // Export CSV
        document.getElementById('exportProductsBtn')?.addEventListener('click', () => {
            this.exportCSV();
        });
    }

    getFilteredProducts() {
        let products = storage.read('products');

        // Recherche
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            products = products.filter(p => 
                p.name.toLowerCase().includes(term) ||
                p.category.toLowerCase().includes(term) ||
                p.description?.toLowerCase().includes(term)
            );
        }

        // Filtre catégorie
        if (this.filters.category !== 'all') {
            products = products.filter(p => p.category === this.filters.category);
        }

        // Filtre prix
        if (this.filters.minPrice) {
            products = products.filter(p => p.price >= parseFloat(this.filters.minPrice));
        }
        if (this.filters.maxPrice) {
            products = products.filter(p => p.price <= parseFloat(this.filters.maxPrice));
        }

        // Filtre stock
        if (this.filters.inStock === 'inStock') {
            products = products.filter(p => p.stock > 0);
        } else if (this.filters.inStock === 'lowStock') {
            products = products.filter(p => p.stock > 0 && p.stock < 20);
        } else if (this.filters.inStock === 'outOfStock') {
            products = products.filter(p => p.stock === 0);
        }

        // Tri
        products.sort((a, b) => {
            let aVal = a[this.sortField];
            let bVal = b[this.sortField];
            
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }
            
            if (this.sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        return products;
    }

    renderTable() {
        const products = this.getFilteredProducts();
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedProducts = products.slice(startIndex, endIndex);

        const tableHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th onclick="productManager.sort('id')">ID ${this.getSortIcon('id')}</th>
                        <th onclick="productManager.sort('name')">Nom ${this.getSortIcon('name')}</th>
                        <th onclick="productManager.sort('category')">Catégorie ${this.getSortIcon('category')}</th>
                        <th onclick="productManager.sort('price')">Prix ${this.getSortIcon('price')}</th>
                        <th onclick="productManager.sort('stock')">Stock ${this.getSortIcon('stock')}</th>
                        <th data-i18n="products.actions">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${paginatedProducts.map(product => `
                        <tr>
                            <td>${product.id}</td>
                            <td>${product.name}</td>
                            <td><span class="badge badge-info">${product.category}</span></td>
                            <td>${product.price.toLocaleString()} DH</td>
                            <td>
                                <span class="badge ${product.stock > 20 ? 'badge-success' : product.stock > 0 ? 'badge-warning' : 'badge-danger'}">
                                    ${product.stock}
                                </span>
                            </td>
                            <td>
                                <button class="btn-action btn-view" onclick="productManager.viewProduct(${product.id})">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn-action btn-edit" onclick="productManager.editProduct(${product.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-action btn-delete" onclick="productManager.deleteProduct(${product.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        document.getElementById('productsTableContainer').innerHTML = tableHTML;
        this.renderPagination(products.length);
        i18n.translatePage();
    }

    getSortIcon(field) {
        if (this.sortField === field) {
            return this.sortOrder === 'asc' ? '▲' : '▼';
        }
        return '';
    }

    sort(field) {
        if (this.sortField === field) {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortOrder = 'asc';
        }
        this.renderTable();
    }

    renderPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        
        let paginationHTML = `
            <div>
                <select id="itemsPerPage" class="form-select" style="width: auto;">
                    <option value="10" ${this.itemsPerPage === 10 ? 'selected' : ''}>10</option>
                    <option value="25" ${this.itemsPerPage === 25 ? 'selected' : ''}>25</option>
                    <option value="50" ${this.itemsPerPage === 50 ? 'selected' : ''}>50</option>
                </select>
                <span>Affichage ${(this.currentPage - 1) * this.itemsPerPage + 1} à ${Math.min(this.currentPage * this.itemsPerPage, totalItems)} sur ${totalItems}</span>
            </div>
            <div class="pagination">
                <button onclick="productManager.changePage(${this.currentPage - 1})" ${this.currentPage === 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i>
                </button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                paginationHTML += `
                    <button onclick="productManager.changePage(${i})" class="${i === this.currentPage ? 'active' : ''}">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += `<span>...</span>`;
            }
        }

        paginationHTML += `
                <button onclick="productManager.changePage(${this.currentPage + 1})" ${this.currentPage === totalPages ? 'disabled' : ''}>
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;

        document.getElementById('productsPagination').innerHTML = paginationHTML;
        
        document.getElementById('itemsPerPage')?.addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.renderTable();
        });
    }

    changePage(page) {
        const totalItems = this.getFilteredProducts().length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderTable();
        }
    }

    openModal(product = null) {
        const modal = document.getElementById('productModal');
        const title = document.getElementById('productModalTitle');
        
        if (product) {
            title.textContent = 'Modifier le Produit';
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('productImage').value = product.image || '';
        } else {
            title.textContent = i18n.t('products.addNew');
            document.getElementById('productForm').reset();
            document.getElementById('productId').value = '';
        }
        
        modal.classList.add('show');
    }

    closeModal() {
        document.getElementById('productModal').classList.remove('show');
        this.clearErrors();
    }

    closeDetailsModal() {
        document.getElementById('productDetailsModal').classList.remove('show');
    }

    clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    }

    validateProduct(data) {
        this.clearErrors();
        let isValid = true;

        if (!data.name || data.name.trim().length < 3) {
            document.getElementById('nameError').textContent = 'Le nom doit contenir au moins 3 caractères';
            isValid = false;
        }

        if (!data.category) {
            document.getElementById('categoryError').textContent = 'Sélectionnez une catégorie';
            isValid = false;
        }

        if (!data.price || data.price <= 0) {
            document.getElementById('priceError').textContent = 'Le prix doit être supérieur à 0';
            isValid = false;
        }

        if (data.stock < 0) {
            document.getElementById('stockError').textContent = 'Le stock ne peut pas être négatif';
            isValid = false;
        }

        return isValid;
    }

    saveProduct() {
        const id = document.getElementById('productId').value;
        const productData = {
            name: document.getElementById('productName').value.trim(),
            category: document.getElementById('productCategory').value,
            price: parseFloat(document.getElementById('productPrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            description: document.getElementById('productDescription').value.trim(),
            image: document.getElementById('productImage').value.trim() || 'https://via.placeholder.com/300x200?text=Product'
        };

        if (!this.validateProduct(productData)) {
            return;
        }

        if (id) {
            storage.update('products', parseInt(id), productData);
            Swal.fire({
                icon: 'success',
                title: i18n.t('products.updateSuccess'),
                timer: 1500,
                showConfirmButton: false
            });
        } else {
            storage.create('products', productData);
            Swal.fire({
                icon: 'success',
                title: i18n.t('products.createSuccess'),
                timer: 1500,
                showConfirmButton: false
            });
        }

        this.closeModal();
        this.renderTable();
    }

    editProduct(id) {
        const product = storage.read('products', id);
        if (product) {
            this.openModal(product);
        }
    }

    viewProduct(id) {
        const product = storage.read('products', id);
        if (!product) return;

        const detailsHTML = `
            <div class="product-details">
                <div class="text-center mb-4">
                    <img src="${product.image}" alt="${product.name}" style="max-width: 300px; border-radius: 10px;">
                </div>
                <table class="table">
                    <tr><th>ID:</th><td>${product.id}</td></tr>
                    <tr><th>Nom:</th><td>${product.name}</td></tr>
                    <tr><th>Catégorie:</th><td><span class="badge badge-info">${product.category}</span></td></tr>
                    <tr><th>Prix:</th><td>${product.price.toLocaleString()} DH</td></tr>
                    <tr><th>Stock:</th><td><span class="badge ${product.stock > 20 ? 'badge-success' : product.stock > 0 ? 'badge-warning' : 'badge-danger'}">${product.stock}</span></td></tr>
                    <tr><th>Description:</th><td>${product.description || 'N/A'}</td></tr>
                    <tr><th>Date de création:</th><td>${product.createdAt}</td></tr>
                </table>
            </div>
        `;

        document.getElementById('productDetailsContent').innerHTML = detailsHTML;
        document.getElementById('productDetailsModal').classList.add('show');

        document.getElementById('exportProductPDF').onclick = () => {
            this.exportProductPDF(product);
        };
    }

    deleteProduct(id) {
        const product = storage.read('products', id);
        if (!product) return;

        Swal.fire({
            title: i18n.t('products.confirmDelete'),
            text: `${product.name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: i18n.t('common.confirm'),
            cancelButtonText: i18n.t('common.cancel')
        }).then((result) => {
            if (result.isConfirmed) {
                storage.delete('products', id);
                Swal.fire({
                    icon: 'success',
                    title: i18n.t('products.deleteSuccess'),
                    timer: 1500,
                    showConfirmButton: false
                });
                this.renderTable();
            }
        });
    }

    exportCSV() {
        const products = this.getFilteredProducts();
        let csv = 'ID,Nom,Catégorie,Prix,Stock,Description\n';
        
        products.forEach(product => {
            csv += `${product.id},"${product.name}","${product.category}",${product.price},${product.stock},"${product.description || ''}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    }

    exportProductPDF(product) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text('Fiche Produit', 20, 20);
        
        doc.setFontSize(12);
        doc.text(`ID: ${product.id}`, 20, 40);
        doc.text(`Nom: ${product.name}`, 20, 50);
        doc.text(`Catégorie: ${product.category}`, 20, 60);
        doc.text(`Prix: ${product.price.toLocaleString()} DH`, 20, 70);
        doc.text(`Stock: ${product.stock}`, 20, 80);
        doc.text(`Description: ${product.description || 'N/A'}`, 20, 90);
        
        doc.save(`product_${product.id}.pdf`);
    }
}

const productManager = new ProductManager();