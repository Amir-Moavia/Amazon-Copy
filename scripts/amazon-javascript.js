
const addedMessageTimeouts = {};

updateCartQuantity();


function renderProducts(filteredProducts) {
  let productHTML = '';

  filteredProducts.forEach((product) => {
    productHTML += `
      <div class="product-container" data-product-id="${product.id}">
        <div class="product-image-container">
          <img class="product-image"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="images/ratings/rating-${product.rating.stars * 10}.png">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          $${(product.priceCents / 100).toFixed(2)}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector-${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${product.id}">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart"
          data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>`;
  });

  document.querySelector('.product-js-html').innerHTML = productHTML;

  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
      const quantity = Number(quantitySelector.value);

      addToCart(productId, quantity);
      updateCartQuantity();
      showAddedMessage(productId);
    });
  });
}


renderProducts(products);


function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();
  document.querySelector('.cart-quantity').innerHTML = cartQuantity;
}


function showAddedMessage(productId) {
  const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);
  addedMessage.classList.add('added-to-cart-visible');


  if (addedMessageTimeouts[productId]) {
    clearTimeout(addedMessageTimeouts[productId]);
  }

  const timeoutId = setTimeout(() => {
    addedMessage.classList.remove('added-to-cart-visible');
  }, 2000);

  addedMessageTimeouts[productId] = timeoutId;
}


const searchBar = document.querySelector('.search-bar');
const searchButton = document.querySelector('.search-button');

searchButton.addEventListener('click', () => {
  performSearch();
});

searchBar.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    performSearch();
  }
});

function performSearch() {
  const searchText = searchBar.value.toLowerCase().trim();

  if (searchText === '') {
    renderProducts(products);
    return;
  }

  const filteredProducts = products.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(searchText);
    let keywordMatch = false;
    product.keywords.forEach((keyword) => {
      if (keyword.toLowerCase().includes(searchText)) {
        keywordMatch = true;
      }
    });
    return nameMatch || keywordMatch;
  });

  renderProducts(filteredProducts);
}