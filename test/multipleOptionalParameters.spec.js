import { expect } from 'chai';
import routes from './routes/multipleOptionalParameters.json';

describe('multiple optional paramter routes', () => {
  describe('path', () => {
    it('starship is a function', () => {
      expect(routes.starshipLogs).to.be.instanceof(Function);
    });

    it('returns the route without any parameters', () => {
      expect(routes.starshipLogs().path).to.eq('/logs');
    });

    it('returns the route without any parameters and with query string', () => {
      expect(routes.starshipLogs({
        rank: 'captain',
        personal: false,
      }).path).to.equal('/logs?rank=captain&personal=false');
    });

    it('returns the route with the id parameter', () => {
      expect(routes.starshipLogs({ id: 'enterprise' }).path).to.eq('/starship/enterprise/logs');
    });

    it('returns the route with the id parameter and query string', () => {
      expect(routes.starshipLogs({
        id: 'enterprise',
        rank: 'captain',
        personal: false,
      }).path).to.equal('/starship/enterprise/logs?rank=captain&personal=false');
    });

    it('returns the route with all parameters', () => {
      expect(routes.starshipLogs({ id: 'enterprise', year: 2233, month: 3, day: 22 }).path).to.eq('/starship/enterprise/logs/year/2233/month/3/day/22');
    });

    it('returns the route with some of the parameters', () => {
      expect(routes.starshipLogs({ year: 2233, month: 3 }).path).to.eq('/logs/year/2233/month/3');
    });

    it('throws if called with too many required params', () => {
      expect(() => routes.starshipLogs('enterprise')).to.throw(Error);
    });

    it('throws if called with too many required params and options', () => {
      expect(() => routes.starshipLogs('enterprise', { rank: 'captain' })).to.throw(Error);
    });
  });

  describe('methods', () => {
    it('returns the supported methods', () => {
      expect(routes.starshipLogs().methods).to.deep.eq(['GET', 'PUT', 'PATCH', 'DELETE']);
    });
  });
});
