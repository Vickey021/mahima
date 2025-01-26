 // Function to add product to table and database
 async function addProduct() {
    const product_name = document.getElementById('productName').value;
    const party_name = document.getElementById('partyName').value;
    const rate = document.getElementById('rate').value;
    const payment_status = document.getElementById('paymentStatus').value;
    const date = document.getElementById('date').value;
  
    const response = await fetch('/api/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_name, party_name, rate, payment_status, date }),
    });
  
    const result = await response.json();
    if (result.success) {
      loadProducts(); // Reload the products after adding
    } else {
      console.error(result.message);
    }
  }
  
  
      // Function to load all products from the database and display them in the table
      // Function to load all products from the database and display them in the table
  // Function to load all products from the database and display them in the table
  async function loadProducts() {
    const response = await fetch('/api/buy');
    const data = await response.json();
    const tableBody = document.getElementById('buyTableBody');
    tableBody.innerHTML = '';
  
    // Helper function to format the date correctly
    function formatDate(dateString) {
      const date = new Date(dateString);  // Converts to Date object
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;  // Format it as dd-mm-yyyy
    }
  
    // Populate the table with products
    data.forEach(product => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td data-label="ID">${product.id}</td>
        <td data-label="Product Name">${product.product_name}</td>
        <td data-label="Party Name">${product.party_name}</td>
        <td data-label="Rate">${product.rate}</td>
        <td data-label="Payment Status">${product.payment_status}</td>
        <td data-label="Date">${formatDate(product.date)}</td> <!-- Format the date here -->
        <td data-label="Actions">
          <button onclick="editProduct(${product.id})">Edit</button>
          <button onclick="deleteProduct(${product.id})">Delete</button>
        </td>
      `;
      row.setAttribute('data-id', product.id); // Add the data-id attribute
      tableBody.appendChild(row);
    });
  }
  
  
  
      // Function to delete product
      async function deleteProduct(id) {
        try{
        const response = await fetch(`/api/buy/${id}`, { method: 'DELETE' });
        if (response.ok) {
        // Assume the deletion was successful
        alert("buy deleted successfully!");
        loadProducts(); // Refresh the table after deletion
      }  else {
        // Handle server errors
        const errorMessage = await response.text(); // Get the response body as text
        alert(`Failed to delete sale: ${errorMessage}`);
      }
       
      } catch (error) {
      console.error("Error deleting sale:", error);
      alert("An error occurred while deleting the buy.");
      }
    }
     
  
      // Call loadProducts on page load to show existing products
      loadProducts();
  
  // edit buy record
      let currentEditingId = null; // Store the ID of the product being edited
  
  // Function to display the edit form with pre-filled values
  function editProduct(id) {
    // Fetch product details by ID (could be from the table or server)
    const row = document.querySelector(`tr[data-id="${id}"]`);
    const product_name = row.querySelector('td[data-label="Product Name"]').innerText;
    const party_name = row.querySelector('td[data-label="Party Name"]').innerText;
    const rate = row.querySelector('td[data-label="Rate"]').innerText;
    const payment_status = row.querySelector('td[data-label="Payment Status"]').innerText;
    const date = row.querySelector('td[data-label="Date"]').innerText;
  
    // Pre-fill the form fields
    document.getElementById('editProductName').value = product_name;
    document.getElementById('editPartyName').value = party_name;
    document.getElementById('editRate').value = rate;
    document.getElementById('editPaymentStatus').value = payment_status;
    document.getElementById('editDate').value = date;
  
    // Store the current ID and show the form
    currentEditingId = id;
    
    document.getElementById('editFormContainer').style.display = 'block';
  }
  
  // Function to hide the edit form
  function hideEditForm() {
    document.getElementById('editFormContainer').style.display = 'none';
    currentEditingId = null;
  }
  
  // Function to update the product
  async function updateProduct() {
    const product_name = document.getElementById('editProductName').value;
    const party_name = document.getElementById('editPartyName').value;
    const rate = document.getElementById('editRate').value;
    const payment_status = document.getElementById('editPaymentStatus').value;
    const date = document.getElementById('editDate').value;
  
    // Validate inputs
    if (!product_name || !party_name || !rate || !payment_status || !date) {
      alert('All fields are required.');
      return;
    }
  
    try {
      // Send the updated product details to the server
      const response = await fetch(`/api/buy/${currentEditingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_name, party_name, rate, payment_status, date }),
      });
  
      const result = await response.json();
      if (result.success) {
        alert('Product updated successfully!');
        hideEditForm();
        loadProducts(); // Reload the products after editing
      } else {
        alert(`Failed to update product: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('An error occurred while updating the product.');
    }
  }
  window.onload = function () {
    loadProducts();
      };