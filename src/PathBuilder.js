import querystring from 'querystring';

const requiredParamRegex = param => new RegExp(`:${param}`);
const requiredParamReplace = param => param;

const optionalParamRegex = param => new RegExp(`\\(([^\\(\\)].*):${param}([^\\(\\)]*)\\)`);
const optionalParamReplace = param => (typeof param !== 'undefined' ? `$1${param}$2` : '');

const matchesRequiredParam = (path, param) => path.match(requiredParamRegex(param));
const matchesOptionalParam = (path, param) => path.match(optionalParamRegex(param));

const replaceRequiredParam = (path, param, value) => path.replace(requiredParamRegex(param), requiredParamReplace(value));
const replaceOptionalParam = (path, param, value) => path.replace(optionalParamRegex(param), optionalParamReplace(value));

const checkErrors = (params, requiredParams, options) => {
  // error check params agasint requiredParams
  let error;
  if (!(options instanceof Object)) {
    error = 'too many parameters';
  } else {
    params.forEach((param) => {
      if (typeof param === 'undefined' || param instanceof Object) {
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

export { buildPath, matchesRequiredParam, matchesOptionalParam };
