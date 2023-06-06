const Block = require('./block');
const cryptoHash = require('./hash');

class Blockchain{
    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock({data}){
        const newBlock = Block.mineBlock({
            prevBlock: this.chain[this.chain.length -1],
            data
        })
        this.chain.push(newBlock);
    }

    replaceChain(chain){
        if(chain.length <= this.chain.length){
            console.error("this is not a longer chain");
            return;
        }
        if(!Blockchain.isValidChain(chain)){
            console.error('not a valid chain');
            return;
        }
        this.chain = chain;
    }

    static isValidChain(chain){
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())){
            return false;
        }
        for(let i=1; i<chain.length; i++){
            const {timestamp, prevHash, hash,nonce, difficulty, data} = chain[i];
            const realLastHash = chain[i - 1].hash;
            const lastDifficulty = chain[i - 1].difficulty;
    
            if(prevHash !== realLastHash){
                return false;
            }
            const validatedHash = cryptoHash(timestamp, prevHash,nonce, difficulty, data);
            if(hash !== validatedHash){
                return false;
            }
            if(Math.abs(lastDifficulty - difficulty) > 1)return false;
        }
        return true;
    }
    
}
const blockchain = new Blockchain();

const result = Blockchain.isValidChain(blockchain.chain);
console.log(result);
console.log(blockchain.chain);
module.exports = Blockchain;