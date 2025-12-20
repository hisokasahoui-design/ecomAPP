// Gestionnaire de stockage avec données initiales
class StorageManager {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        // Initialiser les données si elles n'existent pas
        if (!this.getData('products')) {
            this.setData('products', this.getInitialProducts());
        }
        if (!this.getData('categories')) {
            this.setData('categories', this.getInitialCategories());
        }
        if (!this.getData('customers')) {
            this.setData('customers', this.getInitialCustomers());
        }
        if (!this.getData('orders')) {
            this.setData('orders', this.getInitialOrders());
        }
        if (!this.getData('suppliers')) {
            this.setData('suppliers', this.getInitialSuppliers());
        }
    }

    getData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    setData(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    // Données initiales - Produits
    getInitialProducts() {
        return [
            { id: 1, name: 'Laptop Dell XPS 15', category: 'Électronique', price: 12999, stock: 15, description: 'Ordinateur portable haute performance', image: 'https://via.placeholder.com/300x200?text=Laptop', createdAt: '2024-01-15' },
            { id: 2, name: 'iPhone 15 Pro', category: 'Électronique', price: 9999, stock: 25, description: 'Smartphone dernière génération', image: 'https://via.placeholder.com/300x200?text=iPhone', createdAt: '2024-01-20' },
            { id: 3, name: 'Chaise de Bureau Ergonomique', category: 'Mobilier', price: 2499, stock: 30, description: 'Chaise confortable pour bureau', image: 'https://via.placeholder.com/300x200?text=Chaise', createdAt: '2024-02-01' },
            { id: 4, name: 'Bureau en Bois Massif', category: 'Mobilier', price: 5999, stock: 10, description: 'Bureau élégant en chêne', image: 'https://via.placeholder.com/300x200?text=Bureau', createdAt: '2024-02-05' },
            { id: 5, name: 'Casque Sony WH-1000XM5', category: 'Électronique', price: 3499, stock: 20, description: 'Casque à réduction de bruit', image: 'https://via.placeholder.com/300x200?text=Casque', createdAt: '2024-02-10' },
            { id: 6, name: 'T-Shirt Nike Sport', category: 'Vêtements', price: 299, stock: 100, description: 'T-shirt de sport respirant', image: 'https://via.placeholder.com/300x200?text=TShirt', createdAt: '2024-02-15' },
            { id: 7, name: 'Pantalon Jeans Levi\'s', category: 'Vêtements', price: 799, stock: 75, description: 'Jean classique coupe droite', image: 'https://via.placeholder.com/300x200?text=Jeans', createdAt: '2024-02-20' },
            { id: 8, name: 'Montre Apple Watch Series 9', category: 'Électronique', price: 4299, stock: 18, description: 'Montre connectée intelligente', image: 'https://via.placeholder.com/300x200?text=Watch', createdAt: '2024-03-01' },
            { id: 9, name: 'Sac à Dos Eastpak', category: 'Accessoires', price: 599, stock: 50, description: 'Sac à dos résistant', image: 'https://via.placeholder.com/300x200?text=Sac', createdAt: '2024-03-05' },
            { id: 10, name: 'Tablette Samsung Galaxy Tab', category: 'Électronique', price: 3999, stock: 22, description: 'Tablette Android performante', image: 'https://via.placeholder.com/300x200?text=Tablette', createdAt: '2024-03-10' },
            { id: 11, name: 'Canapé 3 Places', category: 'Mobilier', price: 8999, stock: 8, description: 'Canapé confortable en tissu', image: 'https://via.placeholder.com/300x200?text=Canape', createdAt: '2024-03-15' },
            { id: 12, name: 'Lampe de Bureau LED', category: 'Mobilier', price: 499, stock: 40, description: 'Lampe LED réglable', image: 'https://via.placeholder.com/300x200?text=Lampe', createdAt: '2024-03-20' },
            { id: 13, name: 'Clavier Mécanique Logitech', category: 'Électronique', price: 1299, stock: 35, description: 'Clavier mécanique RGB', image: 'https://via.placeholder.com/300x200?text=Clavier', createdAt: '2024-04-01' },
            { id: 14, name: 'Souris Gaming Razer', category: 'Électronique', price: 899, stock: 45, description: 'Souris haute précision', image: 'https://via.placeholder.com/300x200?text=Souris', createdAt: '2024-04-05' },
            { id: 15, name: 'Veste en Cuir', category: 'Vêtements', price: 2999, stock: 15, description: 'Veste en cuir véritable', image: 'https://via.placeholder.com/300x200?text=Veste', createdAt: '2024-04-10' },
            { id: 16, name: 'Baskets Adidas', category: 'Vêtements', price: 1199, stock: 60, description: 'Chaussures de sport confortables', image: 'https://via.placeholder.com/300x200?text=Baskets', createdAt: '2024-04-15' },
            { id: 17, name: 'Lunettes de Soleil Ray-Ban', category: 'Accessoires', price: 1499, stock: 25, description: 'Lunettes de soleil polarisées', image: 'https://via.placeholder.com/300x200?text=Lunettes', createdAt: '2024-04-20' },
            { id: 18, name: 'Parfum Dior Sauvage', category: 'Accessoires', price: 899, stock: 30, description: 'Eau de toilette 100ml', image: 'https://via.placeholder.com/300x200?text=Parfum', createdAt: '2024-05-01' },
            { id: 19, name: 'Écouteurs AirPods Pro', category: 'Électronique', price: 2499, stock: 28, description: 'Écouteurs sans fil avec ANC', image: 'https://via.placeholder.com/300x200?text=AirPods', createdAt: '2024-05-05' },
            { id: 20, name: 'Étagère Murale', category: 'Mobilier', price: 799, stock: 20, description: 'Étagère en bois 5 niveaux', image: 'https://via.placeholder.com/300x200?text=Etagere', createdAt: '2024-05-10' }
        ];
    }

    // Données initiales - Catégories
    getInitialCategories() {
        return [
            { id: 1, name: 'Électronique', description: 'Appareils électroniques et gadgets', productCount: 8 },
            { id: 2, name: 'Mobilier', description: 'Meubles pour la maison et le bureau', productCount: 5 },
            { id: 3, name: 'Vêtements', description: 'Vêtements pour hommes et femmes', productCount: 4 },
            { id: 4, name: 'Accessoires', description: 'Accessoires divers', productCount: 3 }
        ];
    }

    // Données initiales - Clients
    getInitialCustomers() {
        return [
            { id: 1, name: 'Ahmed Alami', email: 'ahmed.alami@email.com', phone: '0612345678', address: '123 Rue Mohammed V', city: 'Casablanca', orderCount: 5, createdAt: '2024-01-10' },
            { id: 2, name: 'Fatima Zahra', email: 'fatima.zahra@email.com', phone: '0623456789', address: '456 Avenue Hassan II', city: 'Rabat', orderCount: 3, createdAt: '2024-01-15' },
            { id: 3, name: 'Youssef Bennani', email: 'youssef.bennani@email.com', phone: '0634567890', address: '789 Boulevard Zerktouni', city: 'Casablanca', orderCount: 7, createdAt: '2024-02-01' },
            { id: 4, name: 'Salma El Amrani', email: 'salma.amrani@email.com', phone: '0645678901', address: '321 Rue Allal Ben Abdellah', city: 'Fès', orderCount: 2, createdAt: '2024-02-10' },
            { id: 5, name: 'Karim Idrissi', email: 'karim.idrissi@email.com', phone: '0656789012', address: '654 Avenue Mohammed VI', city: 'Marrakech', orderCount: 4, createdAt: '2024-02-20' },
            { id: 6, name: 'Nadia Bennis', email: 'nadia.bennis@email.com', phone: '0667890123', address: '987 Rue de la Liberté', city: 'Tanger', orderCount: 6, createdAt: '2024-03-01' },
            { id: 7, name: 'Omar Tazi', email: 'omar.tazi@email.com', phone: '0678901234', address: '147 Boulevard Anfa', city: 'Casablanca', orderCount: 1, createdAt: '2024-03-10' },
            { id: 8, name: 'Leila Chraibi', email: 'leila.chraibi@email.com', phone: '0689012345', address: '258 Avenue des FAR', city: 'Rabat', orderCount: 8, createdAt: '2024-03-15' }
        ];
    }

    // Données initiales - Commandes
    getInitialOrders() {
        return [
            { id: 1, orderNumber: 'CMD-001', customerId: 1, customerName: 'Ahmed Alami', date: '2024-05-01', total: 15998, status: 'completed', items: [{ productId: 1, quantity: 1 }, { productId: 5, quantity: 1 }] },
            { id: 2, orderNumber: 'CMD-002', customerId: 2, customerName: 'Fatima Zahra', date: '2024-05-03', total: 9999, status: 'completed', items: [{ productId: 2, quantity: 1 }] },
            { id: 3, orderNumber: 'CMD-003', customerId: 3, customerName: 'Youssef Bennani', date: '2024-05-05', total: 8498, status: 'processing', items: [{ productId: 4, quantity: 1 }, { productId: 12, quantity: 5 }] },
            { id: 4, orderNumber: 'CMD-004', customerId: 4, customerName: 'Salma El Amrani', date: '2024-05-07', total: 5998, status: 'completed', items: [{ productId: 3, quantity: 2 }, { productId: 6, quantity: 4 }] },
            { id: 5, orderNumber: 'CMD-005', customerId: 5, customerName: 'Karim Idrissi', date: '2024-05-09', total: 4299, status: 'pending', items: [{ productId: 8, quantity: 1 }] },
            { id: 6, orderNumber: 'CMD-006', customerId: 1, customerName: 'Ahmed Alami', date: '2024-05-11', total: 2398, status: 'completed', items: [{ productId: 7, quantity: 3 }] },
            { id: 7, orderNumber: 'CMD-007', customerId: 6, customerName: 'Nadia Bennis', date: '2024-05-13', total: 12998, status: 'processing', items: [{ productId: 1, quantity: 1 }] },
            { id: 8, orderNumber: 'CMD-008', customerId: 3, customerName: 'Youssef Bennani', date: '2024-05-15', total: 7198, status: 'completed', items: [{ productId: 10, quantity: 1 }, { productId: 13, quantity: 2 }, { productId: 14, quantity: 1 }] },
            { id: 9, orderNumber: 'CMD-009', customerId: 7, customerName: 'Omar Tazi', date: '2024-05-17', total: 2999, status: 'cancelled', items: [{ productId: 15, quantity: 1 }] },
            { id: 10, orderNumber: 'CMD-010', customerId: 8, customerName: 'Leila Chraibi', date: '2024-05-19', total: 8999, status: 'completed', items: [{ productId: 11, quantity: 1 }] },
            { id: 11, orderNumber: 'CMD-011', customerId: 2, customerName: 'Fatima Zahra', date: '2024-05-20', total: 3998, status: 'processing', items: [{ productId: 16, quantity: 2 }, { productId: 9, quantity: 3 }] },
            { id: 12, orderNumber: 'CMD-012', customerId: 5, customerName: 'Karim Idrissi', date: '2024-05-21', total: 5297, status: 'completed', items: [{ productId: 17, quantity: 2 }, { productId: 19, quantity: 1 }] }
        ];
    }

    // Données initiales - Fournisseurs
    getInitialSuppliers() {
        return [
            { id: 1, name: 'Mohammed Tazi', company: 'Tech Distribution Maroc', email: 'contact@techdistrib.ma', phone: '0520123456', address: '45 Zone Industrielle Aïn Sebaâ, Casablanca', specialty: 'Électronique' },
            { id: 2, name: 'Sarah Benkirane', company: 'Mobilier Pro', email: 'info@mobilierpro.ma', phone: '0537234567', address: '78 Quartier Industriel, Rabat', specialty: 'Mobilier' },
            { id: 3, name: 'Hassan Amrani', company: 'Fashion Import', email: 'sales@fashionimport.ma', phone: '0524345678', address: '12 Zone Franche, Tanger', specialty: 'Vêtements' },
            { id: 4, name: 'Laila Benjelloun', company: 'Accessoires Plus', email: 'contact@accessoiresplus.ma', phone: '0522456789', address: '33 Boulevard Anfa, Casablanca', specialty: 'Accessoires' },
            { id: 5, name: 'Rachid Mouline', company: 'Electronics World', email: 'info@electronicsworld.ma', phone: '0523567890', address: '90 Avenue des FAR, Marrakech', specialty: 'Électronique' }
        ];
    }

    // Méthodes CRUD génériques
    create(entity, item) {
        const items = this.getData(entity) || [];
        const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
        const newItem = { ...item, id: newId, createdAt: new Date().toISOString().split('T')[0] };
        items.push(newItem);
        this.setData(entity, items);
        return newItem;
    }

    read(entity, id = null) {
        const items = this.getData(entity) || [];
        if (id) {
            return items.find(item => item.id === id);
        }
        return items;
    }

    update(entity, id, updatedData) {
        const items = this.getData(entity) || [];
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updatedData };
            this.setData(entity, items);
            return items[index];
        }
        return null;
    }

    delete(entity, id) {
        const items = this.getData(entity) || [];
        const filtered = items.filter(item => item.id !== id);
        this.setData(entity, filtered);
        return true;
    }

    // Méthode pour réinitialiser les données
    resetData() {
        localStorage.removeItem('products');
        localStorage.removeItem('categories');
        localStorage.removeItem('customers');
        localStorage.removeItem('orders');
        localStorage.removeItem('suppliers');
        this.initializeData();
    }
}

// Instance globale
const storage = new StorageManager();