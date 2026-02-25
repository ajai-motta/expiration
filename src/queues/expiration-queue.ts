import  Queue  from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete";
import { natsWrapper } from "../nats-class-wrapper";
interface payload{
    orderId: string;
}
const expirationQueue=new Queue<payload>('order-expiration',{
    redis:{
        host: process.env.REDIS_HOST
    }
})
expirationQueue.process(async (job)=>{
console.log('pubish of expiration complete done',job.data.orderId)
await new ExpirationCompletePublisher(natsWrapper.client).publish({orderId: job.data.orderId})
})
export {expirationQueue}