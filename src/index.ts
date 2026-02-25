import { OrderCreatedListner } from './events/listeners/order-created'
import { natsWrapper } from './nats-class-wrapper'
const startUp=async()=>{
 
  
  
  if(!process.env.NATS_CLIENT_ID &&!process.env.NATS_URL && !process.env.NATS_CLUSTER_ID){
    throw new Error('some nats env missing')
  }
  try{
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID!,process.env.NATS_CLIENT_ID!,process.env.NATS_URL!)
    natsWrapper.client.on('close',()=>{
      console.log('closing')
      process.exit()
    })
    
    process.on('SIGINT',()=>natsWrapper.client.close())
    process.on('SIGTERM',()=>natsWrapper.client.close())
   new OrderCreatedListner(natsWrapper.client).listen()
    
  }catch(err){
    console.log(err)
  }

  
}
startUp()