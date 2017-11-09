import { expect } from 'chai';
import singleParameterRoutes from './routes/singleParameter.json';
import optionalParameterRoutes from './routes/optionalParameter.json';

describe('arrays passed to non-glob params should error', () => {
  it('throws if array is passed to non-glob required param', () => {
    expect(() => singleParameterRoutes.starship([2233, 3, 23])).to.throw(Error);
  });

  it('throws if array is passed to non-glob optional param', () => {
    expect(() => optionalParameterRoutes.starshipLogs([2233, 3, 23])).to.throw(Error);
  });
});
