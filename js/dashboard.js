// Dashboard avec statistiques et graphiques
class Dashboard {
    constructor() {
        this.charts = {};
    }

    render() {
        const products = storage.read('products');
        const categories = storage.read('categories');
        const customers = storage.read('customers');
        const orders = storage.read('orders');
        const suppliers = storage.read('suppliers');

        // Calculer les statistiques
        const stats = this.calculateStats(products, orders, customers);

        return `
            <div class="dashboard-container">
                <h1 data-i18n="dashboard.title">Tableau de bord</h1>
                
                <!-- Cartes KPI -->
                <div class="stats-cards">
                    <div class="stat-card">
                        <div class="stat-card-icon primary">
                            <i class="fas fa-box"></i>
                        </div>
                        <div class="stat-card-value">${products.length}</div>
                        <div class="stat-card-label" data-i18n="dashboard.totalProducts">Total Produits</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-card-icon success">
                            <i class="fas fa-tags"></i>
                        </div>
                        <div class="stat-card-value">${categories.length}</div>
                        <div class="stat-card-label" data-i18n="dashboard.totalCategories">Total Catégories</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-card-icon warning">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-card-value">${customers.length}</div>
                        <div class="stat-card-label" data-i18n="dashboard.totalCustomers">Total Clients</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-card-icon danger">
                            <i class="fas fa-shopping-bag"></i>
                        </div>
                        <div class="stat-card-value">${orders.length}</div>
                        <div class="stat-card-label" data-i18n="dashboard.totalOrders">Total Commandes</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-card-icon primary">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                        <div class="stat-card-value">${stats.totalRevenue.toLocaleString()} DH</div>
                        <div class="stat-card-label" data-i18n="dashboard.revenue">Revenu Total</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-card-icon success">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="stat-card-value">${stats.avgOrder.toLocaleString()} DH</div>
                        <div class="stat-card-label" data-i18n="dashboard.avgOrder">Commande Moyenne</div>
                    </div>
                </div>

                <!-- Filtres -->
                <div class="filters-section">
                    <div class="filters-grid">
                        <div class="form-group">
                            <label>Période</label>
                            <select id="periodFilter" class="form-select">
                                <option value="all">Toute période</option>
                                <option value="today">Aujourd'hui</option>
                                <option value="week">Cette semaine</option>
                                <option value="month" selected>Ce mois</option>
                                <option value="year">Cette année</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Catégorie</label>
                            <select id="categoryFilter" class="form-select">
                                <option value="all">Toutes les catégories</option>
                                ${categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Graphiques -->
                <div class="charts-grid">
                    <div class="chart-container">
                        <h3 class="chart-title" data-i18n="dashboard.salesByCategory">Ventes par Catégorie</h3>
                        <canvas id="pieChart"></canvas>
                    </div>
                    
                    <div class="chart-container">
                        <h3 class="chart-title" data-i18n="dashboard.orderStatus">Statut des Commandes</h3>
                        <canvas id="donutChart"></canvas>
                    </div>
                    
                    <div class="chart-container">
                        <h3 class="chart-title" data-i18n="dashboard.topProducts">Top 5 Produits</h3>
                        <canvas id="barChart"></canvas>
                    </div>
                    
                    <div class="chart-container">
                        <h3 class="chart-title" data-i18n="dashboard.ordersOverTime">Commandes au fil du temps</h3>
                        <canvas id="lineChart"></canvas>
                    </div>
                    
                    <div class="chart-container">
                        <h3 class="chart-title" data-i18n="dashboard.revenueByMonth">Revenu par Mois</h3>
                        <canvas id="areaChart"></canvas>
                    </div>
                </div>
            </div>
        `;
    }

    calculateStats(products, orders, customers) {
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const avgOrder = orders.length > 0 ? totalRevenue / orders.length : 0;
        
        return {
            totalRevenue: Math.round(totalRevenue),
            avgOrder: Math.round(avgOrder)
        };
    }

