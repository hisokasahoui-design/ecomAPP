// Gestion des commandes - CRUD complet
class OrderManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.sortField = 'date';
        this.sortOrder = 'desc';
        this.searchTerm = '';
        this.filters = { status: 'all', dateFrom: '', dateTo: '' };
    }

    render() {
        return `
            <div class="orders-container">
                <div class="table-header">
                    <h1 data-i18n="orders.title">Gestion des Commandes</h1>
                    <div class="table-controls">
                        <button class="btn btn-success" id="addOrderBtn">
                            <i class="fas fa-plus"></i> <span data-i18n="orders.addNew">Nouvelle Commande</span>
                        </button>
                        <button class="btn btn-primary" id="exportOrdersBtn">
                            <i class="fas fa-file-csv"></i> Exporter CSV
                        </button>
                    </div>
                </div>

                <div class="filters-section">
                    <div class="filters-grid">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" id="orderSearch" class="form-control" placeholder="Rechercher...">
                        </div>
                        <div class="form-group">
                            <select id="statusFilter" class="form-select">
                                <option value="all">Tous les statuts</option>
                                <option value="pending">En attente</option>
                                <option value="processing">En cours</option>
                                <option value="completed">Terminée</option>
                                <option value="cancelled">Annulée</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <input type="date" id="dateFromFilter" class="form-control" placeholder="Date de">
                        </div>
                        <div class="form-group">
                            <input type="date" id="dateToFilter" class="form-control" placeholder="Date à">
                        </div>
                    </div>
                </div>

                <div class="table-container">
                    <div class="table-responsive" id="ordersTableContainer"></div>
                    <div class="pagination-container" id="ordersPagination"></div>
                </div>
            </div>

            <div id="orderModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="orderModalTitle">Nouvelle Commande</h3>
                        <button class="btn-close" id="closeOrderModal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="orderForm">
                            <input type="hidden" id="orderId">
                            <div class="form-group">
                                <label data-i18n="orders.customer">Client *</label>
                                <select id="orderCustomer" class="form-select" required>
                                    <option value="">Sélectionner un client</option>
                                </select>
                                <span class="error-message" id="customerError"></span>
                            </div>
                            <div class="form-group">
                                <label data-i18n="orders.date">Date *</label>
                                <input type="date" id="orderDate" class="form-control" required>
                                <span class="error-message" id="dateError"></span>
                            </div>
                            <div class="form-group">
                                <label data-i18n="orders.total">Total (DH) *</label>
                                <input type="number" id="orderTotal" class="form-control" min="0" step="0.01" required>
                                <span class="error-message" id="totalError"></span>
                            </div>
                            <div class="form-group">
                                <label data-i18n="orders.status">Statut *</label>
                                <select id="orderStatus" class="form-select" required>
                                    <option value="pending">En attente</option>
                                    <option value="processing">En cours</option>
                                    <option value="completed">Terminée</option>
                                    <option value="cancelled">Annulée</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="cancelOrderBtn">Annuler</button>
                        <button class="btn btn-primary" id="saveOrderBtn">Enregistrer</button>
                    </div>
                </div>
            </div>

            <div id="orderDetailsModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Détails de la Commande</h3>
                        <button class="btn-close" id="closeOrderDetailsModal">&times;</button>
                    </div>
                    <div class="modal-body" id="orderDetailsContent"></div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" id="exportOrderPDF"><i class="fas fa-file-pdf"></i> Exporter PDF</button>
                        <button class="btn btn-secondary" id="closeOrderDetailsBtn">Fermer</button>
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
        document.getElementById('addOrderBtn')?.addEventListener('click', () => this.openModal());
        document.getElementById('closeOrderModal')?.addEventListener('click', () => this.closeModal());
        document.getElementById('cancelOrderBtn')?.addEventListener('click', () => this.closeModal());
        document.getElementById('saveOrderBtn')?.addEventListener('click', () => this.saveOrder());
        document.getElementById('closeOrderDetailsModal')?.addEventListener('click', () => this.closeDetailsModal());
        document.getElementById('closeOrderDetailsBtn')?.addEventListener('click', () => this.closeDetailsModal());
        
        document.getElementById('orderSearch')?.addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.currentPage = 1;
            this.renderTable();
        });

        document.getElementById('statusFilter')?.addEventListener('change', (e) => {
            this.filters.status = e.target.value;
            this.currentPage = 1;
            this.renderTable();
        });

        document.getElementById('dateFromFilter')?.addEventListener('change', (e) => {
            this.filters.dateFrom = e.target.value;
            this.currentPage = 1;
            this.renderTable();
        });

        document.getElementById('dateToFilter')?.addEventListener('change', (e) => {
            this.filters.dateTo = e.target.value;
            this.currentPage = 1;
            this.renderTable();
        });

        document.getElementById('exportOrdersBtn')?.addEventListener('click', () => this.exportCSV());
    }

    getFilteredOrders() {
        let orders = storage.read('orders');

        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            orders = orders.filter(o => 
                o.orderNumber.toLowerCase().includes(term) ||
                o.customerName.toLowerCase().includes(term)
            );
        }

        if (this.filters.status !== 'all') {
            orders = orders.filter(o => o.status === this.filters.status);
        }

        if (this.filters.dateFrom) {
            orders = orders.filter(o => o.date >= this.filters.dateFrom);
        }

        if (this.filters.dateTo) {
            orders = orders.filter(o => o.date <= this.filters.dateTo);
        }

        orders.sort((a, b) => {
            let aVal = a[this.sortField];
            let bVal = b[this.sortField];
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }
            return this.sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
        });

        return orders;
    }

    renderTable() {
        const orders = this.getFilteredOrders();
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const paginatedOrders = orders.slice(startIndex, startIndex + this.itemsPerPage);

        const statusBadge = (status) => {
            const badges = {
                pending: 'badge-warning',
                processing: 'badge-info',
                completed: 'badge-success',
                cancelled: 'badge-danger'
            };
            const labels = {
                pending: 'En attente',
                processing: 'En cours',
                completed: 'Terminée',
                cancelled: 'Annulée'
            };
            return `<span class="badge ${badges[status]}">${labels[status]}</span>`;
        };

        const tableHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th onclick="orderManager.sort('orderNumber')">N° Commande ${this.getSortIcon('orderNumber')}</th>
                        <th onclick="orderManager.sort('customerName')">Client ${this.getSortIcon('customerName')}</th>
                        <th onclick="orderManager.sort('date')">Date ${this.getSortIcon('date')}</th>
                        <th onclick="orderManager.sort('total')">Total ${this.getSortIcon('total')}</th>
                        <th onclick="orderManager.sort('status')">Statut ${this.getSortIcon('status')}</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${paginatedOrders.map(order => `
                        <tr>
                            <td><strong>${order.orderNumber}</strong></td>
                            <td>${order.customerName}</td>
                            <td>${order.date}</td>
                            <td>${order.total.toLocaleString()} DH</td>
                            <td>${statusBadge(order.status)}</td>
                            <td>
                                <button class="btn-action btn-view" onclick="orderManager.viewOrder(${order.id})">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn-action btn-edit" onclick="orderManager.editOrder(${order.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-action btn-delete" onclick="orderManager.deleteOrder(${order.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        document.getElementById('ordersTableContainer').innerHTML = tableHTML;
        this.renderPagination(orders.length);
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
            <button onclick="orderManager.changePage(${this.currentPage - 1})" ${this.currentPage === 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;
        
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                html += `<button onclick="orderManager.changePage(${i})" class="${i === this.currentPage ? 'active' : ''}">${i}</button>`;
            }
        }
        
        html += `<button onclick="orderManager.changePage(${this.currentPage + 1})" ${this.currentPage === totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button></div>`;
        document.getElementById('ordersPagination').innerHTML = html;
    }

    changePage(page) {
        const totalPages = Math.ceil(this.getFilteredOrders().length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderTable();
        }
    }

    openModal(order = null) {
        const modal = document.getElementById('orderModal');
        const title = document.getElementById('orderModalTitle');
        const customerSelect = document.getElementById('orderCustomer');

        // Charger les clients
        const customers = storage.read('customers');
        customerSelect.innerHTML = '<option value="">Sélectionner un client</option>' +
            customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        
        if (order) {
            title.textContent = 'Modifier la Commande';
            document.getElementById('orderId').value = order.id;
            document.getElementById('orderCustomer').value = order.customerId;
            document.getElementById('orderDate').value = order.date;
            document.getElementById('orderTotal').value = order.total;
            document.getElementById('orderStatus').value = order.status;
        } else {
            title.textContent = i18n.t('orders.addNew');
            document.getElementById('orderForm').reset();
            document.getElementById('orderId').value = '';
            document.getElementById('orderDate').value = new Date().toISOString().split('T')[0];
        }
        
        modal.classList.add('show');
    }

    closeModal() {
        document.getElementById('orderModal').classList.remove('show');
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    }

    closeDetailsModal() {
        document.getElementById('orderDetailsModal').classList.remove('show');
    }

    validateOrder(data) {
        let isValid = true;

        if (!data.customerId) {
            document.getElementById('customerError').textContent = 'Sélectionnez un client';
            isValid = false;
        }

        if (!data.date) {
            document.getElementById('dateError').textContent = 'La date est requise';
            isValid = false;
        }

        if (!data.total || data.total <= 0) {
            document.getElementById('totalError').textContent = 'Le total doit être supérieur à 0';
            isValid = false;
        }

        return isValid;
    }

    saveOrder() {
        const id = document.getElementById('orderId').value;
        const customerId = parseInt(document.getElementById('orderCustomer').value);
        const customer = storage.read('customers', customerId);

        const data = {
            customerId: customerId,
            customerName: customer ? customer.name : '',
            date: document.getElementById('orderDate').value,
            total: parseFloat(document.getElementById('orderTotal').value),
            status: document.getElementById('orderStatus').value,
            items: []
        };

        if (!this.validateOrder(data)) return;

        if (id) {
            storage.update('orders', parseInt(id), data);
            Swal.fire({ icon: 'success', title: i18n.t('orders.updateSuccess'), timer: 1500, showConfirmButton: false });
        } else {
            const orders = storage.read('orders');
            const orderNumber = `CMD-${String(orders.length + 1).padStart(3, '0')}`;
            storage.create('orders', { ...data, orderNumber });
            Swal.fire({ icon: 'success', title: i18n.t('orders.createSuccess'), timer: 1500, showConfirmButton: false });
        }

        this.closeModal();
        this.renderTable();
    }

    editOrder(id) {
        const order = storage.read('orders', id);
        if (order) this.openModal(order);
    }

    viewOrder(id) {
        const order = storage.read('orders', id);
        if (!order) return;

        const statusLabels = {
            pending: 'En attente',
            processing: 'En cours',
            completed: 'Terminée',
            cancelled: 'Annulée'
        };

        const detailsHTML = `
            <table class="table">
                <tr><th>N° Commande:</th><td><strong>${order.orderNumber}</strong></td></tr>
                <tr><th>Client:</th><td>${order.customerName}</td></tr>
                <tr><th>Date:</th><td>${order.date}</td></tr>
                <tr><th>Total:</th><td><strong>${order.total.toLocaleString()} DH</strong></td></tr>
                <tr><th>Statut:</th><td><span class="badge badge-${order.status === 'completed' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}">${statusLabels[order.status]}</span></td></tr>
            </table>
        `;

        document.getElementById('orderDetailsContent').innerHTML = detailsHTML;
        document.getElementById('orderDetailsModal').classList.add('show');

        document.getElementById('exportOrderPDF').onclick = () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text('Commande ' + order.orderNumber, 20, 20);
            doc.setFontSize(12);
            doc.text(`Client: ${order.customerName}`, 20, 40);
            doc.text(`Date: ${order.date}`, 20, 50);
            doc.text(`Total: ${order.total.toLocaleString()} DH`, 20, 60);
            doc.text(`Statut: ${statusLabels[order.status]}`, 20, 70);
            doc.save(`order_${order.orderNumber}.pdf`);
        };
    }

    deleteOrder(id) {
        const order = storage.read('orders', id);
        Swal.fire({
            title: i18n.t('orders.confirmDelete'),
            text: order.orderNumber,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: i18n.t('common.confirm'),
            cancelButtonText: i18n.t('common.cancel')
        }).then((result) => {
            if (result.isConfirmed) {
                storage.delete('orders', id);
                Swal.fire({ icon: 'success', title: i18n.t('orders.deleteSuccess'), timer: 1500, showConfirmButton: false });
                this.renderTable();
            }
        });
    }

    exportCSV() {
        const orders = this.getFilteredOrders();
        let csv = 'N° Commande,Client,Date,Total,Statut\n';
        orders.forEach(o => {
            csv += `"${o.orderNumber}","${o.customerName}","${o.date}",${o.total},"${o.status}"\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    }
}

const orderManager = new OrderManager();