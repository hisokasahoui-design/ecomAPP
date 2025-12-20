// Gestion des fournisseurs - CRUD complet
class SupplierManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.sortField = 'company';
        this.sortOrder = 'asc';
        this.searchTerm = '';
    }

    render() {
        return `
            <div class="suppliers-container">
                <div class="table-header">
                    <h1 data-i18n="suppliers.title">Gestion des Fournisseurs</h1>
                    <div class="table-controls">
                        <button class="btn btn-success" id="addSupplierBtn">
                            <i class="fas fa-plus"></i> <span data-i18n="suppliers.addNew">Nouveau Fournisseur</span>
                        </button>
                        <button class="btn btn-primary" id="exportSuppliersBtn">
                            <i class="fas fa-file-csv"></i> Exporter CSV
                        </button>
                    </div>
                </div>

                <div class="filters-section">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="supplierSearch" class="form-control" placeholder="Rechercher...">
                    </div>
                </div>

                <div class="table-container">
                    <div class="table-responsive" id="suppliersTableContainer"></div>
                    <div class="pagination-container" id="suppliersPagination"></div>
                </div>
            </div>

            <div id="supplierModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="supplierModalTitle">Nouveau Fournisseur</h3>
                        <button class="btn-close" id="closeSupplierModal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="supplierForm">
                            <input type="hidden" id="supplierId">
                            <div class="form-group">
                                <label data-i18n="suppliers.name">Nom *</label>
                                <input type="text" id="supplierName" class="form-control" required>
                                <span class="error-message" id="nameError"></span>
                            </div>
                            <div class="form-group">
                                <label data-i18n="suppliers.company">Entreprise *</label>
                                <input type="text" id="supplierCompany" class="form-control" required>
                                <span class="error-message" id="companyError"></span>
                            </div>
                            <div class="form-group">
                                <label data-i18n="suppliers.email">Email *</label>
                                <input type="email" id="supplierEmail" class="form-control" required>
                                <span class="error-message" id="emailError"></span>
                            </div>
                            <div class="form-group">
                                <label data-i18n="suppliers.phone">Téléphone *</label>
                                <input type="tel" id="supplierPhone" class="form-control" required>
                                <span class="error-message" id="phoneError"></span>
                            </div>
                            <div class="form-group">
                                <label data-i18n="suppliers.address">Adresse</label>
                                <input type="text" id="supplierAddress" class="form-control">
                            </div>
                            <div class="form-group">
                                <label>Spécialité</label>
                                <select id="supplierSpecialty" class="form-select">
                                    <option value="Électronique">Électronique</option>
                                    <option value="Mobilier">Mobilier</option>
                                    <option value="Vêtements">Vêtements</option>
                                    <option value="Accessoires">Accessoires</option>
                                    <option value="Autre">Autre</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="cancelSupplierBtn">Annuler</button>
                        <button class="btn btn-primary" id="saveSupplierBtn">Enregistrer</button>
                    </div>
                </div>
            </div>

            <div id="supplierDetailsModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Détails du Fournisseur</h3>
                        <button class="btn-close" id="closeSupplierDetailsModal">&times;</button>
                    </div>
                    <div class="modal-body" id="supplierDetailsContent"></div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" id="exportSupplierPDF"><i class="fas fa-file-pdf"></i> Exporter PDF</button>
                        <button class="btn btn-secondary" id="closeSupplierDetailsBtn">Fermer</button>
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
        document.getElementById('addSupplierBtn')?.addEventListener('click', () => this.openModal());
        document.getElementById('closeSupplierModal')?.addEventListener('click', () => this.closeModal());
        document.getElementById('cancelSupplierBtn')?.addEventListener('click', () => this.closeModal());
        document.getElementById('saveSupplierBtn')?.addEventListener('click', () => this.saveSupplier());
        document.getElementById('closeSupplierDetailsModal')?.addEventListener('click', () => this.closeDetailsModal());
        document.getElementById('closeSupplierDetailsBtn')?.addEventListener('click', () => this.closeDetailsModal());
        
        document.getElementById('supplierSearch')?.addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.currentPage = 1;
            this.renderTable();
        });

        document.getElementById('exportSuppliersBtn')?.addEventListener('click', () => this.exportCSV());
    }

    getFilteredSuppliers() {
        let suppliers = storage.read('suppliers');

        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            suppliers = suppliers.filter(s => 
                s.name.toLowerCase().includes(term) ||
                s.company.toLowerCase().includes(term) ||
                s.email.toLowerCase().includes(term)
            );
        }

        suppliers.sort((a, b) => {
            let aVal = a[this.sortField];
            let bVal = b[this.sortField];
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }
            return this.sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
        });

        return suppliers;
    }

    renderTable() {
        const suppliers = this.getFilteredSuppliers();
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const paginatedSuppliers = suppliers.slice(startIndex, startIndex + this.itemsPerPage);

        const tableHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th onclick="supplierManager.sort('id')">ID ${this.getSortIcon('id')}</th>
                        <th onclick="supplierManager.sort('name')">Nom ${this.getSortIcon('name')}</th>
                        <th onclick="supplierManager.sort('company')">Entreprise ${this.getSortIcon('company')}</th>
                        <th onclick="supplierManager.sort('email')">Email ${this.getSortIcon('email')}</th>
                        <th onclick="supplierManager.sort('phone')">Téléphone ${this.getSortIcon('phone')}</th>
                        <th onclick="supplierManager.sort('specialty')">Spécialité ${this.getSortIcon('specialty')}</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${paginatedSuppliers.map(supplier => `
                        <tr>
                            <td>${supplier.id}</td>
                            <td><strong>${supplier.name}</strong></td>
                            <td>${supplier.company}</td>
                            <td>${supplier.email}</td>
                            <td>${supplier.phone}</td>
                            <td><span class="badge badge-info">${supplier.specialty}</span></td>
                            <td>
                                <button class="btn-action btn-view" onclick="supplierManager.viewSupplier(${supplier.id})">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn-action btn-edit" onclick="supplierManager.editSupplier(${supplier.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-action btn-delete" onclick="supplierManager.deleteSupplier(${supplier.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        document.getElementById('suppliersTableContainer').innerHTML = tableHTML;
        this.renderPagination(suppliers.length);
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
            <button onclick="supplierManager.changePage(${this.currentPage - 1})" ${this.currentPage === 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;
        
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                html += `<button onclick="supplierManager.changePage(${i})" class="${i === this.currentPage ? 'active' : ''}">${i}</button>`;
            }
        }
        
        html += `<button onclick="supplierManager.changePage(${this.currentPage + 1})" ${this.currentPage === totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button></div>`;
        document.getElementById('suppliersPagination').innerHTML = html;
    }

    changePage(page) {
        const totalPages = Math.ceil(this.getFilteredSuppliers().length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderTable();
        }
    }

    openModal(supplier = null) {
        const modal = document.getElementById('supplierModal');
        const title = document.getElementById('supplierModalTitle');
        
        if (supplier) {
            title.textContent = 'Modifier le Fournisseur';
            document.getElementById('supplierId').value = supplier.id;
            document.getElementById('supplierName').value = supplier.name;
            document.getElementById('supplierCompany').value = supplier.company;
            document.getElementById('supplierEmail').value = supplier.email;
            document.getElementById('supplierPhone').value = supplier.phone;
            document.getElementById('supplierAddress').value = supplier.address || '';
            document.getElementById('supplierSpecialty').value = supplier.specialty;
        } else {
            title.textContent = i18n.t('suppliers.addNew');
            document.getElementById('supplierForm').reset();
            document.getElementById('supplierId').value = '';
        }
        
        modal.classList.add('show');
    }

    closeModal() {
        document.getElementById('supplierModal').classList.remove('show');
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    }

    closeDetailsModal() {
        document.getElementById('supplierDetailsModal').classList.remove('show');
    }

    validateSupplier(data) {
        let isValid = true;

        if (!data.name || data.name.trim().length < 3) {
            document.getElementById('nameError').textContent = 'Le nom doit contenir au moins 3 caractères';
            isValid = false;
        }

        if (!data.company || data.company.trim().length < 3) {
            document.getElementById('companyError').textContent = 'Le nom de l\'entreprise est requis';
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            document.getElementById('emailError').textContent = 'Email invalide';
            isValid = false;
        }

        if (!data.phone || data.phone.length < 10) {
            document.getElementById('phoneError').textContent = 'Numéro de téléphone invalide';
            isValid = false;
        }

        return isValid;
    }

    saveSupplier() {
        const id = document.getElementById('supplierId').value;
        const data = {
            name: document.getElementById('supplierName').value.trim(),
            company: document.getElementById('supplierCompany').value.trim(),
            email: document.getElementById('supplierEmail').value.trim(),
            phone: document.getElementById('supplierPhone').value.trim(),
            address: document.getElementById('supplierAddress').value.trim(),
            specialty: document.getElementById('supplierSpecialty').value
        };

        if (!this.validateSupplier(data)) return;

        if (id) {
            storage.update('suppliers', parseInt(id), data);
            Swal.fire({ icon: 'success', title: i18n.t('suppliers.updateSuccess'), timer: 1500, showConfirmButton: false });
        } else {
            storage.create('suppliers', data);
            Swal.fire({ icon: 'success', title: i18n.t('suppliers.createSuccess'), timer: 1500, showConfirmButton: false });
        }

        this.closeModal();
        this.renderTable();
    }

    editSupplier(id) {
        const supplier = storage.read('suppliers', id);
        if (supplier) this.openModal(supplier);
    }

    viewSupplier(id) {
        const supplier = storage.read('suppliers', id);
        if (!supplier) return;

        const detailsHTML = `
            <table class="table">
                <tr><th>ID:</th><td>${supplier.id}</td></tr>
                <tr><th>Nom:</th><td><strong>${supplier.name}</strong></td></tr>
                <tr><th>Entreprise:</th><td>${supplier.company}</td></tr>
                <tr><th>Email:</th><td>${supplier.email}</td></tr>
                <tr><th>Téléphone:</th><td>${supplier.phone}</td></tr>
                <tr><th>Adresse:</th><td>${supplier.address || 'N/A'}</td></tr>
                <tr><th>Spécialité:</th><td><span class="badge badge-info">${supplier.specialty}</span></td></tr>
            </table>
        `;

        document.getElementById('supplierDetailsContent').innerHTML = detailsHTML;
        document.getElementById('supplierDetailsModal').classList.add('show');

        document.getElementById('exportSupplierPDF').onclick = () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text('Fiche Fournisseur', 20, 20);
            doc.setFontSize(12);
            doc.text(`Nom: ${supplier.name}`, 20, 40);
            doc.text(`Entreprise: ${supplier.company}`, 20, 50);
            doc.text(`Email: ${supplier.email}`, 20, 60);
            doc.text(`Téléphone: ${supplier.phone}`, 20, 70);
            doc.text(`Spécialité: ${supplier.specialty}`, 20, 80);
            doc.save(`supplier_${supplier.id}.pdf`);
        };
    }

    deleteSupplier(id) {
        const supplier = storage.read('suppliers', id);
        Swal.fire({
            title: i18n.t('suppliers.confirmDelete'),
            text: supplier.name,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: i18n.t('common.confirm'),
            cancelButtonText: i18n.t('common.cancel')
        }).then((result) => {
            if (result.isConfirmed) {
                storage.delete('suppliers', id);
                Swal.fire({ icon: 'success', title: i18n.t('suppliers.deleteSuccess'), timer: 1500, showConfirmButton: false });
                this.renderTable();
            }
        });
    }

    exportCSV() {
        const suppliers = this.getFilteredSuppliers();
        let csv = 'ID,Nom,Entreprise,Email,Téléphone,Adresse,Spécialité\n';
        suppliers.forEach(s => {
            csv += `${s.id},"${s.name}","${s.company}","${s.email}","${s.phone}","${s.address || ''}","${s.specialty}"\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `suppliers_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    }
}

const supplierManager = new SupplierManager();