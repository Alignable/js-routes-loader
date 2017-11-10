import { expect } from 'chai';
import routes, { errors } from './routes/multiParameters.json';

describe('multi parameter routes', () => {
  describe('path', () => {
    it('starshipCrewMember is a function', () => {
      expect(routes.starshipCrewMember).to.be.instanceof(Function);
    });

    it('returns the route', () => {
      expect(routes.starshipCrewMember('enterprise', 12).path).to.eq('/starships/enterprise/crew_members/12');
    });

    it('returns the route with empty options', () => {
      expect(routes.starshipCrewMember('enterprise', 12, {}).path).to.eq('/starships/enterprise/crew_members/12');
    });

    it('returns the route with query string', () => {
      expect(routes.starshipCrewMember('enterprise', 12, {
        spaceLogs: true,
        details: 'full',
      }).path).to.equal('/starships/enterprise/crew_members/12?spaceLogs=true&details=full');
    });

    it('returns the route with anchor', () => {
      expect(routes.starshipCrewMember('enterprise', 12, { anchor: 'personal life' }).path).to.equal('/starships/enterprise/crew_members/12#personal%20life');
    });

    it('returns the route with format, query string and anchor', () => {
      expect(routes.starshipCrewMember('enterprise', 12, {
        spaceLogs: true,
        details: 'full',
        anchor: 'personal life',
      }).path).to.equal('/starships/enterprise/crew_members/12?spaceLogs=true&details=full#personal%20life');
    });

    it('throws if called without enough params', () => {
      expect(() => routes.starshipCrewMember('enterprise')).to.throw(Error);
    });

    it('throws if called options instead of required params', () => {
      expect(() => routes.starshipCrewMember('enterprise', { spaceLogs: true })).to.throw(Error);
    });

    it('throws if called with too many required params', () => {
      expect(() => routes.starshipCrewMember('enterprise', 12, 56)).to.throw(Error);
    });

    it('throws if called with too many required params and otions', () => {
      expect(() => routes.starshipCrewMember('enterprise', 12, 56, { spaceLogs: true })).to.throw(Error);
    });
  });

  describe('methods', () => {
    it('returns the supported methods', () => {
      expect(routes.starshipCrewMember('enterprise', 12).methods).to.deep.eq(['GET', 'PUT', 'PATCH', 'DELETE']);
    });
  });

  describe('errors', () => {
    it('should be empty', () => {
      expect(errors).to.deep.eq([]);
    });
  });
});
