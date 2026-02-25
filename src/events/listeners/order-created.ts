import { Listener,OrderCreatedEvent, OrderStatus, Subjects } from "@ajaisgtickets/common";
import { quegroupName } from "./que-group";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
export class OrderCreatedListner extends Listener<OrderCreatedEvent>{
    readonly subject=Subjects.OrderCreated;
    queueGroupName=quegroupName;
    async onMessage(data: OrderCreatedEvent['data'] , msg: Message) {
        //const delay=new Date(data.expiresAt).getTime()- new Date().getTime()
        const delay=1000
        console.log('delay is',delay)
        await expirationQueue.add({
            orderId: data.id
        },{
            delay
        })
        msg.ack()
    }

}