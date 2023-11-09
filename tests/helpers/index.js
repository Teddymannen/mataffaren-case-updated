const baseUrl = 'http://localhost:4000';

let env = {};

const sortingInfo = {
  'topRated': { sortParameter: 'ranking', 'asc': false },
  'name-asc': { sortParameter: 'name', 'asc': true },
  'name-desc': { sortParameter: 'name', 'asc': false },
  'price-asc': { sortParameter: 'priceValue', 'asc': true },
  'price-desc': { sortParameter: 'priceValue', 'asc': false },
  'compareprice-asc': { sortParameter: 'comparePrice', 'asc': true },
  'compareprice-desc': { sortParameter: 'comparePrice', 'asc': false }
};



/**
 * Get category and all child categories in a single list, recursively
 * @param category - A category that has a list of children
 * @returns {Array} All categories in an array
 */
function getAllCategories(category) {
  const categories = [category];
  for (const childCategory of category.children) {
    const childCategories = getAllCategories(childCategory);
    categories.push(...childCategories);
  }
  return categories;
}


export { baseUrl, getAllCategories, sortingInfo, env };