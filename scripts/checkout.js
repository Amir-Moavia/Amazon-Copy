
function renderCheckoutHeader() {
  const cartQuantity = calculateCartQuantity();
  document.querySelector('.checkout-header-middle-section').innerHTML = `
    Checkout (<a class="return-to-home-link" href="amazon.html">${cartQuantity} item${cartQuantity !== 1 ? 's' : ''}</a>)
  `;
}


function renderOrderSummary() {
  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProduct;
    products.forEach((product) => {
      if (product.id === productId) {
        matchingProduct = product;
      }
    });

    if (!matchingProduct) return;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              $${(matchingProduct.priceCents / 100).toFixed(2)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                Update
              </span>
              <input class="quantity-input js-quantity-input-${matchingProduct.id}" type="number" min="1" max="99" value="${cartItem.quantity}">
              <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}" style="display: none;">
                Save
              </span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${renderDeliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  if (cart.length === 0) {
    cartSummaryHTML = `
      <div class="empty-cart-message">
        <p>Your cart is empty.</p>
        <a class="button-primary" href="amazon.html" style="display:inline-block; padding:10px 20px; text-decoration:none; margin-top:10px; border-radius:8px;">
          View products
        </a>
      </div>
    `;
  }

  document.querySelector('.order-summary').innerHTML = cartSummaryHTML;


  attachDeleteListeners();
  attachUpdateListeners();
  attachDeliveryOptionListeners();
}


function renderDeliveryOptionsHTML(matchingProduct, cartItem) {
  let html = '';

  deliveryOptions.forEach((deliveryOption) => {
    const dateString = calculateDeliveryDate(deliveryOption);
    const priceString = deliveryOption.priceCents === 0
      ? 'FREE'
      : `$${(deliveryOption.priceCents / 100).toFixed(2)} -`;
    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html += `
      <div class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}">
        <input type="radio" ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
    `;
  });

  return html;
}


function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {
    let matchingProduct;
    products.forEach((product) => {
      if (product.id === cartItem.productId) {
        matchingProduct = product;
      }
    });

    if (!matchingProduct) return;

    productPriceCents += matchingProduct.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = Math.round(totalBeforeTaxCents * 0.1);
  const totalCents = totalBeforeTaxCents + taxCents;
  const cartQuantity = calculateCartQuantity();

  const paymentSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${cartQuantity}):</div>
      <div class="payment-summary-money">$${(productPriceCents / 100).toFixed(2)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${(shippingPriceCents / 100).toFixed(2)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${(totalBeforeTaxCents / 100).toFixed(2)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${(taxCents / 100).toFixed(2)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${(totalCents / 100).toFixed(2)}</div>
    </div>

    <button class="place-order-button button-primary js-place-order-button"
      ${cart.length === 0 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
      Place your order
    </button>
  `;

  document.querySelector('.payment-summary').innerHTML = paymentSummaryHTML;


  const placeOrderButton = document.querySelector('.js-place-order-button');
  if (placeOrderButton && cart.length > 0) {
    placeOrderButton.addEventListener('click', () => {
      placeOrder();
    });
  }
}


function attachDeleteListeners() {
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);


      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      if (container) {
        container.style.transition = 'opacity 0.3s, transform 0.3s';
        container.style.opacity = '0';
        container.style.transform = 'translateX(-20px)';
        setTimeout(() => {
          renderOrderSummary();
          renderPaymentSummary();
          renderCheckoutHeader();
        }, 300);
      }
    });
  });
}


function attachUpdateListeners() {
  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.add('is-editing-quantity');

      const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
      const saveLink = link.nextElementSibling.nextElementSibling;


      quantityInput.style.display = 'inline-block';
      saveLink.style.display = 'inline';
      link.style.display = 'none';

      quantityInput.focus();
      quantityInput.select();


      quantityInput.addEventListener('keydown', function handler(event) {
        if (event.key === 'Enter') {
          saveQuantity(productId);
          quantityInput.removeEventListener('keydown', handler);
        }
      });
    });
  });

  document.querySelectorAll('.js-save-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      saveQuantity(productId);
    });
  });
}

function saveQuantity(productId) {
  const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
  const newQuantity = Number(quantityInput.value);

  if (newQuantity < 1 || newQuantity > 99) {
    alert('Quantity must be between 1 and 99');
    return;
  }

  updateQuantity(productId, newQuantity);
  renderOrderSummary();
  renderPaymentSummary();
  renderCheckoutHeader();
}

function attachDeliveryOptionListeners() {
  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const productId = element.dataset.productId;
      const deliveryOptionId = element.dataset.deliveryOptionId;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}


function placeOrder() {
  if (cart.length === 0) return;

  const orderId = generateOrderId();
  const orderItems = [];

  cart.forEach((cartItem) => {
    let matchingProduct;
    products.forEach((product) => {
      if (product.id === cartItem.productId) {
        matchingProduct = product;
      }
    });

    if (!matchingProduct) return;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    const estimatedDeliveryDate = calculateDeliveryDate(deliveryOption);

    orderItems.push({
      productId: matchingProduct.id,
      productName: matchingProduct.name,
      productImage: matchingProduct.image,
      priceCents: matchingProduct.priceCents,
      quantity: cartItem.quantity,
      estimatedDeliveryDate: estimatedDeliveryDate
    });
  });

  const order = {
    id: orderId,
    orderDate: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    }),
    totalCents: calculateOrderTotal(),
    items: orderItems
  };

  addOrder(order);
  clearCart();

  window.location.href = 'orders.html';
}

function calculateOrderTotal() {
  let totalCents = 0;
  cart.forEach((cartItem) => {
    let matchingProduct;
    products.forEach((product) => {
      if (product.id === cartItem.productId) {
        matchingProduct = product;
      }
    });
    if (!matchingProduct) return;

    totalCents += matchingProduct.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    totalCents += deliveryOption.priceCents;
  });

  const tax = Math.round(totalCents * 0.1);
  totalCents += tax;
  return totalCents;
}

function generateOrderId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


renderCheckoutHeader();
renderOrderSummary();
renderPaymentSummary();
