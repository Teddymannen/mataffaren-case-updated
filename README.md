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

### Tests
* There are at least 15 main categories
* All categories have the properties `title` and `url`

We test that there are at least 15 main categories by checking the length of `responseData.children`. 

To test that all categories have the properties `title` and `url` we first generate a flat array of all categories. To do this we made a function `getAllCategories` which works by going through all categories recursively.

## Get products in category

## Get product

## Invalid request