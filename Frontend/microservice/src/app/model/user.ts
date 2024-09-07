import { Booking } from "./booking";

export class User {
    constructor(
        public userId: string = '',
        public username: string = '',
        public email: string = '',
        public address: string = '',
        public roles :string='',
        public bookings: Booking[] = []
    ){}
}
