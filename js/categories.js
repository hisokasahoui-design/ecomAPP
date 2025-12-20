// Gestion des catégories
class CategoryManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.sortField = 'name';
        this.sortOrder = 'asc';
        this.searchTerm = '';
    }

    render() {
        return `
            <div class="categories-container">
                <div class="table-header">
                    <h1 data-i18n="categories.title">Gestion des Catégories</h1>
                    <div class="table-controls">
                        <button class="btn btn-success" id="addCategoryBtn">
                            <i class="fas fa-plus"></i> <span data-i18n="categories.addNew">Nouvelle Catégorie</span>
                        </button>
                        <button class="btn btn-primary" id="exportCategoriesBtn">
                            <i class="fas fa-file-csv"></i> <span data-i18n="common.export">Exporter CSV</span>
                        </button>
                    </div>
                </div>

                <!-- Recherche -->
                <div class="filters-section">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="categorySearch" class="form-control" placeholder="Rechercher..." data-i18n-placeholder="common.search">
                    </div>
                </div>

                <!-- Table -->
                <div class="table-container">
                    <div class="table-responsive" id="categoriesTableContainer"></div>
                    <div class="pagination-container" id="categoriesPagination"></div>
                </div>
            </div>

            <!-- Modal -->
            <div id="categoryModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="categoryModalTitle">Nouvelle Catégorie</h3>
                        <button class="btn-close" id="closeCategoryModal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="categoryForm">
                            <input type="hidden" id="categoryId">
                            <div class="form-group">
                                <label data-i18n="categories.name">Nom *</label>
                                <input type="text" id="categoryName" class="form-control" required>
                                <span class="error-message" id="nameError"></span>
                            </div>
                            <div class="form-group">
                                <label data-i18n="categories.description">Description</label>
                                <textarea id="categoryDescription" class="form-control" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="cancelCategoryBtn" data-i18n="common.cancel">Annuler</button>
                        <button class="btn btn-primary" id="saveCategoryBtn" data-i18n="common.save">Enregistrer</button>
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
        document.getElementById('addCategoryBtn')?.addEventListener('click', () => this.openModal());
        document.getElementById('closeCategoryModal')?.addEventListener('click', () => this.closeModal());
        document.getElementById('cancelCategoryBtn')?.addEventListener('click', () => this.closeModal());
        document.getElementById('saveCategoryBtn')?.addEventListener('click', () => this.saveCategory());
        document.getElementById('categorySearch')?.addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.currentPage = 1;
            this.renderTable();
        });
        document.getElementById('exportCategoriesBtn')?.addEventListener('click', () => this.exportCSV());
    }

    getFilteredCategories() {
        let categories = storage.read('categories');
        
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            categories = categories.filter(c => 
                c.name.toLowerCase().includes(term) ||
                c.description?.toLowerCase().includes(term)
            );
        }

        categories.sort((a, b) => {
            let aVal = a[this.sortField];
            let bVal = b[this.sortField];
            
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }
            
            return this.sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
        });

        return categories;
    }

    renderTable() {
        const categories = this.getFilteredCategories();
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const paginatedCategories = categories.slice(startIndex, startIndex + this.itemsPerPage);

        const tableHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th onclick="categoryManager.sort('id')">ID ${this.getSortIcon('id')}</th>
                        <th onclick="categoryManager.sort('name')">Nom ${this.getSortIcon('name')}</th>
                        <th onclick="categoryManager.sort('description')">Description ${this.getSortIcon('description')}</th>
                        <th onclick="categoryManager.sort('productCount')">Produits ${this.getSortIcon('productCount')}</th>
                        <th data-i18n="categories.actions">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${paginatedCategories.map(category => `
                        <tr>
                            <td>${category.id}</td>
                            <td><strong>${category.name}</strong></td>
                            <td>${category.description || 'N/A'}</td>
                            <td><span class="badge badge-info">${category.productCount || 0}</span></td>
                            <td>
                                <button class="btn-action btn-edit" onclick="categoryManager.editCategory(${category.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-action btn-delete" onclick="categoryManager.deleteCategory(${category.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        document.getElementById('categoriesTableContainer').innerHTML = tableHTML;
        this.renderPagination(categories.length);
        i18n.translatePage();
    }

    getSortIcon(field) {
        return this.sortField === field ? (this.sortOrder === 'asc' ? '▲' : '▼') : '';
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
        let html = `<div><span>Affichage ${Math.min((this.currentPage - 1) * this.itemsPerPage + 1, totalItems)} à ${Math.min(this.currentPage * this.itemsPerPage, totalItems)} sur ${totalItems}</span></div><div class="pagination">
            <button onclick="categoryManager.changePage(${this.currentPage - 1})" ${this.currentPage === 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;
        
        for (let i = 1; i <= totalPages; i++) {
            html += `<button onclick="categoryManager.changePage(${i})" class="${i === this.currentPage ? 'active' : ''}">${i}</button>`;
        }
        
        html += `<button onclick="categoryManager.changePage(${this.currentPage + 1})" ${this.currentPage === totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button></div>`;
        document.getElementById('categoriesPagination').innerHTML = html;
    }

    changePage(page) {
        const totalPages = Math.ceil(this.getFilteredCategories().length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderTable();
        }
    }

    openModal(category = null) {
        const modal = document.getElementById('categoryModal');
        const title = document.getElementById('categoryModalTitle');
        
        if (category) {
            title.textContent = 'Modifier la Catégorie';
            document.getElementById('categoryId').value = category.id;
            document.getElementById('categoryName').value = category.name;
            document.getElementById('categoryDescription').value = category.description || '';
        } else {
            title.textContent = i18n.t('categories.addNew');
            document.getElementById('categoryForm').reset();
            document.getElementById('categoryId').value = '';
        }
        
        modal.classList.add('show');
    }

    closeModal() {
        document.getElementById('categoryModal').classList.remove('show');
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    }

    saveCategory() {
        const id = document.getElementById('categoryId').value;
        const data = {
            name: document.getElementById('categoryName').value.trim(),
            description: document.getElementById('categoryDescription').value.trim(),
            productCount: 0
        };

        if (!data.name || data.name.length < 3) {
            document.getElementById('nameError').textContent = 'Le nom doit contenir au moins 3 caractères';
            return;
        }

        if (id) {
            storage.update('categories', parseInt(id), data);
            Swal.fire({ icon: 'success', title: i18n.t('categories.updateSuccess'), timer: 1500, showConfirmButton: false });
        } else {
            storage.create('categories', data);
            Swal.fire({ icon: 'success', title: i18n.t('categories.createSuccess'), timer: 1500, showConfirmButton: false });
        }

        this.closeModal();
        this.renderTable();
    }

    editCategory(id) {
        const category = storage.read('categories', id);
        if (category) this.openModal(category);
    }

    deleteCategory(id) {
        const category = storage.read('categories', id);
        Swal.fire({
            title: i18n.t('categories.confirmDelete'),
            text: category.name,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: i18n.t('common.confirm'),
            cancelButtonText: i18n.t('common.cancel')
        }).then((result) => {
            if (result.isConfirmed) {
                storage.delete('categories', id);
                Swal.fire({ icon: 'success', title: i18n.t('categories.deleteSuccess'), timer: 1500, showConfirmButton: false });
                this.renderTable();
            }
        });
    }

    exportCSV() {
        const categories = this.getFilteredCategories();
        let csv = 'ID,Nom,Description,Nombre de Produits\n';
        categories.forEach(c => {
            csv += `${c.id},"${c.name}","${c.description || ''}",${c.productCount}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `categories_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    }
}

const categoryManager = new CategoryManager();