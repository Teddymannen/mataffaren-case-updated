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

To test that products in category have necessary properties we loop through all products in `responseData.results` and check that they have the properties `name`, `image.url`, `price` and `priceUnit`. We deem these neccessary because they are used in the frontend.

To test that the product list is sorted correctly we loop through all products and compare the current product with the next one. We made a function `compareValues` which returns `true` if the current product should be before the next one in the list and `false` otherwise. We then check that `compareValues` returns `true` for all products in the list.

The function `compareValues` works by comparing the values of the two products, taking the variable-type and if it should be in ascending or descending order into account. To test a value of type `string` we used `localeCompare` with the locale `'sv'` and the options `{sensitivity: 'base'}`. We chose to use `'base'` to ignore case and accents. We found the different options for `sensitivity` [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator#sensitivity). To test a value of type `number` we simply compare the two values. An exception is made for `NaN`, which would mean that `comparePrice` doesn't exist. Those products should always be last.

When sorting by `priceValue` or `comparePrice` it should use the lowest available price. To get this you must check `product.potentialPromotions` and use the price from there if one exists. `product.potentialPromotions` is an Array and we always use the first element in the Array.

## Get product

## Invalid request