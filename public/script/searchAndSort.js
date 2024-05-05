const products = []; // Declare the products array in the global scope
let searchedProducts = [];

document.addEventListener("DOMContentLoaded", async () => {
  // Fetch all products from the backend
  try {
    const response = await fetch("/items");
    products.push(...(await response.json())); // Populate the products array
    searchedProducts = products;
    displayProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
});

//Munculin barang sesuai search
function searchProducts(query) {
  const searchQuery = query.trim().toLowerCase();
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery)
  );
  searchedProducts = filteredProducts;
  displayProducts(filteredProducts);
}
//Munculin barang urutan turun sesuai properti
function sortBy_Desc(property) {
  console.log("sorting item by", property);
  const sortedProducts = searchedProducts
    .slice()
    .sort((a, b) => a[property] - b[property]);
  displayProducts(sortedProducts);
}
//Munculin barang urutan naik sesuai properti
function sortBy_Asc(property) {
  console.log("sorting item by", property);
  const sortedProducts = searchedProducts
    .slice()
    .sort((a, b) => b[property] - a[property]);
  displayProducts(sortedProducts);
}

//Munculin barang dalam range tertentu
function sortByRange(property, min_value, max_value) {
  const productsInRange = searchedProducts.filter(
    (product) =>
      product[property] >= min_value && product[property] <= max_value
  );
  displayProducts(productsInRange);
}

//clear search
function clearSearch() {
  const searchInput = document.getElementById("searchInput");
  searchInput.value = "";
  searchProducts("");
}

//Generate item sesuai sama produk
function displayProducts(products) {
  const productContainer = document.getElementById("grid-container");
  productContainer.innerHTML = "";

  products.forEach((product) => {
    // menghitung rata-rata rating
    const rating =
      product.ratings.length > 0
        ? product.ratings.reduce((acc, rating) => acc + rating, 0) /
          product.ratings.length
        : 0;

    // Add the calculated rating to the product object
    product.rating = rating;

    // Generate the item HTML
    const itemHTML = `
      <div class="item-container">
        <div class="item-image-container">
          <a href="/detail/${product.id}">
            <img src="${product.bigImage}" alt="${product.name}" />
          </a>
          <a class="cartButton" onclick="addToCart('${userID}','${
      product._id
    }')"><i class="fa fa-shopping-cart"></i></a>
        </div>   
        <div class="item-desc">
          <div class="item-property">
            <div class="item-name">${product.name}</div>
            <div class="item-price">
              ${new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(product.price)}
            </div>
          </div>
          <div class="item-rating">
            <a href="/detail/${product.id}" class="btnBeli">Beli</a>      
            <ul class="star-rating">
              <li>${rating.toFixed(2)}</li>
              <li><i class="fa fa-star"></i></li>
            </ul>
          </div>
        </div>
      </div>`;

    // Append the item HTML to the productContainer
    productContainer.innerHTML += itemHTML;
  });
}
