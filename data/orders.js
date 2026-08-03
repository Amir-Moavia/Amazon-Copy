
let orders = JSON.parse(localStorage.getItem('orders')) || [];

function saveOrdersToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}

function addOrder(order) {
  orders.unshift(order);
  saveOrdersToStorage();
}

function getOrder(orderId) {
  let matchingOrder;
  orders.forEach((order) => {
    if (order.id === orderId) {
      matchingOrder = order;
    }
  });
  return matchingOrder;
}
