import { expect } from 'chai';
import noNameRoutes, { errors as noNameErrors } from './routes/errors/noName.json';
import emptyNameRoutes, { errors as emptyNameErrors } from './routes/errors/emptyName.json';
import nonStringName, { errors as nonStringNameErrors } from './routes/errors/nonStringName.json';

describe('routes with name errors', () => {
  const itBehavesLikeNameErrorRoute = (routes, errors, expectedpath) => {
    expect(Object.keys(routes).length).to.equal(0);
    expect(errors).to.be.instanceof(Array);
    expect(errors.length).to.equal(1);
    expect(errors[0].route.path).to.equal(expectedpath);
  };

  it('name is required', () => {
    itBehavesLikeNameErrorRoute(noNameRoutes, noNameErrors, '/noName');
  });

  it('name cannot be empty', () => {
    itBehavesLikeNameErrorRoute(emptyNameRoutes, emptyNameErrors, '/emptyName');
  });

  it('name has to be a string', () => {
    itBehavesLikeNameErrorRoute(nonStringName, nonStringNameErrors, '/nonStringName');
  });
});
