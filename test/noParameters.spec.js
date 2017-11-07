import { expect } from 'chai';
import routes from './routes/noParameters.json';

describe('no paramter routes', () => {
  describe('path', () => {
    it('starships is a function', () => {
      expect(routes.starships).to.be.instanceof(Function);
    });

    it('returns the route', () => {
      expect(routes.starships().path).to.eq('/starships');
    });

    it('returns the route with empty options', () => {
      expect(routes.starships({}).path).to.eq('/starships');
    });

    it('returns the route with format', () => {
      expect(routes.starships({ format: 'json' }).path).to.equal('/starships.json');
    });

    it('returns the route with options', () => {
      expect(routes.starships({
        class: 'constitution',
        affiliation: 'federation',
      }).path).to.equal('/starships?class=constitution&affiliation=federation');
    });

    it('returns the route with anchor', () => {
      expect(routes.starships({ anchor: 'bird of prey' }).path).to.equal('/starships#bird%20of%20prey');
    });

    it('returns the route with format, options and anchor', () => {
      expect(routes.starships({
        format: 'json',
        affiliation: 'klingon',
        anchor: 'bird of prey',
      }).path).to.equal('/starships.json?affiliation=klingon#bird%20of%20prey');
    });

    it('throws if called with too many required params', () => {
      expect(() => routes.starships('enterprise')).to.throw(Error);
    });

    it('throws if called with too many required params and otions', () => {
      expect(() => routes.starships('enterprise', { format: 'json' })).to.throw(Error);
    });
  });

  describe('methods', () => {
    it('returns the supported methods', () => {
      expect(routes.starships().methods).to.deep.eq(['GET', 'POST']);
    });
  });
});
