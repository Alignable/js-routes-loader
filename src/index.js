import loaderUtils from 'loader-utils';

function RoutesLoader(source) {
  this.cacheable();

  const quoteArgs = (args) => {
    const quoted = args ? args.map(param => `'${param}'`) : [];
    return `[${quoted.join(', ')}]`;
  };

  const parseSource = JSON.parse(source);

  const routes = [];
  const errors = [];

  const buildError = (error, route) => `  ${JSON.stringify({ error, route })},`;

  parseSource.routes.forEach((route) => {
    const { name, requiredParams, path, methods } = route;

    if (!(name && name.length > 0)) {
      errors.push(buildError('name is required and must be a non-empty String', route));
      return;
    }

    if (!(path && path.length > 0)) {
      errors.push(buildError('path is required and must be a non-empty String', route));
      return;
    }

    if (requiredParams && requiredParams.some(param => !path.includes(`:${param}`))) {
      errors.push(buildError('path must include all the required params', route));
      return;
    }

    const requiredParamsDelimited = requiredParams ? requiredParams.join(', ') : '';
    const options = requiredParams && requiredParams.length > 0 ? ', options' : 'options';
    const requiredParamsQuotedArgs = quoteArgs(requiredParams);
    const methodsQuotedArgs = quoteArgs(methods);

    routes.push(`  ${name}: (${requiredParamsDelimited}${options}) => new Route('${path}', [${requiredParamsDelimited}], ${requiredParamsQuotedArgs}, options, ${methodsQuotedArgs}),`);
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
