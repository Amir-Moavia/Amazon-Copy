

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId, quantity = 1) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId: productId,
      quantity: quantity,
      deliveryOptionId: '1'
    });
  }

  saveToStorage();
}

function removeFromCart(productId) {
  cart = cart.filter((cartItem) => cartItem.productId !== productId);
  saveToStorage();
}

function updateQuantity(productId, newQuantity) {
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      cartItem.quantity = newQuantity;
    }
  });
  saveToStorage();
}

function updateDeliveryOption(productId, deliveryOptionId) {
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      cartItem.deliveryOptionId = deliveryOptionId;
    }
  });
  saveToStorage();
}

function calculateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  return cartQuantity;
}

function clearCart() {
  cart = [];
  saveToStorage();
}
