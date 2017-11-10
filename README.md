[![npm][npm]][npm-url]
[![deps][deps]][deps-url]
[![test][test]][test-url]
[![coverage][cover]][cover-url]

# js-routes-loader

A [webpack](https://github.com/webpack/webpack) loader for parsing route definitions in json files and wrapping them with a simple javascript api.

## Install

```bash
npm i -D js-routes-loader
```

## Usage

Suppose we have the following routes file:

**routes/starships.json**
```js
{
  "routes": [
    {
      "name": "starships",
      "path": "/posts"
    },
    {
      "name": "starship",
      "path": "/starships/:id",
      "required_params": ["id"]
    }
  ]
}
```

Configure the loader in webpack to apply to all your routes files
**webpack.config.js**
```js
module.exports = {
  module: {
    loaders: [
      {
        test: /routes/.*\.json$/,
        loader: 'js-routes-loader',
      },
    ],
  },
};
```

**index.js**
```js
const routes = require('/routes/starships.json');

routes.starships();             // '/starships'
routes.starships('enterprise'); // '/starships/enterprise'
```

## Details

### Routes JSON Format

The routes json file defines the set of routes available in your app.
Suppose we had an web app with a REST api for  managing starships and their crew.
Its routes file might look like this:

**startships.json**
```js
{
  "routes": [
    {
      "name": "starships",
      "path": "/starships(.:format)",
      "required_params": [],
      "optional_params": ["format"],
      "methods": ['GET', 'POST']
    },
    {
      "name": "starship",
      "path": "/starships/:id(.:format)",
      "required_params": ["id"],
      "optional_params": ["format"],
      "methods": ["GET", "PUT", "PATCH", "DELETE"]
    },
    {
      "name": "starshipCrewMembers",
      "path": "/starships/:starship_id/crew_members(.:format)",
      "required_params": ["starship_id"],
      "optional_params": ["format"],
      "methods": ["GET", "POST"]
    },
    {
      "name": "starshipCrewMember",
      "path": "/starships/:starship_id/crew_members/:id(.:format)",
      "required_params": ["starship_id", "id"],
      "optional_params": ["format"],
      "methods": ["GET", "PUT", "PATCH", "DELETE"]
    },
    // more routes
  ]
}
```

Each route objects has the following for properties:

|Property|Type |Description|Required|
|--------|:---:|-----------|:------:|
|**name**|`String`| The name of the route. Must be a valid javascript function name and unique. | Yes |
|**path**|`String`| The 'spec' of the routes path. Required parameters should be encoded as `:param`. | Yes |
|**required_params** |`Array`| A list of required parameters that appear in `path`. | No |
|**optional_params** |`Array`| A list of optional parameters that appear in `path`. | No |
|**methods** |`Array`| A list of http methods that the route supports. | No |
 
In production the routes json file will typically be created by exporting the routes from your backend application.  

### Routes Javascript API

The js-routes-loader converts each route specified in the json file into a javascript function that returns a Route object.

Importing the startships.json file above results is equivalent to four functions with the following signature:

```js
const routes = {
  starships: (options = {}) => new Route(....),
  starship: (id, options = {}) => new Route(....),
  starshipCrewMembers: (starthip_id, options = {}) => new Route(....),
  starshipCrewMember: (starthip_id, id, options = {}) => new Route(....),
};
``` 

#### `path`
Returns the path resulting from replacing the required parameters in the path with supplied parameters.

Example: The path to the list of all starships
```js
routes.starships().path; // '/starships'
```

or the path to the crew member with `id=12` on the starship `enterprise` would be:
```js
routes.starshipCrewMember('enterprise', 12).path; // '/starships/enterprise/crewMembers/12'
```

#### `options`
Each route method takes an optional map of options than affect the path the route generates.

#### `options[optional_params]`

Parameters who's keys match entries in the route's `optional_params` array will be appended replaced in the path.

Example: The path to the crew member with `id=12` on the starship `enterprise` in json format would be:
```js
routes.starshipCrewMember('enterprise', 12, { format: 'json' }).path; // '/starships/enterprise/crewMembers/12.json'
```

#### `options[queryParams]`

Any query string parameters can be passed to the route and will be appended to the path.

Example: The path to search for 'federation' starships in the 'constitution' class would be:
```js
routes.starships({ affiliation: 'federation', class: 'constitution'}).path; // '/starships?affiliation=federation&class=constitution'
```

#### `options[anchor]`
The `anchor` option is special will be appended to the path as an anchor tag after the query string parameters.

Example: the path to all 'klingon' starhips with the anchor 'bird of prey' would be:
```js
routes.starships({ affiliation: 'klingon', anchor: 'bird of prey'}).path; // '/starships?affiliation=kligon#bird%20of%20prey'
```

#### `methods`
Returns the methods supported by the route:

```js
routes.starships().methods;             // ['GET', 'POST']
routes.starships('enterprise').methods; // ['GET', 'PUT', 'PATCH', 'DELETE']
```

If the methods array is missing or empty it is assumed that all methods are supported. What's the use of a route that supports no ways of calling it? :confused:.

### `fetch` wrappers

Having easy access to the applications paths is great but given a path you probably want to make some sort of request against that path.
The `Route` object provides five methods, `go`, `post`, `put`, `patch` and `delete` that are thin wrappers around the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for the equivalent http method.

Example:
```js
routes.starshipCrewMember('enterprise').post({ body: JSON.stringify({ name: 'James T. Kirk', rank: 'Captain' }));
// Equivalent to
fetch('/starships/enterprise/crewMembers', {method: 'POST', body: JSON.stringify({ name: 'James T. Kirk', rank: 'Captain' }) });
``` 

You might combine these fetch methods like this:
```js
const readyAwayParty = async () => {
  const response = await routes.starshipCrewMembers('enterprise', { rank: 'ensign', shirt: 'red' });
  const ensigns = await response.json();
  const firstEnsign = ensigns[0];
  await routes.starshipCrewMember('enterprise', firstEnsign.id).patch( {status: 'away', phasers: 'stun'});
  return firstEnsign;
};


exploreStrangeNewWorld(readyAwayParty())
  .then((discoveredLifeForms) => {
    console.log(`New life forms discovered ${discoveredLifeForms}`);
  })
  .catch((lostCrew) => {
    console.log("He's dead Jim");
    lostCrew.forEach((crew) => routes.starshipCrewMember('enterprise',crew.id).destroy());
  });
```

More information on using the fetch API can be found in the [Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) documentation.

If you are using Routes Loader in browsers without fetch support make sure to include the [Fetch polyfil](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) in you webpack.


[npm]: https://img.shields.io/npm/v/js-routes-loader.svg
[npm-url]: https://npmjs.com/package/js-routes-loader

[deps]: https://david-dm.org/Alignable/js-routes-loader.svg
[deps-url]: https://david-dm.org/Alignable/js-routes-loader

[test]: http://img.shields.io/travis/Alignable/js-routes-loader.svg
[test-url]: https://travis-ci.org/Alignable/js-routes-loader

[cover]: https://codecov.io/gh/Alignable/js-routes-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/Alignable/js-routes-loader
