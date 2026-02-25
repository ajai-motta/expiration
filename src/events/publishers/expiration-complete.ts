import { ExpirationCompleteEvent,Subjects,Publisher } from "@ajaisgtickets/common";
export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete=Subjects.ExpirationComplete;
    
}