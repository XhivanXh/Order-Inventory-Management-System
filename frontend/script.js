const API_URL = 'http://localhost:3000/api/products';

// ===== DASHBOARD =====
function updateDashboard(products) {
  const total = products.length;
  const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= 5).length;
  const outOfStock = products.filter(p => p.quantity === 0).length;
  const categories = [...new Set(products.map(p => p.category))].length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  document.getElementById('total-products').textContent = total;
  document.getElementById('low-stock').textContent = lowStock + outOfStock;
  document.getElementById('total-categories').textContent = categories;
  document.getElementById('total-value').textContent = '$' + totalValue.toFixed(2);
}

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

// ===== FETCH AND RENDER ALL PRODUCTS =====
async function fetchAndRender() {
  const searchVal = document.getElementById('search-input').value.toLowerCase();
  const catVal = document.getElementById('filter-category').value;
  const stockVal = document.getElementById('filter-stock').value;

  const response = await fetch(API_URL);
  const products = await response.json();

  updateDashboard(products);

  let filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchVal) ||
                        p.category.toLowerCase().includes(searchVal);
    const matchCat = catVal === '' || p.category === catVal;
    const matchStock = stockVal === '' || getStatus(p.quantity) === stockVal;
    return matchSearch && matchCat && matchStock;
  });

  const tbody = document.getElementById('products-tbody');

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#aaa;">No products found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((p, index) => {
    const status = getStatus(p.quantity);
    return `
      <tr>
        <td>${index + 1}</td>
        <td>${p.name}</td>
        <td style="text-transform:capitalize">${p.category}</td>
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
document.getElementById('btn-add').addEventListener('click', async () => {
  const name = document.getElementById('product-name').value.trim();
  const category = document.getElementById('product-category').value;
  const price = parseFloat(document.getElementById('product-price').value);
  const quantity = parseInt(document.getElementById('product-quantity').value);
  const description = document.getElementById('product-description').value.trim();

  if (!name || !category || isNaN(price) || isNaN(quantity)) {
    alert('Please fill in all required fields!');
    return;
  }

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, category, price, quantity, description })
  });

  clearForm();
  fetchAndRender();
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
document.getElementById('search-input').addEventListener('input', fetchAndRender);
document.getElementById('filter-category').addEventListener('change', fetchAndRender);
document.getElementById('filter-stock').addEventListener('change', fetchAndRender);

// ===== EDIT MODAL =====
async function openEditModal(id) {
  const response = await fetch(`${API_URL}/${id}`);
  const product = await response.json();

  document.getElementById('modal-title').textContent = 'Edit Product';
  document.getElementById('modal-body').innerHTML = `
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

  document.getElementById('modal-confirm').onclick = () => saveEdit(id);
  document.getElementById('modal-overlay').classList.remove('hidden');
}

// ===== SAVE EDIT =====
async function saveEdit(id) {
  const name = document.getElementById('edit-name').value.trim();
  const category = document.getElementById('edit-category').value;
  const price = parseFloat(document.getElementById('edit-price').value);
  const quantity = parseInt(document.getElementById('edit-quantity').value);

  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, category, price, quantity })
  });

  closeModal();
  fetchAndRender();
}

// ===== DELETE MODAL =====
async function openDeleteModal(id) {
  const response = await fetch(`${API_URL}/${id}`);
  const product = await response.json();

  document.getElementById('modal-title').textContent = 'Delete Product';
  document.getElementById('modal-body').innerHTML = `
    <p style="color:#555;">Are you sure you want to delete <strong>${product.name}</strong>?</p>
  `;

  document.getElementById('modal-confirm').onclick = () => confirmDelete(id);
  document.getElementById('modal-overlay').classList.remove('hidden');
}

// ===== CONFIRM DELETE =====
async function confirmDelete(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  closeModal();
  fetchAndRender();
}

// ===== CLOSE MODAL =====
document.getElementById('modal-cancel').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

// ===== INITIAL LOAD =====
fetchAndRender();