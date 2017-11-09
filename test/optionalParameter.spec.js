import { expect } from 'chai';
import routes from './routes/optionalParameter.json';

describe('single optional paramter routes', () => {
  describe('path', () => {
    it('starship is a function', () => {
      expect(routes.starshipLogs).to.be.instanceof(Function);
    });

    it('returns the route without the parameter', () => {
      expect(routes.starshipLogs().path).to.eq('/logs');
    });

    it('returns the route without the parameter and query string', () => {
      expect(routes.starshipLogs({
        rank: 'captain',
        personal: false,
      }).path).to.equal('/logs?rank=captain&personal=false');
    });

    it('returns the route with the parameter', () => {
      expect(routes.starshipLogs({ id: 'enterprise' }).path).to.eq('/starship/enterprise/logs');
    });

    it('returns the route with the parameter and with query string', () => {
      expect(routes.starshipLogs({
        id: 'enterprise',
        rank: 'captain',
      }).path).to.equal('/starship/enterprise/logs?rank=captain');
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
