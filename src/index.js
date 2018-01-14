/* eslint-disable camelcase */
import loaderUtils from 'loader-utils';
import { matchesRequiredParam, matchesOptionalParam, requiredParamRegex } from './PathBuilder';
import FetchWrapper from './FetchWrapper';

const quoteArgs = (args) => {
  const quoted = args ? args.map(param => `'${param}'`) : [];
  return `[${quoted.join(', ')}]`;
};

const buildError = (error, route) => `  ${JSON.stringify({ error, route })},`;

const checkErrors = (route, name, path, requiredParams, optionalParams) => {
  const errors = [];

  if (!(name && name.length > 0)) {
    errors.push(buildError('name is required and must be a non-empty String', route));
  }

  if (!(path && path.length > 0)) {
    errors.push(buildError('path is required and must be a non-empty String', route));
  }

  if (requiredParams && requiredParams.some(param => !matchesRequiredParam(path, param))) {
    errors.push(buildError('path must include all the required params', route));
  }

  if (optionalParams && optionalParams.some(param => !matchesOptionalParam(path, param))) {
    errors.push(buildError('path must include all the optional params', route));
  }
  return errors;
};

// Simple transform from snake_case to camelCase without pulling in some external lib
const camelCase = str => str.replace(/_(.)/g, (match, c) => c.toUpperCase());

const transformRoute = (route) => {
  // json format from Rails is typically snake_case.
  // javascript land wants camelCase so transform the name, params and path
  const { name, path, required_params, optional_params, methods } = route;

  const allParams = [...(required_params || []), ...(optional_params || [])];

  const replacedPath = allParams.reduce((replaced, param) => {
    const regex = requiredParamRegex(param);
    const replacement = `$1${camelCase(param)}`;
    return replaced.replace(regex, replacement);
  }, path);

  const trasnformedRoute = {
    name: (typeof name === 'string') && camelCase(name),
    path: replacedPath,
    requiredParams: required_params && required_params.map(camelCase),
    optionalParams: optional_params && optional_params.map(camelCase),
    methods: methods && methods.map(method => method.toUpperCase()),
  };
  return trasnformedRoute;
};

function RoutesLoader(source) {
  this.cacheable();

  const parseSource = JSON.parse(source);

  const routes = [];
  const errors = [];

  parseSource.routes.forEach((route) => {
    const t = transformRoute(route);
    const { name, path, requiredParams, optionalParams, methods } = t;

    const routeErrors = checkErrors(route, name, path, requiredParams, optionalParams);
    if (routeErrors.length > 0) {
      errors.push(...routeErrors);
      return;
    }

    const requiredParamsDelimited = requiredParams ? requiredParams.join(', ') : '';
    const options = requiredParams && requiredParams.length > 0 ? ', options' : 'options';
    const requiredParamsQuotedArgs = quoteArgs(requiredParams);
    const optionalParamsQuotedArgs = quoteArgs(optionalParams);
    const methodsQuotedArgs = quoteArgs(methods);

    routes.push(`  ${name}: (${requiredParamsDelimited}${options}) => fetchWrapper(
    buildPath('${path}', [${requiredParamsDelimited}], ${requiredParamsQuotedArgs}, ${optionalParamsQuotedArgs}, options),
    ${methodsQuotedArgs}
  ),`);
  });

  const options = Object.assign(
    {},
    { fetch: './SimpleFetch' },
    loaderUtils.getOptions(this));

  const pathBuilderPath = loaderUtils.stringifyRequest(this, `${require.resolve('./PathBuilder.js')}`);
  const fetchWrapperPath = loaderUtils.stringifyRequest(this, `!${require.resolve(options.fetch)}`);

  const loader =
`import { buildPath } from ${pathBuilderPath};
import fetchWrapper from ${fetchWrapperPath};
    
const errors = [
${errors.join('\n')}
];

const routes = {
${routes.join('\n')}
};

export { errors, routes as default };
`;

  return loader;
}

export { RoutesLoader as default, FetchWrapper };
