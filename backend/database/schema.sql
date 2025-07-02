-- Create the ecommerce database if it doesn't exist
DROP DATABASE IF EXISTS ecommerce_store;
CREATE DATABASE IF NOT EXISTS ecommerce_store;
USE ecommerce_store;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  image VARCHAR(500),
  rating DECIMAL(2, 1) DEFAULT 0,
  reviews INT DEFAULT 0,
  category VARCHAR(100),
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (user_id, product_id)
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (user_id, product_id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  shipping_address JSON,
  billing_address JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample products data (flattened to one line each)
INSERT IGNORE INTO products (id, name, price, original_price, image, rating, reviews, category, in_stock, description) VALUES
(1, 'Premium Wireless Headphones', 299.99, 399.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', 4.8, 124, 'Electronics', TRUE, 'High-quality wireless headphones with noise cancellation'),
(2, 'Smart Fitness Watch', 199.99, NULL, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop', 4.6, 89, 'Electronics', TRUE, 'Track your fitness goals with this advanced smartwatch'),
(3, 'Professional Camera Lens', 849.99, NULL, 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=500&fit=crop', 4.9, 67, 'Photography', TRUE, 'Professional grade camera lens for stunning photography'),
(4, 'Ergonomic Office Chair', 449.99, 599.99, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop', 4.7, 156, 'Furniture', TRUE, 'Comfortable ergonomic office chair for long work sessions'),
(5, 'Wireless Gaming Mouse', 79.99, NULL, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop', 4.5, 203, 'Electronics', TRUE, 'High-precision wireless gaming mouse with RGB lighting'),
(6, 'Minimalist Desk Lamp', 89.99, NULL, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop', 4.4, 78, 'Home', FALSE, 'Modern minimalist LED desk lamp with adjustable brightness');
