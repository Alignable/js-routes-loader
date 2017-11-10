import { expect } from 'chai';
import routes, { errors } from './routes/globAndRequiredParameters.json';

describe('optional glob and required paramters routes', () => {
  describe('glob before required paramters ', () => {
    describe('path', () => {
      it('logs is a function', () => {
        expect(routes.logs).to.be.instanceof(Function);
      });

      it('returns the route single glob parameter', () => {
        expect(routes.logs(2233, 'personal').path).to.eq('/logs/2233/personal');
      });

      it('returns the route with single parameter and with query string', () => {
        expect(routes.logs(2233, 'personal', {
          rank: 'captain',
        }).path).to.equal('/logs/2233/personal?rank=captain');
      });

      it('returns the route with parameter array', () => {
        expect(routes.logs([2233, 3, 22], 'personal').path).to.eq('/logs/2233/3/22/personal');
      });

      it('returns the route with parameter array and with query string', () => {
        expect(routes.logs([2233, 3, 22], 'personal', {
          rank: 'captain',
        }).path).to.equal('/logs/2233/3/22/personal?rank=captain');
      });

      it('throws if called with too few required params', () => {
        expect(() => routes.logs([2233, 3, 22])).to.throw(Error);
      });

      it('throws if called with too few required params and options', () => {
        expect(() => routes.logs([2233, 3, 22], { rank: 'captain' })).to.throw(Error);
      });

      it('throws if called with too many required params', () => {
        expect(() => routes.logs(2233, 3, 22)).to.throw(Error);
      });

      it('throws if called with too many required params and options', () => {
        expect(() => routes.logs(2233, 3, 22, { rank: 'captain' })).to.throw(Error);
      });
    });

    describe('methods', () => {
      it('returns the supported methods', () => {
        expect(routes.logs([2233, 3, 22], 'personal').methods).to.deep.eq(['GET']);
      });
    });
  });

  describe('glob after required paramters', () => {
    describe('path', () => {
      it('starshipLogs is a function', () => {
        expect(routes.starshipLogs).to.be.instanceof(Function);
      });

      it('returns the route single glob parameter', () => {
        expect(routes.starshipLogs('enterprise', 2233).path).to.eq('/starships/enterprise/logs/2233');
      });

      it('returns the route with single parameter and with query string', () => {
        expect(routes.starshipLogs('enterprise', 2233, {
          rank: 'captain',
        }).path).to.equal('/starships/enterprise/logs/2233?rank=captain');
      });

      it('returns the route with parameter array', () => {
        expect(routes.starshipLogs('enterprise', [2233, 3, 22]).path).to.eq('/starships/enterprise/logs/2233/3/22');
      });

      it('returns the route with parameter array and with query string', () => {
        expect(routes.starshipLogs('enterprise', [2233, 3, 22], {
          rank: 'captain',
        }).path).to.equal('/starships/enterprise/logs/2233/3/22?rank=captain');
      });

      it('throws if called with too few required params', () => {
        expect(() => routes.starshipLogs('enterprise')).to.throw(Error);
      });

      it('throws if called with too few required params and options', () => {
        expect(() => routes.starshipLogs('enterprise', { rank: 'captain' })).to.throw(Error);
      });

      it('throws if called with too many required params', () => {
        expect(() => routes.starshipLogs('enterprise', 2233, 3, 22)).to.throw(Error);
      });

      it('throws if called with too many required params and options', () => {
        expect(() => routes.starshipLogs('enterprise', 2233, 3, 22, { rank: 'captain' })).to.throw(Error);
      });
    });

    describe('methods', () => {
      it('returns the supported methods', () => {
        expect(routes.starshipLogs('enterprise', [2233, 3, 22]).methods).to.deep.eq(['GET']);
      });
    });
  });

  describe('errors', () => {
    it('should be empty', () => {
      expect(errors).to.deep.eq([]);
    });
  });
});
