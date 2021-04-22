const faker = require('faker');
const fs = require('fs');

//faker.setLocale('vi');

function randomNumber(min, max) {
  const r = Math.random() * (max - min) + min
  return Math.floor(r)
}

const randomCategoriesList = (n) => {
  let result = [];

  if (n <= 0) { return result; }

  for (let i = 0; i < n; i++) {
    let category = {
      id: i + 1,
      name: faker.commerce.department(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    result.push(category);
  }

  return result;
}

const randomProductsList = (categories, minQ, maxQ) => {
  let products = [];
  let k = 0;

  categories.forEach(category => {
    for (let i = 0; i < randomNumber(minQ, maxQ); i++) {
      let product = {
        categoryId: category.id,
        id: faker.datatype.uuid(),
        name: faker.commerce.productName(),
        desc: faker.commerce.productDescription(),
        color: faker.commerce.color(),
        price: Number.parseFloat(faker.commerce.price()),
        thumbnailUrl: faker.image.imageUrl(400, 400),
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      products.push(product);
    }
  });
  return products;
}

(() => {
  let listCategories = randomCategoriesList(10);
  let listProducts = randomProductsList(listCategories, 3, 16);

  const db = {
    categories: listCategories,
    products: listProducts
  };

  fs.writeFile('db.json', JSON.stringify(db), () => {
    console.log('Generate data successfully');
  })
})();