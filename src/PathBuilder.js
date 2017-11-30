import querystring from 'querystring';

const globParamRegex = param => new RegExp(`\\*${param}`);
const globParamReplace = (value, isGlob) => {
  const isArray = value instanceof Array;
  if (!isGlob && isArray) {
    throw new Error('Tried to pass an array to a parameter that is not a glob.');
  }
  if (!isGlob || !isArray) {
    return value;
  }
  return value.join('/');
};

const requiredParamRegex = param => new RegExp(`([:\\*])${param}`);
const requiredParamReplace = (value, isGlob) => globParamReplace(value, isGlob);

const optionalParamRegex = param => new RegExp(`\\(([^\\(\\)].*)[:\\*]${param}([^\\(\\)]*)\\)`);
const optionalParamReplace = (value, isGlob) => (typeof value !== 'undefined' ? `$1${globParamReplace(value, isGlob)}$2` : '');

const matchesRequiredParam = (path, param) => path.match(requiredParamRegex(param));
const matchesOptionalParam = (path, param) => path.match(optionalParamRegex(param));
const matchesGlobParam = (path, param) => path.match(globParamRegex(param));

const replaceRequiredParam = (path, param, value) => {
  const isGlob = matchesGlobParam(path, param);
  const regex = requiredParamRegex(param);
  const replacement = requiredParamReplace(value, isGlob);
  return path.replace(regex, replacement);
};

const replaceOptionalParam = (path, param, value) => {
  const isGlob = matchesGlobParam(path, param);
  const regex = optionalParamRegex(param);
  const replacement = optionalParamReplace(value, isGlob);
  return path.replace(regex, replacement);
};

const checkErrors = (params, requiredParams, options) => {
  let error;
  if (!(options instanceof Object && !(options instanceof Array))) {
    error = 'too many parameters';
  } else {
    params.forEach((param) => {
      if (typeof param === 'undefined' || (param instanceof Object && !(param instanceof Array))) {
        error = 'too few parameters';
      }
    });
  }
  if (error) {
    throw new Error(`Required Parameters mismatch - ${error}. Required parameters are [${requiredParams}] but received [${params}].`);
  }
};

const replaceRequiredParams = (path, requiredParams, params) =>
  requiredParams.reduce((replacedPath, param, i) => replaceRequiredParam(replacedPath, param, params[i]), path);

const replaceOptionalParams = (path, optionalParams, options) =>
  optionalParams.reduce((replacedPath, param) => {
    const paramValue = options[param];
    delete options[param]; // eslint-disable-line no-param-reassign

    return replaceOptionalParam(replacedPath, param, paramValue);
  }, path);

const addQueryStringParams = (path, options, anchor) => {
  let pathWithQueryString = path;

  const query = querystring.stringify(options);
  if (query.length > 0) {
    pathWithQueryString = `${pathWithQueryString}?${query}`;
  }
  if (typeof anchor !== 'undefined') {
    pathWithQueryString = `${pathWithQueryString}#${encodeURIComponent(anchor)}`;
  }
  return pathWithQueryString;
};

const buildPath = (pathSpec, params, requiredParams, optionalParams, opts) => {
  const options = opts || {};

  checkErrors(params, requiredParams, options);

  let path = replaceRequiredParams(pathSpec, requiredParams, params);

  const { anchor } = options;
  delete options.anchor;

  path = replaceOptionalParams(path, optionalParams, options);

  path = addQueryStringParams(path, options, anchor);

  return path;
};

const checkMethod = (method, methods) => {
  if (methods.length > 0 && !methods.includes(method)) {
    throw new Error(`Method '${method} is not supported. Supported methods are: [${methods}]`);
  }
};

export { buildPath, matchesRequiredParam, matchesOptionalParam, requiredParamRegex, checkMethod };
