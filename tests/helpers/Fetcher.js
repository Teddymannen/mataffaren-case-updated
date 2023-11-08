class Fetcher {
  static cachedData = {};

  static async addCachedData(url, response, responseTime) {
    const data = await response.json();
    this.cachedData[url] = { response, data, responseTime };
    return { response, data, responseTime };
  }

  static async getCached(url) {
    if (this.cachedData[url]) {
      // console.log('cached get', url);
      return this.cachedData[url];
    }
    // console.log('not cached get', url);
    const startTime = performance.now();
    const response = await fetch(url);
    const endTime = performance.now();
    return await this.addCachedData(url, response, startTime - endTime);
  }
}


export default Fetcher;

// console.log('start');
// console.log(await Fetcher.getTimed('http://localhost:5173/api/leftMenu/categorytree'));
// console.log(await Fetcher.getCached('http://localhost:5173/api/leftMenu/categorytree'));
// console.log(await Fetcher.getCached('http://localhost:5173/api/leftMenu/categorytree'));