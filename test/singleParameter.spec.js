import { expect } from 'chai';
import routes from './routes/singleParameter.json';

describe('single paramter routes', () => {
  describe('path', () => {
    it('starship is a function', () => {
      expect(routes.starship).to.be.instanceof(Function);
    });

    it('returns the route', () => {
      expect(routes.starship('enterprise').path).to.eq('/starship/enterprise');
    });

    it('returns the route with empty options', () => {
      expect(routes.starship('enterprise', {}).path).to.eq('/starship/enterprise');
    });

    it('returns the route with query string', () => {
      expect(routes.starship('enterprise', {
        crew: true,
        history: false,
      }).path).to.equal('/starship/enterprise?crew=true&history=false');
    });

    it('returns the route with anchor', () => {
      expect(routes.starship('enterprise', { anchor: 'launch date' }).path).to.equal('/starship/enterprise#launch%20date');
    });

    it('returns the route with format, query string and anchor', () => {
      expect(routes.starship('enterprise', {
        crew: true,
        history: false,
        anchor: 'launch date',
      }).path).to.equal('/starship/enterprise?crew=true&history=false#launch%20date');
    });

    it('throws if called without enough params', () => {
      expect(() => routes.starship()).to.throw(Error);
    });

    it('throws if called options instead of required params', () => {
      expect(() => routes.starship({ format: 'json' })).to.throw(Error);
    });

    it('throws if called with too many required params', () => {
      expect(() => routes.starship('enterprise', 12)).to.throw(Error);
    });

    it('throws if called with too many required params and options', () => {
      expect(() => routes.starship('enterprise', 12, { format: 'json' })).to.throw(Error);
    });
  });

  describe('methods', () => {
    it('returns the supported methods', () => {
      expect(routes.starship('enterprise').methods).to.deep.eq(['GET', 'PUT', 'PATCH', 'DELETE']);
    });
  });
});
