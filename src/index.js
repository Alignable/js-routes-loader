import loaderUtils from 'loader-utils';
import { matchesRequiredParam, matchesOptionalParam } from './PathBuilder';

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

function RoutesLoader(source) {
  this.cacheable();

  const parseSource = JSON.parse(source);

  const routes = [];
  const errors = [];

  parseSource.routes.forEach((route) => {
    const { name, path, requiredParams, optionalParams, methods } = route;

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

    routes.push(`  ${name}: (${requiredParamsDelimited}${options}) => new Route(
    '${path}',
    [${requiredParamsDelimited}],
    ${requiredParamsQuotedArgs},
    ${optionalParamsQuotedArgs},
    options,
    ${methodsQuotedArgs}
  ),`);
  });

  const routePath = loaderUtils.stringifyRequest(this, `!${require.resolve('./Route.js')}`);

  const loader =
`import Route from ${routePath}
    
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

export default RoutesLoader;
