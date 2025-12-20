// Système d'internationalisation (i18n)
const translations = {
  fr: {
    login: {
      title: "Connexion E-Commerce",
      email: "Email",
      password: "Mot de passe",
      submit: "Se connecter",
      defaultUsers: "Utilisateurs par défaut :",
      invalidCredentials: "Email ou mot de passe incorrect",
      emailRequired: "L'email est requis",
      passwordRequired: "Le mot de passe est requis"
    },
    nav: {
      logout: "Déconnexion",
      welcome: "Bienvenue"
    },
    sidebar: {
      dashboard: "Dashboard",
      home: "Accueil",
      products: "Produits",
      categories: "Catégories",
      customers: "Clients",
      orders: "Commandes",
      myOrders: "Mes commandes",
      suppliers: "Fournisseurs"
    },
    dashboard: {
      title: "Tableau de bord",
      totalProducts: "Total Produits",
      totalCategories: "Total Catégories",
      totalCustomers: "Total Clients",
      totalOrders: "Total Commandes",
      revenue: "Revenu Total",
      avgOrder: "Commande Moyenne",
      salesByCategory: "Ventes par Catégorie",
      ordersOverTime: "Commandes au fil du temps",
      topProducts: "Top 5 Produits",
      orderStatus: "Statut des Commandes",
      revenueByMonth: "Revenu par Mois"
    },
    products: {
      title: "Gestion des Produits",
      addNew: "Nouveau Produit",
      name: "Nom",
      category: "Catégorie",
      price: "Prix",
      stock: "Stock",
      actions: "Actions",
      search: "Rechercher...",
      export: "Exporter CSV",
      view: "Voir",
      edit: "Modifier",
      delete: "Supprimer",
      confirmDelete: "Êtes-vous sûr de vouloir supprimer ce produit ?",
      deleteSuccess: "Produit supprimé avec succès",
      createSuccess: "Produit créé avec succès",
      updateSuccess: "Produit modifié avec succès",
      description: "Description",
      image: "Image",
      save: "Enregistrer",
      cancel: "Annuler",
      details: "Détails du Produit",
      exportPDF: "Exporter PDF"
    },
    categories: {
      title: "Gestion des Catégories",
      addNew: "Nouvelle Catégorie",
      name: "Nom",
      description: "Description",
      productCount: "Nombre de Produits",
      actions: "Actions",
      confirmDelete: "Êtes-vous sûr de vouloir supprimer cette catégorie ?",
      deleteSuccess: "Catégorie supprimée avec succès",
      createSuccess: "Catégorie créée avec succès",
      updateSuccess: "Catégorie modifiée avec succès"
    },
    customers: {
      title: "Gestion des Clients",
      addNew: "Nouveau Client",
      name: "Nom",
      email: "Email",
      phone: "Téléphone",
      address: "Adresse",
      city: "Ville",
      orderCount: "Commandes",
      actions: "Actions",
      confirmDelete: "Êtes-vous sûr de vouloir supprimer ce client ?",
      deleteSuccess: "Client supprimé avec succès",
      createSuccess: "Client créé avec succès",
      updateSuccess: "Client modifié avec succès"
    },
    orders: {
      title: "Gestion des Commandes",
      addNew: "Nouvelle Commande",
      orderNumber: "N° Commande",
      customer: "Client",
      date: "Date",
      total: "Total",
      status: "Statut",
      actions: "Actions",
      pending: "En attente",
      processing: "En cours",
      completed: "Terminée",
      cancelled: "Annulée",
      confirmDelete: "Êtes-vous sûr de vouloir supprimer cette commande ?",
      deleteSuccess: "Commande supprimée avec succès",
      createSuccess: "Commande créée avec succès",
      updateSuccess: "Commande modifiée avec succès"
    },
    suppliers: {
      title: "Gestion des Fournisseurs",
      addNew: "Nouveau Fournisseur",
      name: "Nom",
      email: "Email",
      phone: "Téléphone",
      company: "Entreprise",
      address: "Adresse",
      actions: "Actions",
      confirmDelete: "Êtes-vous sûr de vouloir supprimer ce fournisseur ?",
      deleteSuccess: "Fournisseur supprimé avec succès",
      createSuccess: "Fournisseur créé avec succès",
      updateSuccess: "Fournisseur modifié avec succès"
    },
    user: {
      homeTitle: "Accueil",
      homeSubtitle: "Bienvenue dans votre espace. Consultez les produits et suivez vos commandes.",
      quickProducts: "Parcourir les produits",
      quickProductsDesc: "Voir le catalogue disponible",
      quickOrders: "Mes commandes",
      quickOrdersDesc: "Suivre l’état de vos commandes",
      tipTitle: "Astuce",
      tipText: "Utilisez le menu à gauche pour naviguer. Les pages d’administration sont réservées à l’admin.",
      open: "Ouvrir"
    },
    common: {
      save: "Enregistrer",
      cancel: "Annuler",
      close: "Fermer",
      confirm: "Confirmer",
      search: "Rechercher...",
      export: "Exporter CSV",
      filter: "Filtrer",
      sortAsc: "Tri croissant",
      sortDesc: "Tri décroissant",
      showing: "Affichage de",
      to: "à",
      of: "sur",
      entries: "entrées",
      perPage: "Par page",
      previous: "Précédent",
      next: "Suivant",
      noData: "Aucune donnée disponible",
      loading: "Chargement..."
    }
  },

  en: {
    login: {
      title: "E-Commerce Login",
      email: "Email",
      password: "Password",
      submit: "Login",
      defaultUsers: "Default users:",
      invalidCredentials: "Invalid email or password",
      emailRequired: "Email is required",
      passwordRequired: "Password is required"
    },
    nav: {
      logout: "Logout",
      welcome: "Welcome"
    },
    sidebar: {
      dashboard: "Dashboard",
      home: "Home",
      products: "Products",
      categories: "Categories",
      customers: "Customers",
      orders: "Orders",
      myOrders: "My orders",
      suppliers: "Suppliers"
    },
    dashboard: {
      title: "Dashboard",
      totalProducts: "Total Products",
      totalCategories: "Total Categories",
      totalCustomers: "Total Customers",
      totalOrders: "Total Orders",
      revenue: "Total Revenue",
      avgOrder: "Average Order",
      salesByCategory: "Sales by Category",
      ordersOverTime: "Orders Over Time",
      topProducts: "Top 5 Products",
      orderStatus: "Order Status",
      revenueByMonth: "Revenue by Month"
    },
    products: {
      title: "Product Management",
      addNew: "New Product",
      name: "Name",
      category: "Category",
      price: "Price",
      stock: "Stock",
      actions: "Actions",
      search: "Search...",
      export: "Export CSV",
      view: "View",
      edit: "Edit",
      delete: "Delete",
      confirmDelete: "Are you sure you want to delete this product?",
      deleteSuccess: "Product deleted successfully",
      createSuccess: "Product created successfully",
      updateSuccess: "Product updated successfully",
      description: "Description",
      image: "Image",
      save: "Save",
      cancel: "Cancel",
      details: "Product Details",
      exportPDF: "Export PDF"
    },
    categories: {
      title: "Category Management",
      addNew: "New Category",
      name: "Name",
      description: "Description",
      productCount: "Product Count",
      actions: "Actions",
      confirmDelete: "Are you sure you want to delete this category?",
      deleteSuccess: "Category deleted successfully",
      createSuccess: "Category created successfully",
      updateSuccess: "Category updated successfully"
    },
    customers: {
      title: "Customer Management",
      addNew: "New Customer",
      name: "Name",
      email: "Email",
      phone: "Phone",
      address: "Address",
      city: "City",
      orderCount: "Orders",
      actions: "Actions",
      confirmDelete: "Are you sure you want to delete this customer?",
      deleteSuccess: "Customer deleted successfully",
      createSuccess: "Customer created successfully",
      updateSuccess: "Customer updated successfully"
    },
    orders: {
      title: "Order Management",
      addNew: "New Order",
      orderNumber: "Order #",
      customer: "Customer",
      date: "Date",
      total: "Total",
      status: "Status",
      actions: "Actions",
      pending: "Pending",
      processing: "Processing",
      completed: "Completed",
      cancelled: "Cancelled",
      confirmDelete: "Are you sure you want to delete this order?",
      deleteSuccess: "Order deleted successfully",
      createSuccess: "Order created successfully",
      updateSuccess: "Order updated successfully"
    },
    suppliers: {
      title: "Supplier Management",
      addNew: "New Supplier",
      name: "Name",
      email: "Email",
      phone: "Phone",
      company: "Company",
      address: "Address",
      actions: "Actions",
      confirmDelete: "Are you sure you want to delete this supplier?",
      deleteSuccess: "Supplier deleted successfully",
      createSuccess: "Supplier created successfully",
      updateSuccess: "Supplier updated successfully"
    },
    user: {
      homeTitle: "Home",
      homeSubtitle: "Welcome to your space. Browse products and track your orders.",
      quickProducts: "Browse products",
      quickProductsDesc: "View the available catalog",
      quickOrders: "My orders",
      quickOrdersDesc: "Track your order status",
      tipTitle: "Tip",
      tipText: "Use the left menu to navigate. Admin pages are restricted to admins.",
      open: "Open"
    },
    common: {
      save: "Save",
      cancel: "Cancel",
      close: "Close",
      confirm: "Confirm",
      search: "Search...",
      export: "Export CSV",
      filter: "Filter",
      sortAsc: "Sort ascending",
      sortDesc: "Sort descending",
      showing: "Showing",
      to: "to",
      of: "of",
      entries: "entries",
      perPage: "Per page",
      previous: "Previous",
      next: "Next",
      noData: "No data available",
      loading: "Loading..."
    }
  },

  ar: {
    login: {
      title: "تسجيل الدخول للتجارة الإلكترونية",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      submit: "تسجيل الدخول",
      defaultUsers: "المستخدمون الافتراضيون:",
      invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      emailRequired: "البريد الإلكتروني مطلوب",
      passwordRequired: "كلمة المرور مطلوبة"
    },
    nav: {
      logout: "تسجيل الخروج",
      welcome: "مرحبا"
    },
    sidebar: {
      dashboard: "لوحة القيادة",
      home: "الرئيسية",
      products: "المنتجات",
      categories: "الفئات",
      customers: "العملاء",
      orders: "الطلبات",
      myOrders: "طلباتي",
      suppliers: "الموردون"
    },
    dashboard: {
      title: "لوحة القيادة",
      totalProducts: "إجمالي المنتجات",
      totalCategories: "إجمالي الفئات",
      totalCustomers: "إجمالي العملاء",
      totalOrders: "إجمالي الطلبات",
      revenue: "إجمالي الإيرادات",
      avgOrder: "متوسط الطلب",
      salesByCategory: "المبيعات حسب الفئة",
      ordersOverTime: "الطلبات عبر الزمن",
      topProducts: "أفضل 5 منتجات",
      orderStatus: "حالة الطلب",
      revenueByMonth: "الإيرادات حسب الشهر"
    },
    products: {
      title: "إدارة المنتجات",
      addNew: "منتج جديد",
      name: "الاسم",
      category: "الفئة",
      price: "السعر",
      stock: "المخزون",
      actions: "الإجراءات",
      search: "بحث...",
      export: "تصدير CSV",
      view: "عرض",
      edit: "تعديل",
      delete: "حذف",
      confirmDelete: "هل أنت متأكد من حذف هذا المنتج؟",
      deleteSuccess: "تم حذف المنتج بنجاح",
      createSuccess: "تم إنشاء المنتج بنجاح",
      updateSuccess: "تم تحديث المنتج بنجاح",
      description: "الوصف",
      image: "الصورة",
      save: "حفظ",
      cancel: "إلغاء",
      details: "تفاصيل المنتج",
      exportPDF: "تصدير PDF"
    },
    categories: {
      title: "إدارة الفئات",
      addNew: "فئة جديدة",
      name: "الاسم",
      description: "الوصف",
      productCount: "عدد المنتجات",
      actions: "الإجراءات",
      confirmDelete: "هل أنت متأكد من حذف هذه الفئة؟",
      deleteSuccess: "تم حذف الفئة بنجاح",
      createSuccess: "تم إنشاء الفئة بنجاح",
      updateSuccess: "تم تحديث الفئة بنجاح"
    },
    customers: {
      title: "إدارة العملاء",
      addNew: "عميل جديد",
      name: "الاسم",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      address: "العنوان",
      city: "المدينة",
      orderCount: "الطلبات",
      actions: "الإجراءات",
      confirmDelete: "هل أنت متأكد من حذف هذا العميل؟",
      deleteSuccess: "تم حذف العميل بنجاح",
      createSuccess: "تم إنشاء العميل بنجاح",
      updateSuccess: "تم تحديث العميل بنجاح"
    },
    orders: {
      title: "إدارة الطلبات",
      addNew: "طلب جديد",
      orderNumber: "رقم الطلب",
      customer: "العميل",
      date: "التاريخ",
      total: "المجموع",
      status: "الحالة",
      actions: "الإجراءات",
      pending: "قيد الانتظار",
      processing: "قيد المعالجة",
      completed: "مكتمل",
      cancelled: "ملغى",
      confirmDelete: "هل أنت متأكد من حذف هذا الطلب؟",
      deleteSuccess: "تم حذف الطلب بنجاح",
      createSuccess: "تم إنشاء الطلب بنجاح",
      updateSuccess: "تم تحديث الطلب بنجاح"
    },
    suppliers: {
      title: "إدارة الموردين",
      addNew: "مورد جديد",
      name: "الاسم",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      company: "الشركة",
      address: "العنوان",
      actions: "الإجراءات",
      confirmDelete: "هل أنت متأكد من حذف هذا المورد؟",
      deleteSuccess: "تم حذف المورد بنجاح",
      createSuccess: "تم إنشاء المورد بنجاح",
      updateSuccess: "تم تحديث المورد بنجاح"
    },
    user: {
      homeTitle: "الرئيسية",
      homeSubtitle: "مرحبًا بك في مساحتك. تصفّح المنتجات وتابع طلباتك.",
      quickProducts: "تصفح المنتجات",
      quickProductsDesc: "عرض الكتالوج المتاح",
      quickOrders: "طلباتي",
      quickOrdersDesc: "تتبع حالة الطلبات",
      tipTitle: "نصيحة",
      tipText: "استخدم القائمة الجانبية للتنقل. صفحات الإدارة مخصّصة للمسؤول فقط.",
      open: "فتح"
    },
    common: {
      save: "حفظ",
      cancel: "إلغاء",
      close: "إغلاق",
      confirm: "تأكيد",
      search: "بحث...",
      export: "تصدير CSV",
      filter: "تصفية",
      sortAsc: "ترتيب تصاعدي",
      sortDesc: "ترتيب تنازلي",
      showing: "عرض",
      to: "إلى",
      of: "من",
      entries: "إدخالات",
      perPage: "لكل صفحة",
      previous: "السابق",
      next: "التالي",
      noData: "لا توجد بيانات متاحة",
      loading: "جار التحميل..."
    }
  }
};

