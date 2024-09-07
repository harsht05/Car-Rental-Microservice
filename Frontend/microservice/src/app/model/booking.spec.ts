import { Booking } from './booking';


describe('Booking', () => {
  it('should create a new Booking instance', () => {
    const booking = new Booking(2, "2L", 2, 15000, new Date(), new Date(), "", "", { hours: 15, minutes: 0 }, { hours: 21, minutes: 0 }, 'false');
    expect(booking).toBeTruthy();
  });
});

