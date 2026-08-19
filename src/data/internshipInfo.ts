export const TASK_INFO = {
  taskId: 'JV-EC-004',
  studentCode: 'DAS-JV-004',
  taskName: 'Fashion E-Commerce Store with Size & Color Variants',
  domain: 'E-Commerce Fashion & Retail',
  industry: 'Fashion & Apparel Retail',
  company: 'Data Alcott Systems',
  internshipType: 'Free Java Full Stack Internship Online',
  techStack: 'Spring Boot · Hibernate · JPA · MySQL · Thymeleaf / Modern React',
  specialFeature: 'Size & Color Variants Advanced Management, Smart Fit Advisor, Virtual Try-On',
  portalUrl: 'https://www.freeinternships.in',
  blogSubmitUrl: 'https://www.freeinternships.in/blog/',
  taskUrl: 'https://www.freeinternships.in/java-full-stack-internship/remote-java-full-stack-internship-fashion-ecommerce-store-jv-ec-004.php',
  description: 'Build a complete fashion e-commerce store with size/color variants, multi-faceted product filters, shopping cart, checkout flow, live order tracking, and an admin inventory matrix using Spring Boot, Hibernate, JPA, and MySQL.',
  deliverables: [
    'Size & Color Variants System (Individual SKUs, distinct stock quantities, dynamic price overrides)',
    'Multi-faceted Filtering (Filter by department, category, size matrix, color swatches, price range, brand, stock)',
    'Interactive Shopping Bag & Coupon Engine (Stock validation, real-time totals, discount codes, free shipping bar)',
    '3-Step Express Checkout (Address verification, delivery options, payment methods, instant receipt confirmation)',
    'Live Order Tracking Timeline (Placed -> Processing -> Shipped -> Out for Delivery -> Delivered with status simulator)',
    'AI Size & Fit Advisor (Personalized size prediction by height, weight, frame, and fit preference)',
    'Interactive Virtual Try-On Studio (Garment drape silhouette simulation, lighting modes, colorway previews)',
    'Admin Inventory & Variant Matrix Dashboard (Full CRUD for products and variants, inline stock/price updates, order status management, and complete MySQL DDL dump)',
  ],
};

export const MYSQL_SCHEMA_SQL = `-- ==========================================================
-- Data Alcott Systems - Free Java Full Stack Internship
-- Task ID: JV-EC-004 | Student Code: DAS-JV-004
-- Database Schema: fashion_store_db.sql
-- ==========================================================

DROP DATABASE IF EXISTS fashion_store_db;
CREATE DATABASE fashion_store_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fashion_store_db;

-- 1. Users Table
CREATE TABLE users (
    id BIGINT AUTO-INCREMENT PRIMARY KEY,
    email VARCHAR(191) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    role ENUM('ROLE_USER', 'ROLE_ADMIN') DEFAULT 'ROLE_USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB;

-- 2. Categories Table
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    department ENUM('Men', 'Women', 'Kids', 'Accessories', 'Unisex') NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Brands Table
CREATE TABLE brands (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    logo VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Products Table (Catalog)
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    category_id BIGINT NOT NULL,
    brand_id BIGINT NOT NULL,
    department ENUM('Men', 'Women', 'Kids', 'Accessories', 'Unisex') NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT TRUE,
    material VARCHAR(255),
    fit_type VARCHAR(100),
    care_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE,
    INDEX idx_prod_cat (category_id),
    INDEX idx_prod_dept (department)
) ENGINE=InnoDB;

-- 5. Product Variants Table (Size & Color Matrix + SKU + Stock)
CREATE TABLE product_variants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    size VARCHAR(20) NOT NULL, -- S, M, L, XL, XXL, 30, 32
    color VARCHAR(50) NOT NULL, -- Camel Beige, Midnight Black
    color_hex VARCHAR(20) NOT NULL, -- #C19A6B
    stock INT NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_variant_prod (product_id),
    INDEX idx_variant_sku (sku),
    INDEX idx_variant_size_color (size, color)
) ENGINE=InnoDB;

-- 6. Cart Items Table
CREATE TABLE cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    variant_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Orders Table
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0.00,
    tax DECIMAL(10, 2) DEFAULT 0.00,
    shipping_fee DECIMAL(10, 2) DEFAULT 0.00,
    status ENUM('PLACED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') DEFAULT 'PLACED',
    payment_method VARCHAR(50) NOT NULL,
    payment_status ENUM('PAID', 'PENDING', 'REFUNDED') DEFAULT 'PENDING',
    shipping_name VARCHAR(150) NOT NULL,
    shipping_street VARCHAR(255) NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_state VARCHAR(100) NOT NULL,
    shipping_zip VARCHAR(30) NOT NULL,
    shipping_phone VARCHAR(30) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 8. Order Items Table (Line Items snapshotting Variant SKU)
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    variant_id BIGINT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    size VARCHAR(20) NOT NULL,
    color VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    sku VARCHAR(100) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id)
) ENGINE=InnoDB;

-- 9. Wishlist Table
CREATE TABLE wishlist (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_prod (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Reviews Table
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    fit_feedback ENUM('Runs Small', 'True to Size', 'Runs Large') DEFAULT 'True to Size',
    verified_purchase BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. Size Recommendations Table
CREATE TABLE size_recommendations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_slug VARCHAR(100) NOT NULL,
    height_cm INT,
    weight_kg INT,
    preferred_fit VARCHAR(50),
    recommended_size VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
`;
