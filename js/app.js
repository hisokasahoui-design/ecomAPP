// Application principale - Orchestration de toutes les fonctionnalités
class Application {
  constructor() {
    this.currentPage = 'dashboard';

    // Tell the app about all available page managers
    this.managers = {
      // admin
      dashboard: dashboard,
      categories: categoryManager,
      customers: customerManager,
      suppliers: supplierManager,

      // shared
      products: productManager,
      orders: orderManager,

      // user
      userHome: userHome
    };

    this.adminOnlyPages = new Set(['dashboard', 'categories', 'customers', 'suppliers']);
  }

  init() {
    if (!authManager.isAuthenticated()) return;

    const user = authManager.getCurrentUser();
    const role = user?.role || 'user скаж'; // fallback
    this.applyRoleTheme(role);

    this.setupNavigation();
    this.renderSidebar(role);

    // Default landing differs by role
    const startPage = role === 'admin' ? 'dashboard' : 'userHome';

    // If URL hash exists, respect it but guard it
    const hashPage = (location.hash || '').replace('#', '').trim();
    const requested = hashPage || startPage;

    this.loadPage(this.guardPageByRole(requested, role));
  }

  applyRoleTheme(role) {
    document.body.classList.toggle('role-admin', role === 'admin');
    document.body.classList.toggle('role-user', role !== 'admin');
  }

  setupNavigation() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
      });
    }

    // Responsive
    if (window.innerWidth <= 768) {
      sidebar.classList.add('collapsed');
      mainContent.classList.add('expanded');
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
      } else {
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
      }
    });

    // Hash navigation (typing #page manually)
    window.addEventListener('hashchange', () => {
      if (!authManager.isAuthenticated()) return;

      const user = authManager.getCurrentUser();
      const role = user?.role || 'user';
      const page = (location.hash || '').replace('#', '').trim();

      if (!page) return;

      this.setActiveSidebarLink(page);
      this.loadPage(this.guardPageByRole(page, role));
    });
  }

  guardPageByRole(page, role) {
    // If user tries to access admin-only pages -> redirect
    if (role !== 'admin' && this.adminOnlyPages.has(page)) {
      return 'userHome';
    }
    return page;
  }

  renderSidebar(role) {
    const sidebarMenu = document.getElementById('sidebarMenu');
    if (!sidebarMenu) return;

    const adminItems = [
      { page: 'dashboard', href: '#dashboard', icon: 'fa-chart-line', labelKey: 'sidebar.dashboard' },
      { page: 'products', href: '#products', icon: 'fa-box', labelKey: 'sidebar.products' },
      { page: 'categories', href: '#categories', icon: 'fa-tags', labelKey: 'sidebar.categories' },
      { page: 'customers', href: '#customers', icon: 'fa-users', labelKey: 'sidebar.customers' },
      { page: 'orders', href: '#orders', icon: 'fa-shopping-bag', labelKey: 'sidebar.orders' },
      { page: 'suppliers', href: '#suppliers', icon: 'fa-truck', labelKey: 'sidebar.suppliers' }
    ];

    const userItems = [
      { page: 'userHome', href: '#userHome', icon: 'fa-house', labelKey: 'sidebar.home', fallback: 'Accueil' },
      { page: 'products', href: '#products', icon: 'fa-box', labelKey: 'sidebar.products' },
      { page: 'orders', href: '#orders', icon: 'fa-receipt', labelKey: 'sidebar.myOrders', fallback: 'Mes commandes' }
    ];

    const items = role === 'admin' ? adminItems : userItems;

    sidebarMenu.innerHTML = items
      .map(
        (it) => `
        <a href="${it.href}" class="sidebar-link" data-page="${it.page}">
          <i class="fas ${it.icon}"></i>
          <span data-i18n="${it.labelKey}">${it.fallback || ''}</span>
        </a>
      `
      )
      .join('');

    // Setup click handlers AFTER injecting links
    this.setupSidebarClicks(role);

    // Mark active on initial load
    const startPage = role === 'admin' ? 'dashboard' : 'userHome';
    const hashPage = (location.hash || '').replace('#', '').trim();
    this.setActiveSidebarLink(hashPage || startPage);

    // Ensure hash is consistent
    if (!location.hash) location.hash = `#${startPage}`;
  }

  setupSidebarClicks(role) {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    sidebarLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        const page = link.getAttribute('data-page');
        const safePage = this.guardPageByRole(page, role);

        // Update URL hash (triggers hashchange too, but that's ok)
        if (location.hash !== `#${safePage}`) {
          location.hash = `#${safePage}`;
        } else {
          // If already same hash, load directly
          this.setActiveSidebarLink(safePage);
          this.loadPage(safePage);
        }

        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
          document.getElementById('sidebar').classList.add('collapsed');
          document.getElementById('mainContent').classList.add('expanded');
        }
      });
    });
  }

  setActiveSidebarLink(page) {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach((l) => l.classList.remove('active'));

    const active = [...sidebarLinks].find((l) => l.getAttribute('data-page') === page);
    if (active) active.classList.add('active');
  }

  loadPage(page) {
    const user = authManager.getCurrentUser();
    const role = user?.role || 'user';

    // guard again (in case called directly)
    page = this.guardPageByRole(page, role);

    this.currentPage = page;
    const mainContent = document.getElementById('mainContent');
    const manager = this.managers[page];

    if (!manager) {
      mainContent.innerHTML = '<div class="alert alert-danger">Page non trouvée</div>';
      return;
    }

    mainContent.innerHTML = manager.render();
    i18n.translatePage();

    if (page === 'dashboard') {
      setTimeout(() => {
        dashboard.initCharts();
        dashboard.setupFilters();
      }, 100);
    } else {
      manager.init();
    }

    window.scrollTo(0, 0);
  }

  // Utilitaires existants
  static formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  }

  static formatNumber(number) {
    return new Intl.NumberFormat('fr-FR').format(number);
  }

  static formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR`', {
      style: 'currency',
      currency: 'MAD'
    }).format(amount);
  }

  static confirmAction(title, text) {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: i18n.t('common.confirm'),
      cancelButtonText: i18n.t('common.cancel')
    });
  }
}

// DOM ready
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM chargé, initialisation de l'application...");

  try {
    // Create app first (authManager may call window.app.init())
    window.app = new Application();

    // Init i18n + auth without reassigning const variables
    i18n.init();
    authManager.init();

  } catch (error) {
    console.error("Erreur lors de l'initialisation:", error);
  }
});

window.Application = Application;
