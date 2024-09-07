import { Time } from "@angular/common";

export class Booking {
    constructor(
        public bookingId: number = 0,
        public userId: string = '',
        public carId: number = 0,
        public amount: number = 0,
        public pickUpDate:Date,
        public dropOffDate:Date,
        public pickUpLocation:string='',
        public dropOffLocation:string='',
        public  pickUpTime:Time,
	    public  dropOffTime:Time,
        public status: string ="",
        public isBlocked:boolean=false

        
    ){}
}
