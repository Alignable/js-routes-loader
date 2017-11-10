import { expect } from 'chai';
import routes, { errors } from './routes/requiredAndOptionalParameters.json';

describe('required and optional paramter routes', () => {
  describe('path', () => {
    it('starship is a function', () => {
      expect(routes.starshipLogs).to.be.instanceof(Function);
    });

    it('returns the route with required parameters', () => {
      expect(routes.starshipLogs(2233).path).to.eq('/logs/year/2233');
    });

    it('returns the route with required parameters and query string', () => {
      expect(routes.starshipLogs(2233, {
        rank: 'captain',
        personal: false,
      }).path).to.equal('/logs/year/2233?rank=captain&personal=false');
    });

    it('returns the route with all parameters', () => {
      expect(routes.starshipLogs(2233, { id: 'enterprise', month: 3, day: 22 }).path).to.eq('/starship/enterprise/logs/year/2233/month/3/day/22');
    });

    it('returns the route with some of the parameters', () => {
      expect(routes.starshipLogs(2233, { month: 3 }).path).to.eq('/logs/year/2233/month/3');
    });

    it('returns the route with some parameters and query string', () => {
      expect(routes.starshipLogs(2233, {
        month: 3,
        rank: 'captain',
        personal: false,
      }).path).to.equal('/logs/year/2233/month/3?rank=captain&personal=false');
    });

    it('throws if called with too many required params', () => {
      expect(() => routes.starshipLogs(2233, 3)).to.throw(Error);
    });

    it('throws if called with too many required params and options', () => {
      expect(() => routes.starshipLogs(2233, 3, { rank: 'captain' })).to.throw(Error);
    });
  });

  describe('methods', () => {
    it('returns the supported methods', () => {
      expect(routes.starshipLogs(2233).methods).to.deep.eq(['GET', 'PUT', 'PATCH', 'DELETE']);
    });
  });

  describe('errors', () => {
    it('should be empty', () => {
      expect(errors).to.deep.eq([]);
    });
  });
});
