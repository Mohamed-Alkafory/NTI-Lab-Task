const getDataBtn = document.getElementById("getDataBtn");
const cardsContainer = document.getElementById("cardsContainer");

getDataBtn.addEventListener("click", () => {
  cardsContainer.innerHTML = "";

  fetch("https://dummyjson.com/products")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);

      const products = data.products;

      products.forEach((product) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const img = document.createElement("img");
        img.src = product.thumbnail;

        const title = document.createElement("h3");
        title.textContent = product.title;

        const price = document.createElement("p");
        price.textContent = `$${product.price}`;

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(price);

        cardsContainer.appendChild(card);
      });
    })
    .catch((err) => {
      console.log(err);
      cardsContainer.innerHTML =
        "<p>Something went wrong while fetching data.</p>";
    });
});