    initCharts() {
        // Détruire les anciens graphiques
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });

        const products = storage.read('products');
        const orders = storage.read('orders');
        
        // 1. Pie Chart - Ventes par catégorie
        this.createPieChart(products, orders);
        
        // 2. Donut Chart - Statut des commandes
        this.createDonutChart(orders);
        
        // 3. Bar Chart - Top 5 produits
        this.createBarChart(products, orders);
        
        // 4. Line Chart - Commandes au fil du temps
        this.createLineChart(orders);
        
        // 5. Area Chart - Revenu par mois
        this.createAreaChart(orders);
    }

    createPieChart(products, orders) {
        const ctx = document.getElementById('pieChart');
        if (!ctx) return;

        // Calculer les ventes par catégorie
        const salesByCategory = {};
        
        orders.forEach(order => {
            order.items.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                if (product) {
                    const category = product.category;
                    salesByCategory[category] = (salesByCategory[category] || 0) + (product.price * item.quantity);
                }
            });
        });

        const labels = Object.keys(salesByCategory);
        const data = Object.values(salesByCategory);

        this.charts.pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#4f46e5',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6',
                        '#06b6d4'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                return label + ': ' + value.toLocaleString() + ' DH';
                            }
                        }
                    }
                }
            }
        });
    }

    createDonutChart(orders) {
        const ctx = document.getElementById('donutChart');
        if (!ctx) return;

        // Compter les commandes par statut
        const statusCount = {
            pending: 0,
            processing: 0,
            completed: 0,
            cancelled: 0
        };

        orders.forEach(order => {
            statusCount[order.status]++;
        });

        this.charts.donutChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['En attente', 'En cours', 'Terminée', 'Annulée'],
                datasets: [{
                    data: [
                        statusCount.pending,
                        statusCount.processing,
                        statusCount.completed,
                        statusCount.cancelled
                    ],
                    backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createBarChart(products, orders) {
        const ctx = document.getElementById('barChart');
        if (!ctx) return;

        // Calculer les ventes par produit
        const productSales = {};

        orders.forEach(order => {
            order.items.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                if (product) {
                    productSales[product.name] = (productSales[product.name] || 0) + item.quantity;
                }
            });
        });

        // Trier et prendre le top 5
        const sortedProducts = Object.entries(productSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const labels = sortedProducts.map(p => p[0]);
        const data = sortedProducts.map(p => p[1]);

        this.charts.barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Quantité vendue',
                    data: data,
                    backgroundColor: '#4f46e5',
                    borderColor: '#4338ca',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    createLineChart(orders) {
        const ctx = document.getElementById('lineChart');
        if (!ctx) return;

        // Grouper les commandes par date
        const ordersByDate = {};
        
        orders.forEach(order => {
            const date = order.date;
            ordersByDate[date] = (ordersByDate[date] || 0) + 1;
        });

        // Trier par date
        const sortedDates = Object.keys(ordersByDate).sort();
        const counts = sortedDates.map(date => ordersByDate[date]);

        this.charts.lineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sortedDates,
                datasets: [{
                    label: 'Nombre de commandes',
                    data: counts,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true
                    }
                }
            }
        });
    }

    createAreaChart(orders) {
        const ctx = document.getElementById('areaChart');
        if (!ctx) return;

        // Grouper le revenu par mois
        const revenueByMonth = {};
        
        orders.forEach(order => {
            const month = order.date.substring(0, 7); // YYYY-MM
            revenueByMonth[month] = (revenueByMonth[month] || 0) + order.total;
        });

        const sortedMonths = Object.keys(revenueByMonth).sort();
        const revenues = sortedMonths.map(month => revenueByMonth[month]);

        this.charts.areaChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sortedMonths,
                datasets: [{
                    label: 'Revenu (DH)',
                    data: revenues,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.3)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString() + ' DH';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Revenu: ' + context.parsed.y.toLocaleString() + ' DH';
                            }
                        }
                    }
                }
            }
        });
    }

    setupFilters() {
        const periodFilter = document.getElementById('periodFilter');
        const categoryFilter = document.getElementById('categoryFilter');

        if (periodFilter) {
            periodFilter.addEventListener('change', () => {
                this.applyFilters();
            });
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        // Recharger les graphiques avec les filtres appliqués
        this.initCharts();
        
        Swal.fire({
            icon: 'success',
            title: 'Filtres appliqués',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500
        });
    }
}

// Instance globale - sera initialisée dans app.js
const dashboard = new Dashboard();