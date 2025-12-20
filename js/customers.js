// Gestion des clients - CRUD complet
class CustomerManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.sortField = 'name';
        this.sortOrder = 'asc';
        this.searchTerm = '';
        this.filters = { city: 'all' };
    }

    render() {
        return `
            <div class="customers-container">
                <div class="table-header">
                    <h1 data-i18n="customers.title">Gestion des Clients</h1>
                    <div class="table-controls">
                        <button class="btn btn-success" id="addCustomerBtn">
                            <i class="fas fa-plus"></i> <span data-i18n="customers.addNew">Nouveau Client</span>
                        </button>
                        <button class="btn btn-primary" id="exportCustomersBtn">
                            <i class="fas fa-file-csv"></i> Exporter CSV
                        </button>
                    </div>
                </div>

                <div class="filters-section">
                    <div class="filters-grid">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" id="customerSearch" class="form-control" placeholder="Rechercher...">
                        </div>
                        <div class="form-group">
                            <select id="cityFilter" class="form-select">
                                <option value="all">Toutes les villes</option>
                                <option value="Casablanca">Casablanca</option>
                                <option value="Rabat">Rabat</option>
                                <option value="Marrakech">Marrakech</option>
                                <option value="Fès">Fès</option>
                                <option value="Tanger">Tanger</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="table-container">
                    <div class="table-responsive" id="customersTableContainer"></div>
                    <div class="pagination-container" id="customersPagination"></div>
                </div>
            </div>

            <div id="customerModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="customerModalTitle">Nouveau Client</h3>
                        <button class="btn-close" id="closeCustomerModal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="customerForm">
                            <input type="hidden" id="customerId">
                            <div class="form-group">
                                <label data-i18n="customers.name">Nom *</label>
                                <input type="text" id="customerName" class="form-control" required>
                                <span class="error-message" id="nameError"></span>
                            </div>
                            <div class="form-group">
                                <label data-i18n="customers.email">Email *</label>
                                <input type="email" id="customerEmail" class="form-control" required>
                                <span class="error-message" id="emailError"></span>
                            </div>
                            <div class="form-group">
                                <label data-i18n="customers.phone">Téléphone *</label>
                                <input type="tel" id="customerPhone" class="form-control" required>
                                <span class="error-message" id="phoneError"></span>
                            </div>
                            <div class="form-group">
                                <label data-i18n="customers.address">Adresse</label>
                                <input type="text" id="customerAddress" class="form-control">
                            </div>
                            <div class="form-group">
                                <label data-i18n="customers.city">Ville</label>
                                <select id="customerCity" class="form-select">
                                    <option value="Casablanca">Casablanca</option>
                                    <option value="Rabat">Rabat</option>
                                    <option value="Marrakech">Marrakech</option>
                                    <option value="Fès">Fès</option>
                                    <option value="Tanger">Tanger</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="cancelCustomerBtn">Annuler</button>
                        <button class="btn btn-primary" id="saveCustomerBtn">Enregistrer</button>
                    </div>
                </div>
            </div>

            <div id="customerDetailsModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Détails du Client</h3>
                        <button class="btn-close" id="closeCustomerDetailsModal">&times;</button>
                    </div>
                    <div class="modal-body" id="customerDetailsContent"></div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" id="exportCustomerPDF"><i class="fas fa-file-pdf"></i> Exporter PDF</button>
                        <button class="btn btn-secondary" id="closeCustomerDetailsBtn">Fermer</button>
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
        document.getElementById('addCustomerBtn')?.addEventListener('click', () => this.openModal());
        document.getElementById('closeCustomerModal')?.addEventListener('click', () => this.closeModal());
        document.getElementById('cancelCustomerBtn')?.addEventListener('click', () => this.closeModal());
        document.getElementById('saveCustomerBtn')?.addEventListener('click', () => this.saveCustomer());
        document.getElementById('closeCustomerDetailsModal')?.addEventListener('click', () => this.closeDetailsModal());
        document.getElementById('closeCustomerDetailsBtn')?.addEventListener('click', () => this.closeDetailsModal());
        
        document.getElementById('customerSearch')?.addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.currentPage = 1;
            this.renderTable();
        });

        document.getElementById('cityFilter')?.addEventListener('change', (e) => {
            this.filters.city = e.target.value;
            this.currentPage = 1;
            this.renderTable();
        });

        document.getElementById('exportCustomersBtn')?.addEventListener('click', () => this.exportCSV());
    }

    getFilteredCustomers() {
        let customers = storage.read('customers');

        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            customers = customers.filter(c => 
                c.name.toLowerCase().includes(term) ||
                c.email.toLowerCase().includes(term) ||
                c.phone.includes(term)
            );
        }

        if (this.filters.city !== 'all') {
            customers = customers.filter(c => c.city === this.filters.city);
        }

        customers.sort((a, b) => {
            let aVal = a[this.sortField];
            let bVal = b[this.sortField];
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }
            return this.sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
        });

        return customers;
    }

    renderTable() {
        const customers = this.getFilteredCustomers();
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const paginatedCustomers = customers.slice(startIndex, startIndex + this.itemsPerPage);

        const tableHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th onclick="customerManager.sort('id')">ID ${this.getSortIcon('id')}</th>
                        <th onclick="customerManager.sort('name')">Nom ${this.getSortIcon('name')}</th>
                        <th onclick="customerManager.sort('email')">Email ${this.getSortIcon('email')}</th>
                        <th onclick="customerManager.sort('phone')">Téléphone ${this.getSortIcon('phone')}</th>
                        <th onclick="customerManager.sort('city')">Ville ${this.getSortIcon('city')}</th>
                        <th onclick="customerManager.sort('orderCount')">Commandes ${this.getSortIcon('orderCount')}</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${paginatedCustomers.map(customer => `
                        <tr>
                            <td>${customer.id}</td>
                            <td><strong>${customer.name}</strong></td>
                            <td>${customer.email}</td>
                            <td>${customer.phone}</td>
                            <td><span class="badge badge-info">${customer.city}</span></td>
                            <td><span class="badge badge-success">${customer.orderCount || 0}</span></td>
                            <td>
                                <button class="btn-action btn-view" onclick="customerManager.viewCustomer(${customer.id})">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn-action btn-edit" onclick="customerManager.editCustomer(${customer.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-action btn-delete" onclick="customerManager.deleteCustomer(${customer.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        document.getElementById('customersTableContainer').innerHTML = tableHTML;
        this.renderPagination(customers.length);
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
            <button onclick="customerManager.changePage(${this.currentPage - 1})" ${this.currentPage === 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;
        
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                html += `<button onclick="customerManager.changePage(${i})" class="${i === this.currentPage ? 'active' : ''}">${i}</button>`;
            }
        }
        
        html += `<button onclick="customerManager.changePage(${this.currentPage + 1})" ${this.currentPage === totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button></div>`;
        document.getElementById('customersPagination').innerHTML = html;
    }

    changePage(page) {
        const totalPages = Math.ceil(this.getFilteredCustomers().length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderTable();
        }
    }

    openModal(customer = null) {
        const modal = document.getElementById('customerModal');
        const title = document.getElementById('customerModalTitle');
        
        if (customer) {
            title.textContent = 'Modifier le Client';
            document.getElementById('customerId').value = customer.id;
            document.getElementById('customerName').value = customer.name;
            document.getElementById('customerEmail').value = customer.email;
            document.getElementById('customerPhone').value = customer.phone;
            document.getElementById('customerAddress').value = customer.address || '';
            document.getElementById('customerCity').value = customer.city;
        } else {
            title.textContent = i18n.t('customers.addNew');
            document.getElementById('customerForm').reset();
            document.getElementById('customerId').value = '';
        }
        
        modal.classList.add('show');
    }

    closeModal() {
        document.getElementById('customerModal').classList.remove('show');
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    }

    closeDetailsModal() {
        document.getElementById('customerDetailsModal').classList.remove('show');
    }

    validateCustomer(data) {
        let isValid = true;
        const errors = {};

        if (!data.name || data.name.trim().length < 3) {
            errors.nameError = 'Le nom doit contenir au moins 3 caractères';
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            errors.emailError = 'Email invalide';
            isValid = false;
        }

        if (!data.phone || data.phone.length < 10) {
            errors.phoneError = 'Numéro de téléphone invalide';
            isValid = false;
        }

        Object.keys(errors).forEach(key => {
            document.getElementById(key).textContent = errors[key];
        });

        return isValid;
    }

    saveCustomer() {
        const id = document.getElementById('customerId').value;
        const data = {
            name: document.getElementById('customerName').value.trim(),
            email: document.getElementById('customerEmail').value.trim(),
            phone: document.getElementById('customerPhone').value.trim(),
            address: document.getElementById('customerAddress').value.trim(),
            city: document.getElementById('customerCity').value,
            orderCount: 0
        };

        if (!this.validateCustomer(data)) return;

        if (id) {
            storage.update('customers', parseInt(id), data);
            Swal.fire({ icon: 'success', title: i18n.t('customers.updateSuccess'), timer: 1500, showConfirmButton: false });
        } else {
            storage.create('customers', data);
            Swal.fire({ icon: 'success', title: i18n.t('customers.createSuccess'), timer: 1500, showConfirmButton: false });
        }

        this.closeModal();
        this.renderTable();
    }

    editCustomer(id) {
        const customer = storage.read('customers', id);
        if (customer) this.openModal(customer);
    }

    viewCustomer(id) {
        const customer = storage.read('customers', id);
        if (!customer) return;

        const detailsHTML = `
            <table class="table">
                <tr><th>ID:</th><td>${customer.id}</td></tr>
                <tr><th>Nom:</th><td>${customer.name}</td></tr>
                <tr><th>Email:</th><td>${customer.email}</td></tr>
                <tr><th>Téléphone:</th><td>${customer.phone}</td></tr>
                <tr><th>Adresse:</th><td>${customer.address || 'N/A'}</td></tr>
                <tr><th>Ville:</th><td><span class="badge badge-info">${customer.city}</span></td></tr>
                <tr><th>Nombre de commandes:</th><td><span class="badge badge-success">${customer.orderCount || 0}</span></td></tr>
                <tr><th>Date d'inscription:</th><td>${customer.createdAt}</td></tr>
            </table>
        `;

        document.getElementById('customerDetailsContent').innerHTML = detailsHTML;
        document.getElementById('customerDetailsModal').classList.add('show');

        document.getElementById('exportCustomerPDF').onclick = () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text('Fiche Client', 20, 20);
            doc.setFontSize(12);
            doc.text(`Nom: ${customer.name}`, 20, 40);
            doc.text(`Email: ${customer.email}`, 20, 50);
            doc.text(`Téléphone: ${customer.phone}`, 20, 60);
            doc.text(`Ville: ${customer.city}`, 20, 70);
            doc.save(`customer_${customer.id}.pdf`);
        };
    }

    deleteCustomer(id) {
        const customer = storage.read('customers', id);
        Swal.fire({
            title: i18n.t('customers.confirmDelete'),
            text: customer.name,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: i18n.t('common.confirm'),
            cancelButtonText: i18n.t('common.cancel')
        }).then((result) => {
            if (result.isConfirmed) {
                storage.delete('customers', id);
                Swal.fire({ icon: 'success', title: i18n.t('customers.deleteSuccess'), timer: 1500, showConfirmButton: false });
                this.renderTable();
            }
        });
    }

    exportCSV() {
        const customers = this.getFilteredCustomers();
        let csv = 'ID,Nom,Email,Téléphone,Adresse,Ville,Commandes\n';
        customers.forEach(c => {
            csv += `${c.id},"${c.name}","${c.email}","${c.phone}","${c.address || ''}","${c.city}",${c.orderCount}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    }
}

const customerManager = new CustomerManager();