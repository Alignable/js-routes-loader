import { expect } from 'chai';
import routes from './routes/optionalRouteDetails.json';

describe('optional route details', () => {
  it('requiredParams are optional', () => {
    expect(routes.noParams().path).to.equal('/noParams');
  });

  it('methods are optional', () => {
    expect(routes.noMethods().path).to.equal('/noMethods');
    expect(routes.noMethods().methods).to.deep.equal([]);
  });

  it('noRequiredParams is optional', () => {
    expect(routes.noRequiredParams().path).to.equal('/noRequiredParams');
  });

  it('optionalParams is optional', () => {
    expect(routes.noOptionalParams().path).to.equal('/noOptionalParams');
  });
});