class I18n {
  constructor() {
    this.currentLang = localStorage.getItem('language') || 'fr';
  }

  init() {
    this.updateLanguage(this.currentLang);
    this.setupLanguageSelector();
  }

  setupLanguageSelector() {
    const selector = document.getElementById('languageSelect');
    if (selector) {
      selector.value = this.currentLang;
      selector.addEventListener('change', (e) => {
        this.updateLanguage(e.target.value);
      });
    }
  }

  updateLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('language', lang);

    // Mettre à jour l'attribut dir pour RTL
    if (lang === 'ar') {
      document.body.setAttribute('dir', 'rtl');
    } else {
      document.body.removeAttribute('dir');
    }

    // Mettre à jour tous les éléments avec data-i18n
    this.translatePage();
  }

  translatePage() {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.getAttribute('data-i18n');
      const translation = this.getTranslation(key);

      // If translation is missing, don't overwrite with the key name
      if (translation === null || translation === undefined) return;

      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    });
  }

  getTranslation(key) {
    const keys = key.split('.');
    let value = translations[this.currentLang];

    for (const k of keys) {
      if (value && Object.prototype.hasOwnProperty.call(value, k)) {
        value = value[k];
      } else {
        // Missing key -> return null so UI doesn't show "user.homeTitle"
        return null;
      }
    }

    return value;
  }

  t(key) {
    // For JS usage, fallback to key if missing (useful for debugging)
    const v = this.getTranslation(key);
    return v === null || v === undefined ? key : v;
  }
}

// Instance globale
const i18n = new I18n();
