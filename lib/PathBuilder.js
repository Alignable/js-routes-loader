'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requiredParamRegex = exports.matchesOptionalParam = exports.matchesRequiredParam = exports.buildPath = undefined;

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var globParamRegex = function globParamRegex(param) {
  return new RegExp('\\*' + param);
};
var globParamReplace = function globParamReplace(value, isGlob) {
  var isArray = value instanceof Array;
  if (!isGlob && isArray) {
    throw new Error('Tried to pass an array to a parameter that is not a glob.');
  }
  if (!isGlob || !isArray) {
    return value;
  }
  return value.join('/');
};

var requiredParamRegex = function requiredParamRegex(param) {
  return new RegExp('([:\\*])' + param);
};
var requiredParamReplace = function requiredParamReplace(value, isGlob) {
  return globParamReplace(value, isGlob);
};

var optionalParamRegex = function optionalParamRegex(param) {
  return new RegExp('\\(([^\\(\\)].*)[:\\*]' + param + '([^\\(\\)]*)\\)');
};
var optionalParamReplace = function optionalParamReplace(value, isGlob) {
  return typeof value !== 'undefined' ? '$1' + globParamReplace(value, isGlob) + '$2' : '';
};

var matchesRequiredParam = function matchesRequiredParam(path, param) {
  return path.match(requiredParamRegex(param));
};
var matchesOptionalParam = function matchesOptionalParam(path, param) {
  return path.match(optionalParamRegex(param));
};
var matchesGlobParam = function matchesGlobParam(path, param) {
  return path.match(globParamRegex(param));
};

var replaceRequiredParam = function replaceRequiredParam(path, param, value) {
  var isGlob = matchesGlobParam(path, param);
  var regex = requiredParamRegex(param);
  var replacement = requiredParamReplace(value, isGlob);
  return path.replace(regex, replacement);
};

var replaceOptionalParam = function replaceOptionalParam(path, param, value) {
  var isGlob = matchesGlobParam(path, param);
  var regex = optionalParamRegex(param);
  var replacement = optionalParamReplace(value, isGlob);
  return path.replace(regex, replacement);
};

var checkErrors = function checkErrors(params, requiredParams, options) {
  var error = void 0;
  if (!(options instanceof Object && !(options instanceof Array))) {
    error = 'too many parameters';
  } else {
    params.forEach(function (param) {
      if (typeof param === 'undefined' || param instanceof Object && !(param instanceof Array)) {
        error = 'too few parameters';
      }
    });
  }
  if (error) {
    throw new Error('Required Parameters mismatch - ' + error + '. Required parameters are [' + requiredParams + '] but received [' + params + '].');
  }
};

var replaceRequiredParams = function replaceRequiredParams(path, requiredParams, params) {
  return requiredParams.reduce(function (replacedPath, param, i) {
    return replaceRequiredParam(replacedPath, param, params[i]);
  }, path);
};

var replaceOptionalParams = function replaceOptionalParams(path, optionalParams, options) {
  return optionalParams.reduce(function (replacedPath, param) {
    var paramValue = options[param];
    delete options[param]; // eslint-disable-line no-param-reassign

    return replaceOptionalParam(replacedPath, param, paramValue);
  }, path);
};

var addQueryStringParams = function addQueryStringParams(path, options, anchor) {
  var pathWithQueryString = path;

  var query = _querystring2.default.stringify(options);
  if (query.length > 0) {
    pathWithQueryString = pathWithQueryString + '?' + query;
  }
  if (typeof anchor !== 'undefined') {
    pathWithQueryString = pathWithQueryString + '#' + encodeURIComponent(anchor);
  }
  return pathWithQueryString;
};

var buildPath = function buildPath(pathSpec, params, requiredParams, optionalParams, opts) {
  var options = opts || {};

  checkErrors(params, requiredParams, options);

  var path = replaceRequiredParams(pathSpec, requiredParams, params);

  var anchor = options.anchor;

  delete options.anchor;

  path = replaceOptionalParams(path, optionalParams, options);

  path = addQueryStringParams(path, options, anchor);

  return path;
};

exports.buildPath = buildPath;
exports.matchesRequiredParam = matchesRequiredParam;
exports.matchesOptionalParam = matchesOptionalParam;
exports.requiredParamRegex = requiredParamRegex;
//# sourceMappingURL=PathBuilder.js.map