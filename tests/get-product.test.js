import Fetcher from './helpers/Fetcher.js';
import { baseUrl, env } from './helpers/index.js';

let productCodes = env.productCodes;

// What to do if there are no product codes in env
if (!productCodes) {
  const categoryTreeUrl = `${baseUrl}/api/leftMenu/categorytree`;
  const { data } = await Fetcher.getCached(categoryTreeUrl);
  const categories = data.children;
  productCodes = await getProductCodes(categories);
}

// Test all products
for (const productCode of productCodes) {
  const responseInfo = await Fetcher.getCached(`${baseUrl}/api/axfood/rest/p/${productCode}`);

  describe('Product ' + responseInfo.data.name + ' ' + productCode, () => {
    testEndpointData(responseInfo);
  });
}

function testEndpointData({ response, data, responseTime }) {

  // const { response, data, responseTime } = Fetcher.getCached(url);
  test('Status code is 200', () => {
    expect(response.status).toBe(200);
  });

  test('Response time is less than 1000ms', () => {
    expect(responseTime).toBeLessThan(1000);
  });

  test('Product has necessary properties', () => {
    expect(data).toHaveProperty('name');
    expect(data).toHaveProperty('image').withProperty('url');
    expect(data).toHaveProperty('price');
    expect(data).toHaveProperty('priceUnit');
    expect(data).toHaveProperty('description');
  });
}

async function getProductCodes(categories) {
  const productCodes = [];

  for (const category of categories) {
    const url = `${baseUrl}/api/c/${category.url}?size=100&page=0&sort=topRated`;
    const { data } = await Fetcher.getCached(url);
    productCodes.push(data.results[0].code);
  }
  return productCodes;
}
