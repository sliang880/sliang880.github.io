const API_URL = '/api'

const token = localStorage.getItem('token')

if (!token) {
  window.location.href = 'index.html'
  throw new Error('No token')
}

function authHeader() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

document.getElementById('userName').textContent = localStorage.getItem('userName') || 'Admin'

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userName')
  window.location.href = 'index.html'
})

async function getProducts() {
  const res = await fetch(`${API_URL}/products`, {
    method: 'GET',
    headers: authHeader()
  })

  const products = await res.json()

  if (!res.ok) {
    document.getElementById('productsGrid').textContent = products.message || 'Failed to load products'
    return
  }

  renderProducts(products)
}

function renderProducts(products) {
  const container = document.getElementById('productsGrid')

  container.innerHTML = ''

  if (products.length === 0) {
    container.textContent = 'No products yet. Add one above!'
    return
  }

  products.forEach(product => {
    const div = document.createElement('div')
    div.className = 'product-card'
    div.innerHTML = `
      <div class="card-header">
        <span class="card-category">${product.category}</span>
        <span class="card-status status-${product.status}">${product.status}</span>
      </div>
      <p class="product-name"><strong>${product.name}</strong></p>
      <p class="product-description">${product.description || ''}</p>
      <div class="product-meta">
        <span class="product-price">$${Number(product.price).toFixed(2)}</span>
        <span class="product-duration">${product.duration}</span>
      </div>
      <div class="card-actions">
        <button class="btn-edit" onclick="startEdit('${product._id}', '${product.name}', '${product.category}', ${product.price}, '${product.duration}', '${product.description}', '${product.status}')">Edit</button>
        <button class="btn-delete" onclick="deleteProduct('${product._id}')">Delete</button>
      </div>
      <hr>
    `
    container.appendChild(div)
  })
}

document.getElementById('createForm').addEventListener('submit', async (e) => {
  e.preventDefault()

  const name = document.getElementById('name').value
  const category = document.getElementById('category').value
  const price = document.getElementById('price').value
  const duration = document.getElementById('duration').value
  const description = document.getElementById('description').value
  const status = document.getElementById('status').value

  if (!name || !category || !price) {
    document.getElementById('createMsg').className = 'msg-error'
    document.getElementById('createMsg').textContent = 'Please fill in required fields'
    return
  }

  try {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify({ name, category, price, duration, description, status })
    })

    const data = await res.json()

    if (!res.ok) {
      document.getElementById('createMsg').className = 'msg-error'
      document.getElementById('createMsg').textContent = data.message || 'Failed to create product'
      return
    }

    document.getElementById('createMsg').className = 'msg-success'
    document.getElementById('createMsg').textContent = 'Product created!'
    document.getElementById('createForm').reset()
    getProducts()

  } catch (err) {
    document.getElementById('createMsg').className = 'msg-error'
    document.getElementById('createMsg').textContent = 'Could not connect to server'
  }
})

async function deleteProduct(id) {
  const confirmed = confirm('Are you sure you want to delete this product?')
  if (!confirmed) return

  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: authHeader()
  })

  const data = await res.json()

  if (!res.ok) {
    alert(data.message || 'Failed to delete product')
    return
  }

  getProducts()
}

function startEdit(id, name, category, price, duration, description, status) {
  document.getElementById('editSection').style.display = 'block'
  document.getElementById('editId').value = id
  document.getElementById('editName').value = name
  document.getElementById('editCategory').value = category
  document.getElementById('editPrice').value = price
  document.getElementById('editDuration').value = duration || ''
  document.getElementById('editDescription').value = description || ''
  document.getElementById('editStatus').value = status
  document.getElementById('editMsg').textContent = ''
  document.getElementById('editSection').scrollIntoView()
}

document.getElementById('cancelEditBtn').addEventListener('click', () => {
  document.getElementById('editSection').style.display = 'none'
})

document.getElementById('saveEditBtn').addEventListener('click', async () => {
  const id = document.getElementById('editId').value
  const name = document.getElementById('editName').value
  const category = document.getElementById('editCategory').value
  const price = document.getElementById('editPrice').value
  const duration = document.getElementById('editDuration').value
  const description = document.getElementById('editDescription').value
  const status = document.getElementById('editStatus').value

  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: authHeader(),
    body: JSON.stringify({ name, category, price, duration, description, status })
  })

  const data = await res.json()

  if (!res.ok) {
    document.getElementById('editMsg').className = 'msg-error'
    document.getElementById('editMsg').textContent = data.message || 'Failed to update'
    return
  }

  document.getElementById('editMsg').className = 'msg-success'
  document.getElementById('editMsg').textContent = 'Product updated!'
  document.getElementById('editSection').style.display = 'none'
  getProducts()
})

getProducts()
