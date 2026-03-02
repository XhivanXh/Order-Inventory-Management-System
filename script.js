// ===== DATA STORE =====
let products = [];
let editingId = null;

// ===== DOM ELEMENTS =====
const tbody = document.getElementById('products-tbody');
const searchInput = document.getElementById('search-input');
const filterCategory = document.getElementById('filter-category');
const filterStock = document.getElementById('filter-stock');
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalConfirm = document.getElementById('modal-confirm');

// ===== HELPER: GET STATUS =====
function getStatus(quantity) {
  if (quantity === 0) return 'out-of-stock';
  if (quantity <= 5) return 'low-stock';
  return 'in-stock';
}

function getStatusLabel(status) {
  if (status === 'out-of-stock') return 'Out of Stock';
  if (status === 'low-stock') return 'Low Stock';
  return 'In Stock';
}

// ===== UPDATE DASHBOARD =====
function updateDashboard() {
  const total = products.length;
  const lowStock = products.filter(p => getStatus(p.quantity) === 'low-stock').length;
  const outOfStock = products.filter(p => getStatus(p.quantity) === 'out-of-stock').length;
  const categories = [...new Set(products.map(p => p.category))].length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  document.getElementById('total-products').textContent = total;
  document.getElementById('low-stock').textContent = lowStock + outOfStock;
  document.getElementById('total-categories').textContent = categories;
  document.getElementById('total-value').textContent = '$' + totalValue.toFixed(2);
}

// ===== RENDER TABLE =====
function renderTable() {
  const searchVal = searchInput.value.toLowerCase();
  const catVal = filterCategory.value;
  const stockVal = filterStock.value;

  // Filter products
  let filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchVal) ||
                        p.category.toLowerCase().includes(searchVal);
    const matchCat = catVal === '' || p.category === catVal;
    const matchStock = stockVal === '' || getStatus(p.quantity) === stockVal;
    return matchSearch && matchCat && matchStock;
  });

  // No products
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#aaa;">No products found.</td></tr>`;
    return;
  }

  // Build rows
  tbody.innerHTML = filtered.map((p, index) => {
    const status = getStatus(p.quantity);
    return `
      <tr>
        <td>${index + 1}</td>
        <td>${p.name}</td>
        <td style="text-transform: capitalize">${p.category}</td>
        <td>$${parseFloat(p.price).toFixed(2)}</td>
        <td>${p.quantity}</td>
        <td><span class="badge badge-${status}">${getStatusLabel(status)}</span></td>
        <td>
          <button class="btn-edit" onclick="openEditModal(${p.id})">Edit</button>
          <button class="btn-delete" onclick="openDeleteModal(${p.id})">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

// ===== ADD PRODUCT =====
document.getElementById('btn-add').addEventListener('click', () => {
  const name = document.getElementById('product-name').value.trim();
  const category = document.getElementById('product-category').value;
  const price = parseFloat(document.getElementById('product-price').value);
  const quantity = parseInt(document.getElementById('product-quantity').value);
  const description = document.getElementById('product-description').value.trim();

  // Basic validation
  if (!name || !category || isNaN(price) || isNaN(quantity)) {
    alert('Please fill in all required fields!');
    return;
  }

  const newProduct = {
    id: Date.now(),
    name,
    category,
    price,
    quantity,
    description
  };

  products.push(newProduct);
  clearForm();
  renderTable();
  updateDashboard();
});

// ===== CLEAR FORM =====
document.getElementById('btn-clear').addEventListener('click', clearForm);

function clearForm() {
  document.getElementById('product-name').value = '';
  document.getElementById('product-category').value = '';
  document.getElementById('product-price').value = '';
  document.getElementById('product-quantity').value = '';
  document.getElementById('product-description').value = '';
}

// ===== SEARCH & FILTER =====
searchInput.addEventListener('input', renderTable);
filterCategory.addEventListener('change', renderTable);
filterStock.addEventListener('change', renderTable);

// ===== OPEN EDIT MODAL =====
function openEditModal(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  editingId = id;
  modalTitle.textContent = 'Edit Product';
  modalBody.innerHTML = `
    <div class="form-group" style="margin-bottom:14px;">
      <label>Product Name</label>
      <input type="text" id="edit-name" value="${product.name}"
        style="padding:9px 12px; border:1px solid #ddd; border-radius:6px; width:100%; font-size:14px;" />
    </div>
    <div class="form-group" style="margin-bottom:14px;">
      <label>Category</label>
      <select id="edit-category"
        style="padding:9px 12px; border:1px solid #ddd; border-radius:6px; width:100%; font-size:14px;">
        <option value="electronics" ${product.category === 'electronics' ? 'selected' : ''}>Electronics</option>
        <option value="clothing" ${product.category === 'clothing' ? 'selected' : ''}>Clothing</option>
        <option value="food" ${product.category === 'food' ? 'selected' : ''}>Food</option>
        <option value="furniture" ${product.category === 'furniture' ? 'selected' : ''}>Furniture</option>
      </select>
    </div>
    <div class="form-group" style="margin-bottom:14px;">
      <label>Price ($)</label>
      <input type="number" id="edit-price" value="${product.price}" min="0" step="0.01"
        style="padding:9px 12px; border:1px solid #ddd; border-radius:6px; width:100%; font-size:14px;" />
    </div>
    <div class="form-group">
      <label>Quantity</label>
      <input type="number" id="edit-quantity" value="${product.quantity}" min="0"
        style="padding:9px 12px; border:1px solid #ddd; border-radius:6px; width:100%; font-size:14px;" />
    </div>
  `;

  modalConfirm.onclick = saveEdit;
  modalOverlay.classList.remove('hidden');
}

// ===== SAVE EDIT =====
function saveEdit() {
  const product = products.find(p => p.id === editingId);
  if (!product) return;

  product.name = document.getElementById('edit-name').value.trim();
  product.category = document.getElementById('edit-category').value;
  product.price = parseFloat(document.getElementById('edit-price').value);
  product.quantity = parseInt(document.getElementById('edit-quantity').value);

  closeModal();
  renderTable();
  updateDashboard();
}

// ===== OPEN DELETE MODAL =====
function openDeleteModal(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  editingId = id;
  modalTitle.textContent = 'Delete Product';
  modalBody.innerHTML = `<p style="color:#555;">Are you sure you want to delete <strong>${product.name}</strong>?</p>`;

  modalConfirm.onclick = confirmDelete;
  modalOverlay.classList.remove('hidden');
}

// ===== CONFIRM DELETE =====
function confirmDelete() {
  products = products.filter(p => p.id !== editingId);
  closeModal();
  renderTable();
  updateDashboard();
}

// ===== CLOSE MODAL =====
document.getElementById('modal-cancel').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

function closeModal() {
  modalOverlay.classList.add('hidden');
  editingId = null;
}

// ===== INITIAL RENDER =====
renderTable();
updateDashboard();