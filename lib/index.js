'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

var _PathBuilder = require('./PathBuilder');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* eslint-disable camelcase */


var quoteArgs = function quoteArgs(args) {
  var quoted = args ? args.map(function (param) {
    return '\'' + param + '\'';
  }) : [];
  return '[' + quoted.join(', ') + ']';
};

var buildError = function buildError(error, route) {
  return '  ' + JSON.stringify({ error: error, route: route }) + ',';
};

var checkErrors = function checkErrors(route, name, path, requiredParams, optionalParams) {
  var errors = [];

  if (!(name && name.length > 0)) {
    errors.push(buildError('name is required and must be a non-empty String', route));
  }

  if (!(path && path.length > 0)) {
    errors.push(buildError('path is required and must be a non-empty String', route));
  }

  if (requiredParams && requiredParams.some(function (param) {
    return !(0, _PathBuilder.matchesRequiredParam)(path, param);
  })) {
    errors.push(buildError('path must include all the required params', route));
  }

  if (optionalParams && optionalParams.some(function (param) {
    return !(0, _PathBuilder.matchesOptionalParam)(path, param);
  })) {
    errors.push(buildError('path must include all the optional params', route));
  }
  return errors;
};

// Simple transform from snake_case to camelCase without pulling in some external lib
var camelCase = function camelCase(str) {
  return str.replace(/_(.)/g, function (match, c) {
    return c.toUpperCase();
  });
};

var transformRoute = function transformRoute(route) {
  // json format from Rails is typically snake_case.
  // javascript land wants camelCase so transform the name, params and path
  var name = route.name,
      path = route.path,
      required_params = route.required_params,
      optional_params = route.optional_params,
      methods = route.methods;


  var allParams = [].concat(_toConsumableArray(required_params || []), _toConsumableArray(optional_params || []));

  var replacedPath = allParams.reduce(function (replaced, param) {
    var regex = (0, _PathBuilder.requiredParamRegex)(param);
    var replacement = '$1' + camelCase(param);
    return replaced.replace(regex, replacement);
  }, path);

  var trasnformedRoute = {
    name: typeof name === 'string' && camelCase(name),
    path: replacedPath,
    requiredParams: required_params && required_params.map(camelCase),
    optionalParams: optional_params && optional_params.map(camelCase),
    methods: methods && methods.map(function (method) {
      return method.toUpperCase();
    })
  };
  return trasnformedRoute;
};

function RoutesLoader(source) {
  this.cacheable();

  var parseSource = JSON.parse(source);

  var routes = [];
  var errors = [];

  parseSource.routes.forEach(function (route) {
    var t = transformRoute(route);
    var name = t.name,
        path = t.path,
        requiredParams = t.requiredParams,
        optionalParams = t.optionalParams,
        methods = t.methods;


    var routeErrors = checkErrors(route, name, path, requiredParams, optionalParams);
    if (routeErrors.length > 0) {
      errors.push.apply(errors, _toConsumableArray(routeErrors));
      return;
    }

    var requiredParamsDelimited = requiredParams ? requiredParams.join(', ') : '';
    var options = requiredParams && requiredParams.length > 0 ? ', options' : 'options';
    var requiredParamsQuotedArgs = quoteArgs(requiredParams);
    var optionalParamsQuotedArgs = quoteArgs(optionalParams);
    var methodsQuotedArgs = quoteArgs(methods);

    routes.push('  ' + name + ': (' + requiredParamsDelimited + options + ') => new Route(\n    \'' + path + '\',\n    [' + requiredParamsDelimited + '],\n    ' + requiredParamsQuotedArgs + ',\n    ' + optionalParamsQuotedArgs + ',\n    options,\n    ' + methodsQuotedArgs + '\n  ),');
  });

  var routePath = _loaderUtils2.default.stringifyRequest(this, '!' + require.resolve('./Route.js'));

  var loader = 'import Route from ' + routePath + '\n    \nconst errors = [\n' + errors.join('\n') + '\n];\n\nconst routes = {\n' + routes.join('\n') + '\n};\n\nexport { errors, routes as default };\n';

  return loader;
}

exports.default = RoutesLoader;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map