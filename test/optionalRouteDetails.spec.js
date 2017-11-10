import { expect } from 'chai';
import routes, { errors } from './routes/optionalRouteDetails.json';

describe('optional route details', () => {
  it('requiredParams are optional', () => {
    expect(routes.noParams().path).to.equal('/no_params');
  });

  it('methods are optional', () => {
    expect(routes.noMethods().path).to.equal('/no_methods');
    expect(routes.noMethods().methods).to.deep.equal([]);
  });

  it('noRequiredParams is optional', () => {
    expect(routes.noRequiredParams().path).to.equal('/no_required_params');
  });

  it('optionalParams is optional', () => {
    expect(routes.noOptionalParams().path).to.equal('/no_optional_params');
  });

  describe('errors', () => {
    it('should be empty', () => {
      expect(errors).to.deep.eq([]);
    });
  });
});
