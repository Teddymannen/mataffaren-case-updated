import Fetcher from './helpers/Fetcher.js';
import { baseUrl, getAllCategories } from './helpers/index.js';


const url = `${baseUrl}/api/leftMenu/categorytree`;
const responseInfo = await Fetcher.getCached(url);

describe('category-tree', () => {
  testEndpointData(responseInfo);
});

function testEndpointData({ response, data, responseTime }) {
  // const { response, data, responseTime } = Fetcher.getCached(url);
  test('Status code is 200', () => {
    expect(response.status).toBe(200);
  });

  test('Response time is less than 1000ms', () => {
    expect(responseTime).toBeLessThan(1000);
  });

  test('There are at least 15 main categories', () => {
    expect(data.children.length).toBeGreaterThanOrEqual(15);
  });

  test('All categories have the properties title and url', () => {
    for (let category of getAllCategories(data)) {
      expect(category.title).toBeTruthy();
      expect(category.url).toBeTruthy();

      expect(typeof category.title).toBe('string');
      expect(typeof category.url).toBe('string');
    }
  });
}