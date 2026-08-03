
updateCartQuantityOnPage();

function updateCartQuantityOnPage() {
  const cartQuantity = calculateCartQuantity();
  document.querySelector('.cart-quantity').innerHTML = cartQuantity;
}


function renderOrders(searchText = '') {
  let ordersHTML = '';

  if (orders.length === 0) {
    ordersHTML = `
      <div class="empty-orders-message" style="text-align:center; padding:40px 20px;">
        <p style="font-size:18px; color:#555; margin-bottom:15px;">You have no orders yet.</p>
        <a class="button-primary" href="amazon.html" style="display:inline-block; padding:10px 20px; text-decoration:none; border-radius:8px;">
          Start shopping
        </a>
      </div>
    `;
  } else {
    orders.forEach((order) => {

      let filteredItems = order.items;
      if (searchText) {
        filteredItems = order.items.filter((item) =>
          item.productName.toLowerCase().includes(searchText.toLowerCase())
        );
      }


      if (filteredItems.length === 0) return;

      let itemsHTML = '';
      filteredItems.forEach((item) => {
        itemsHTML += `
          <div class="product-image-container">
            <img src="${item.productImage}">
          </div>

          <div class="product-details">
            <div class="product-name">
              ${item.productName}
            </div>
            <div class="product-delivery-date">
              Arriving on: ${item.estimatedDeliveryDate}
            </div>
            <div class="product-quantity">
              Quantity: ${item.quantity}
            </div>
            <button class="buy-again-button button-primary js-buy-again"
              data-product-id="${item.productId}">
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <span class="buy-again-message">Buy it again</span>
            </button>
          </div>

          <div class="product-actions">
            <a href="tracking.html?orderId=${order.id}&productId=${item.productId}">
              <button class="track-package-button button-secondary">
                Track package
              </button>
            </a>
          </div>
        `;
      });

      ordersHTML += `
        <div class="order-container">
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${order.orderDate}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${(order.totalCents / 100).toFixed(2)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>
            </div>
          </div>

          <div class="order-details-grid">
            ${itemsHTML}
          </div>
        </div>
      `;
    });

    if (ordersHTML === '') {
      ordersHTML = `
        <div style="text-align:center; padding:40px 20px;">
          <p style="font-size:18px; color:#555;">No orders match your search.</p>
        </div>
      `;
    }
  }

  document.querySelector('.orders-grid').innerHTML = ordersHTML;


  document.querySelectorAll('.js-buy-again').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      addToCart(productId, 1);
      updateCartQuantityOnPage();


      button.innerHTML = `
        <img class="buy-again-icon" src="images/icons/checkmark.png">
        <span class="buy-again-message">Added to cart</span>
      `;
      button.style.backgroundColor = '#067d62';
      button.style.color = 'white';
      button.style.borderColor = '#067d62';

      setTimeout(() => {
        button.innerHTML = `
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        `;
        button.style.backgroundColor = '';
        button.style.color = '';
        button.style.borderColor = '';
      }, 2000);
    });
  });
}

renderOrders();


const searchBar = document.querySelector('.search-bar');
const searchButton = document.querySelector('.search-button');

searchButton.addEventListener('click', () => {
  renderOrders(searchBar.value.trim());
});

searchBar.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    renderOrders(searchBar.value.trim());
  }
});
