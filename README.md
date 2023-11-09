# Endpoint testing

| Endpoint | What it is | Information |
| -------- | ---------- | ----------- |
| /api/leftMenu/categorytree | All categories | All categories in a tree structure |
| /api/c/{categoryUrl}| A category's products | **size** (amount of items per page), **page** (page number), **sort** (see sorting list). **categoryUrl** can be taken from categoryTree |
| /api/axfood/rest/p/{product_code} | A product | **product_code** example 101281492_ST |

| Sorting list |
| --- |
| topRated |
| name-asc |
| name-desc |
| price-asc |
| price-desc |
| compareprice-asc |
| compareprice-desc |

**We always test the following on valid endpoints:**
* Status code is 200
* Response time is less than 1000ms

## Get category tree

`/api/leftMenu/categorytree`

### Tests
* There are at least 15 main categories
* All categories have the properties `title` and `url`

We test that there are at least 15 main categories by checking the length of `responseData.children`. 

To test that all categories have the properties `title` and `url` we first generate a flat array of all categories. To do this we made a function `getAllCategories` which works by going through all categories recursively.

## Get products in category

`/api/c/{{urlCategoryPart}}?size=100&page=0&sort={{productSorting}}`

### Pre-request

We want to test multiple category endpoints and must therefore create a loop. In the the previous test the variables `mainCategories` and `allCategories` are created. We use one of those together with a variable `categoryCounter` to choose a category and sorting. The variable `categoryCounter` is incremented by 1 after getting the category and if there are more categories `postman.setNextRequest` is used.

One type of sorting is used on each endpoint. The sorting type is rotating after each request using modulo (`%`) on `categoryCounter`.

### Tests
* There is at least 1 product in the category
* Products in category have necessary properties
* Product list is sorted `{productSorting}`

To test that there is at least 1 product in the category we check the length of `responseData.results`.

To test that products in category have necessary properties we loop through all products in `responseData.results` and check that they have the properties `name`, `image.url`, `price`, `priceUnit` and `code`. We deem these neccessary because they are used in the frontend.

To test that the product list is sorted correctly we loop through all products and compare the current product with the next one. We made a function `compareValues` which returns `true` if the current product should be before the next one in the list and `false` otherwise. We then check that `compareValues` returns `true` for all products in the list.

The function `compareValues` works by comparing the values of the two products, taking the variable-type and if it should be in ascending or descending order into account. To test a value of type `string` we used `localeCompare` with the locale `'sv'` and the options `{sensitivity: 'base'}`. We chose to use `'base'` to ignore case and accents. We found the different options for `sensitivity` [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator#sensitivity). To test a value of type `number` we simply compare the two values. An exception is made for `NaN`, which would mean that `comparePrice` doesn't exist. Those products should always be last.

When sorting by `priceValue` or `comparePrice` it should use the lowest available price. To get this you must check `product.potentialPromotions` and use the price from there if one exists. `product.potentialPromotions` is an Array and we always use the first element in the Array.

## Get product

`/api/axfood/rest/p/{{productCode}}`

### Pre-request

We want to test multiple product codes and must therefore create a loop. In the the previous test the variable `productsToTest` is created. We use this variable together with a variable `productCounter` to choose a product. The variable `productCounter` is incremented by 1 after getting the product and if there are more products `postman.setNextRequest` is used. 

### Tests

* Product has necessary properties

To test that the product has necessary properties we check that it has the properties `name`, `description`, `image.url`, `price` and `priceUnit`. We deem these neccessary because they are used in the frontend. 

## Invalid request

`/{{invalidUrlEnd}}`

### Pre-request

We want to test multiple invalid endpoints and must therefore create a loop. First we create an array with a set of manually chosen invalid endpoints. We use this array together with a variable `invalidUrlCounter` to choose an invalid endpoint. The variable `invalidUrlCounter` is incremented by 1 after getting the invalid endpoint and if there are more invalid endpoints `postman.setNextRequest` is used.

### Tests

* Response time is less than 1000ms

The reason we test for invalid requests is because we want to make sure that the server doesn't crash. We test that the response time is less than 1000ms because we don't want the server to spend too much time on invalid requests. If the server crashes and doesn't respond, postman will throw an error and the test will fail. 

### List of endpoints: 
* `ap`
* `api`
* `api/😱😎`
* `api/wqwqwq2`
* `api/c/nonExistantCategory3`
* `api/axfood/rest/p/notAProductCode123`
* `api/c/fardigmat?size=-1`
* `api/c/fardigmat?size=0.5`
* `api/c/fardigmat?sort=noSortType`
* `api/c/fardigmat?size=2&page=-1`
* `api/c/fardigmat?size=2&page=0.5`