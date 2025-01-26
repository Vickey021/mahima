async function addSale() {
    const product_id = document.getElementById('productId').value;
    const party_name = document.getElementById('partyName').value;
    const rate = document.getElementById('rate').value;
    const date = document.getElementById('date').value;
    const payment_status = document.getElementById('paymentStatus').value;
  
    if (!product_id || !party_name || !rate || !date || !payment_status) {
      alert('Please fill in all fields');
      return;
    }
  
    try {
      console.log("Checking product ID in the buy table...");
      const buyResponse = await fetch('/api/buy');
      const buyData = await buyResponse.json();
      console.log("Buy table data:", buyData);
  
      const validProduct = buyData.some(product => product.id === parseInt(product_id));
      if (!validProduct) {
        alert('Invalid Product ID. Please enter a valid ID from the buy table.');
        return;
      }
  
      console.log("Valid Product ID. Proceeding to add sale...");
      const response = await fetch('/api/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id, party_name, rate, date, payment_status }),
      });
  
      const result = await response.json();
      console.log("Add Sale Response:", result);
  
      if (result.success) {
        alert('Sale added successfully!');
        loadSales();
      } else {
        alert(`Failed to add sale: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding sale:', error);
      alert('An error occurred while adding the sale.');
    }
  }
  
  
  async function loadSales() {
    try {
      console.log("Fetching sales data...");
      const response = await fetch('/api/sell');
      console.log("Raw Response:", response);
  
      if (!response.ok) {
        throw new Error(`Server Error: ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log("Parsed Result:", result);
  
      const data = result.data; // Check for the data key
      if (!Array.isArray(data)) {
        throw new Error("Expected an array but received: " + typeof data);
      }
  
      const tableBody = document.getElementById('sellTableBody');
      tableBody.innerHTML = ''; // Clear existing rows
  
      data.forEach(sale => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', sale.id);
        row.innerHTML = `
          <td data-label="ID=">${sale.id}</td>
          <td data-label="Product_ID=">${sale.product_id}</td>
          <td data-label="Product Name=">${sale.product_name}</td>
          <td data-label="Party Name=">${sale.party_name}</td>
          <td data-label="Rate=">${sale.rate}</td>
          <td data-label="Date=">${new Date(sale.date).toLocaleDateString()}</td>
          <td data-label="Payment Status=">${sale.payment_status}</td>
           <td data-label="Actions=">
         
          <button onclick="deleteSale(${sale.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error("Error loading sales data:", error);
      alert("An error occurred while loading sales data.");
    }
  }
  
  async function deleteSale(id) {
    try {
      const response = await fetch(`/api/sell/${id}`, { method: 'DELETE' });
  
      if (response.ok) {
        // Assume the deletion was successful
        alert("Sale deleted successfully!");
        loadSales(); // Refresh the table after deletion
      } else {
        // Handle server errors
        const errorMessage = await response.text(); // Get the response body as text
        alert(`Failed to delete sale: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error deleting sale:", error);
      alert("An error occurred while deleting the sale.");
    }
  }
  
  // Call loadSales on page load to show existing sales
  loadSales();
  
   window.onload = function () {
        loadSales();
      };
  
  
      
  
  window.onload = function () {
        loadSales();
      };
  