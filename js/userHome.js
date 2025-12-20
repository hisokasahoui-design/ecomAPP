// User Home page (different UI for regular users)
const userHome = {
  render() {
    return `
      <div class="container-fluid">
        <div class="page-header">
          <h1 data-i18n="user.homeTitle">Accueil</h1>
          <p class="text-muted" data-i18n="user.homeSubtitle">
            Bienvenue dans votre espace. Consultez les produits et suivez vos commandes.
          </p>
        </div>

        <div class="row g-4 mt-1">
          <div class="col-12 col-md-6 col-lg-4">
            <div class="card shadow-sm border-0">
              <div class="card-body">
                <div class="d-flex align-items-center gap-3">
                  <div class="icon-badge icon-badge-primary">
                    <i class="fas fa-box"></i>
                  </div>
                  <div>
                    <h5 class="mb-1" data-i18n="user.quickProducts">Parcourir les produits</h5>
                    <p class="text-muted mb-0" data-i18n="user.quickProductsDesc">Voir le catalogue disponible</p>
                  </div>
                </div>
                <div class="mt-3">
                  <a href="#products" class="btn btn-primary btn-sm" data-go="products">
                    <i class="fas fa-arrow-right"></i> <span data-i18n="user.open">Ouvrir</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-6 col-lg-4">
            <div class="card shadow-sm border-0">
              <div class="card-body">
                <div class="d-flex align-items-center gap-3">
                  <div class="icon-badge icon-badge-success">
                    <i class="fas fa-shopping-bag"></i>
                  </div>
                  <div>
                    <h5 class="mb-1" data-i18n="user.quickOrders">Mes commandes</h5>
                    <p class="text-muted mb-0" data-i18n="user.quickOrdersDesc">Suivre l’état de vos commandes</p>
                  </div>
                </div>
                <div class="mt-3">
                  <a href="#orders" class="btn btn-success btn-sm" data-go="orders">
                    <i class="fas fa-arrow-right"></i> <span data-i18n="user.open">Ouvrir</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-4">
            <div class="card shadow-sm border-0 user-card-accent">
              <div class="card-body">
                <h5 class="mb-2" data-i18n="user.tipTitle">Astuce</h5>
                <p class="text-muted mb-0" data-i18n="user.tipText">
                  Utilisez le menu à gauche pour naviguer. Les pages d’administration sont réservées à l’admin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    // Optional: attach handlers if needed later
  }
};
