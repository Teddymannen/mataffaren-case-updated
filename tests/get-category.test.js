import Fetcher from './helpers/Fetcher.js';
import { baseUrl, sortingInfo, getAllCategories, env } from './helpers/index.js';

const sortingAlternatives = Object.keys(sortingInfo);

const categoryTreeUrl = `${baseUrl}/api/leftMenu/categorytree`;
const { data } = await Fetcher.getCached(categoryTreeUrl);
const categories = getAllCategories(data).filter(c => c.id !== 'N00');
// const categories = data.children;

for (let i = 0; i < categories.length; i++) {
  const category = categories[i];
  const sorting = sortingAlternatives[i % sortingAlternatives.length];
  const responseInfo = await Fetcher.getCached(`${baseUrl}/api/c/${category.url}?size=100&page=0&sort=${sorting}`);

  describe('category ' + category.url, () => {
    testEndpointData(responseInfo, { sorting });
  });
}

// --------------------------------------------------------------
// -------------------- TEST FUNCTIONS BELOW --------------------
// --------------------------------------------------------------

function testEndpointData({ response, data, responseTime }, variables) {

  // const { response, data, responseTime } = Fetcher.getCached(url);
  test('Status code is 200', () => {
    expect(response.status).toBe(200);
  });

  test('Response time is less than 1000ms', () => {
    expect(responseTime).toBeLessThan(1000);
  });

  test('There is at least 1 product in the category', () => {
    expect(data.results.length).toBeGreaterThanOrEqual(1);
  });

  test('Products in category have necessary properties', () => {
    for (const product of data.results) {
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('image.url');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('priceUnit');
    }
  });

  test('Product list is sorted ' + variables.sorting, () => {
    let sortInfo = sortingInfo[variables.sorting];
    let sortProperty = sortInfo.sortParameter;
    let isAscending = sortInfo.asc

    for (let i = 0; i < data.results.length - 1; i++) {
      let productA = data.results[i];
      let productB = data.results[i + 1];

      let propertyA = productA[sortProperty];
      let propertyB = productB[sortProperty];

      if (sortProperty === 'priceValue') {
        propertyA = getLowestPrice(productA);
        propertyB = getLowestPrice(productB);
      } else if (sortProperty === 'comparePrice') {
        propertyA = getLowestComparePrice(productA);
        propertyB = getLowestComparePrice(productB);
      }

      // console.log(productA, productB);
      expect(compareValues(propertyA, propertyB, isAscending)).toBeTruthy();
    }
  });
}


function getLowestPrice(product) {
  // No promotion return original price
  if (product.potentialPromotions.length === 0) { return product.priceValue; }

  // Promotion exist
  return product.potentialPromotions[0].price.value;
}

function getLowestComparePrice(product) {
  if (product.potentialPromotions.length === 0) { return parseComparePrice(product.comparePrice); }

  return parseComparePrice(product.potentialPromotions[0].comparePrice)
}

function parseComparePrice(comparePrice) {
  if (!comparePrice) { return Number.NaN; }
  return Number.parseFloat(comparePrice.replace(' ', '').replace(',', '.').replace('kr', ''));
}

/**
* Returns true if a comes before b
*/
function compareValues(a, b, ascending) {

  // console.log(a,b);
  // if a (compare)price doesn't exist it should always be at the bottom
  if (Number.isNaN(b)) {
    return true;
  } else if (Number.isNaN(a)) {
    // NaN should not exist before number (b is number and a is not)
    return false;
  }

  if (typeof a === 'number' && typeof b === 'number') {
    return ascending ? a <= b : a >= b;
  } else if (typeof a === 'string' && typeof b === 'string') {
    let x = a.localeCompare(b, 'sv', { sensitivity: 'base' });
    return ascending ? x <= 0 : x >= 0;
  }
}