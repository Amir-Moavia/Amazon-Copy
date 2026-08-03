
const cartQuantity = calculateCartQuantity();
document.querySelector('.cart-quantity').innerHTML = cartQuantity;


const url = new URL(window.location.href);
const orderId = url.searchParams.get('orderId');
const productId = url.searchParams.get('productId');


function renderTracking() {
  const order = getOrder(orderId);

  if (!order) {
    document.querySelector('.order-tracking').innerHTML = `
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>
      <div style="text-align:center; padding:40px;">
        <p style="font-size:18px; color:#555;">Order not found.</p>
      </div>
    `;
    return;
  }

  let matchingItem;
  order.items.forEach((item) => {
    if (item.productId === productId) {
      matchingItem = item;
    }
  });

  if (!matchingItem) {
    document.querySelector('.order-tracking').innerHTML = `
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>
      <div style="text-align:center; padding:40px;">
        <p style="font-size:18px; color:#555;">Product not found in this order.</p>
      </div>
    `;
    return;
  }


  const currentDate = new Date();
  const orderDate = new Date();

  const deliveryDateStr = matchingItem.estimatedDeliveryDate;


  let progressPercentage = 25;
  let currentStatus = 'Preparing';


  const orderTimestamp = new Date(order.orderDate + ', ' + new Date().getFullYear());
  const daysSinceOrder = Math.floor((currentDate - orderTimestamp) / (1000 * 60 * 60 * 24));

  if (daysSinceOrder >= 5) {
    progressPercentage = 100;
    currentStatus = 'Delivered';
  } else if (daysSinceOrder >= 2) {
    progressPercentage = 60;
    currentStatus = 'Shipped';
  } else {
    progressPercentage = 25;
    currentStatus = 'Preparing';
  }

  document.querySelector('.order-tracking').innerHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      Arriving on ${matchingItem.estimatedDeliveryDate}
    </div>

    <div class="product-info">
      ${matchingItem.productName}
    </div>

    <div class="product-info">
      Quantity: ${matchingItem.quantity}
    </div>

    <img class="product-image" src="${matchingItem.productImage}">

    <div class="progress-labels-container">
      <div class="progress-label ${currentStatus === 'Preparing' ? 'current-status' : ''}">
        Preparing
      </div>
      <div class="progress-label ${currentStatus === 'Shipped' ? 'current-status' : ''}">
        Shipped
      </div>
      <div class="progress-label ${currentStatus === 'Delivered' ? 'current-status' : ''}">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${progressPercentage}%;"></div>
    </div>
  `;
}

renderTracking();
