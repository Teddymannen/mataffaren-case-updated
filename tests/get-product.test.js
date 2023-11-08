import { describe, test, expect, env } from './testEngine/index.js';
import Fetcher from './helpers/Fetcher.js';
import { baseUrl, sortingInfo, getAllCategories } from './helpers/index.js';

// USING CHAI EXPECT
let productCodes = env.productCodes;

if (!productCodes) {
  const categoryTreeUrl = `${baseUrl}/api/leftMenu/categorytree`;
  const { data } = await Fetcher.getCached(categoryTreeUrl);
  const categories = data.children;
  productCodes = await getProductCodes(categories);
}

for (const productCode of productCodes) {
  const responseInfo = await Fetcher.getCached(`${baseUrl}/api/axfood/rest/p/${productCode}`);

  describe('Product ' + responseInfo.data.name + ' ' + productCode, () => {
    testEndpointData(responseInfo);
  });
}

function testEndpointData({ response, data, responseTime }) {

  // const { response, data, responseTime } = Fetcher.getCached(url);
  test('Status code is 200', () => {
    expect(response.status).to.equal(200);
  });

  test('Response time is less than 1000ms', () => {
    expect(responseTime).to.be.lessThan(1000);
  });

  test('Product has necessary properties', () => {
    expect(data).to.have.property('name');
    expect(data).to.have.property('description');
    expect(data).to.have.property('image').with.property('url');
    expect(data).to.have.property('price');
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

