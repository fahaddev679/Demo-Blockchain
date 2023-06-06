const redis = require('redis');

const CHANNEL = {
    TEST: "TEST",
    BLOCKCHAIN: "BLOCKCHAIN"
}
class PubSub{
    constructor({blockchain}){
        this.blockchain = blockchain;
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();
       this.subscriber.subscribe(CHANNEL.TEST);
       this.subscriber.subscribe(CHANNEL.BLOCKCHAIN);
       

        this.subscriber.on('message',(channel, message)=> this.handleMessage(channel, message));


    }
    handleMessage(message, channel){
        console.log(`message recieved. Message ${message} Channel: ${channel}`);
        const parseMessage = JSON.parse(message);
        if(channel === CHANNEL.BLOCKCHAIN){
            this.blockchain.replaceChain(parseMessage);
        }
    }

    publish({message, channel}){
        this.publisher.publish(channel, message);
    }

    broadcastChain(){
        this.publish({channel: CHANNEL.BLOCKCHAIN, message: JSON.stringify(this.blockchain.chain)});
    }
}

module.exports = PubSub;

