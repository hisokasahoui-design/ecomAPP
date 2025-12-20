// Système d'authentification
class AuthManager {
    constructor() {
        this.users = [
            { email: 'admin@app.com', password: 'admin123', role: 'admin', name: 'Admin User' },
            { email: 'user@app.com', password: 'user123', role: 'user', name: 'Regular User' }
        ];
        this.currentUser = null;
    }

    init() {
        // Vérifier si l'utilisateur est déjà connecté
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showMainApp();
        } else {
            this.showLoginPage();
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Gestionnaire de formulaire de connexion
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Gestionnaire de déconnexion
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        // Réinitialiser les messages d'erreur
        this.clearErrors();

        // Validation
        if (!email) {
            this.showError('emailError', i18n.t('login.emailRequired'));
            return;
        }

        if (!password) {
            this.showError('passwordError', i18n.t('login.passwordRequired'));
            return;
        }

        // Vérifier les identifiants
        const user = this.users.find(u => u.email === email && u.password === password);

        if (user) {
            this.currentUser = { ...user };
            delete this.currentUser.password; // Ne pas stocker le mot de passe
            
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            Swal.fire({
                icon: 'success',
                title: i18n.t('nav.welcome'),
                text: `${i18n.t('nav.welcome')}, ${user.name}!`,
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                this.showMainApp();
            });
        } else {
            this.showError('passwordError', i18n.t('login.invalidCredentials'));
        }
    }

    handleLogout() {
        Swal.fire({
            title: i18n.t('nav.logout'),
            text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: i18n.t('common.confirm'),
            cancelButtonText: i18n.t('common.cancel')
        }).then((result) => {
            if (result.isConfirmed) {
                this.currentUser = null;
                localStorage.removeItem('currentUser');
                this.showLoginPage();
                
                Swal.fire({
                    icon: 'success',
                    title: 'Déconnecté',
                    text: 'Vous avez été déconnecté avec succès',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    }

    showLoginPage() {
        document.getElementById('loginPage').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
    }

    showMainApp() {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        
        // Afficher le nom de l'utilisateur
        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay && this.currentUser) {
            userDisplay.textContent = `${i18n.t('nav.welcome')}, ${this.currentUser.name}`;
        }
        
        // Initialiser l'application
        if (window.app) {
            window.app.init();
        }
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }
}

// Instance globale
const authManager = new AuthManager();