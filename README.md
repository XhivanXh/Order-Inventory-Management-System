# Order Inventory Management System

A full stack inventory management web application built for small retailers and warehouses.

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MySQL

## Features
- Add, edit and delete products
- Live search and category filter
- Stock status tracking (In Stock, Low Stock, Out of Stock)
- Dashboard with total products, total value and low stock count
- REST APIs for all CRUD operations
- Data persists in MySQL database

## Prerequisites
Make sure you have these installed before running the project:
- [Node.js](https://nodejs.org/)
- [MySQL](https://dev.mysql.com/downloads/installer/)

## Database Setup
Run these SQL commands in MySQL:

CREATE DATABASE inventory_db;
USE inventory_db;
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    price DECIMAL(10,2),
    quantity INT,
    description TEXT
);

## How to Run

### Backend
1. Go to backend folder
2. Create a `.env` file (see `.env.example`)
3. Run `npm install`
4. Run `node server.js`

### Frontend
Open `frontend/inventory.html` in browser using Live Server
