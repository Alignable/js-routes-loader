import { expect } from 'chai';
import nopathRoutes, { errors as nopathErrors } from './routes/errors/noPath.json';
import emptypathRoutes, { errors as emptypathErrors } from './routes/errors/emptyPath.json';
import nonStringpathRoutes, { errors as nonStringpathErrors } from './routes/errors/nonStringPath.json';
import missigRequiredParamsInPathRoutes, { errors as missigRequiredParamsInPathErrors } from './routes/errors/missigRequiredParamsInPath.json';
import missigOptionalParamsInPathRoutes, { errors as missigOptionalParamsInPathErrors } from './routes/errors/missigOptionalParamsInPath.json';
import optionalParamsAsRequiredInPathRoutes, { errors as optionalParamsAsRequiredInPathErrors } from './routes/errors/optionalParamsAsRequiredInPath.json';

describe('routes with path errors', () => {
  const itBehavesLikepathErrorRoute = (routes, errors, expectedName) => {
    expect(Object.keys(routes).length).to.equal(0);
    expect(errors).to.be.instanceof(Array);
    expect(errors.length).to.equal(1);
    expect(errors[0].route.name).to.equal(expectedName);
  };

  it('path is required', () => {
    itBehavesLikepathErrorRoute(nopathRoutes, nopathErrors, 'nopath');
  });

  it('path cannot be empty', () => {
    itBehavesLikepathErrorRoute(emptypathRoutes, emptypathErrors, 'emptypath');
  });

  it('path has to be a string', () => {
    itBehavesLikepathErrorRoute(nonStringpathRoutes, nonStringpathErrors, 'nonStringpath');
  });

  it('path has to include all required params', () => {
    itBehavesLikepathErrorRoute(missigRequiredParamsInPathRoutes, missigRequiredParamsInPathErrors, 'missingParams');
  });

  it('path has to include all optional params', () => {
    itBehavesLikepathErrorRoute(missigOptionalParamsInPathRoutes, missigOptionalParamsInPathErrors, 'missingParams');
  });

  it('path cannot have optional that look like required params', () => {
    itBehavesLikepathErrorRoute(optionalParamsAsRequiredInPathRoutes, optionalParamsAsRequiredInPathErrors, 'missingParams');
  });
});
