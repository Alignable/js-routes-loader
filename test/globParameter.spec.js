import { expect } from 'chai';
import routes, { errors } from './routes/globParameter.json';

describe('glob paramter routes', () => {
  describe('path', () => {
    it('logs is a function', () => {
      expect(routes.logs).to.be.instanceof(Function);
    });

    it('returns the route with single parameter', () => {
      expect(routes.logs(2233).path).to.eq('/logs/2233');
    });

    it('returns the route with single parameter and with query string', () => {
      expect(routes.logs(2233, {
        rank: 'captain',
      }).path).to.equal('/logs/2233?rank=captain');
    });

    it('returns the route with parameter array', () => {
      expect(routes.logs([2233, 3, 22]).path).to.eq('/logs/2233/3/22');
    });

    it('returns the route with parameter array and with query string', () => {
      expect(routes.logs([2233, 3, 22], {
        rank: 'captain',
      }).path).to.equal('/logs/2233/3/22?rank=captain');
    });

    it('throws if called with too few required params', () => {
      expect(() => routes.logs()).to.throw(Error);
    });

    it('throws if called with too few required params and options', () => {
      expect(() => routes.logs({ rank: 'captain' })).to.throw(Error);
    });

    it('throws if called with too many required params', () => {
      expect(() => routes.logs([2233, 3, 22], 'enterprise')).to.throw(Error);
    });

    it('throws if called with too many required params and options', () => {
      expect(() => routes.logs([2233, 3, 22], 'enterprise', { rank: 'captain' })).to.throw(Error);
    });
  });

  describe('methods', () => {
    it('returns the supported methods', () => {
      expect(routes.logs([2233, 3, 22]).methods).to.deep.eq(['GET']);
    });
  });

  describe('errors', () => {
    it('should be empty', () => {
      expect(errors).to.deep.eq([]);
    });
  });
});
