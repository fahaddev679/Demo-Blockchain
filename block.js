const {GENESIS_DATA, MINE_RATE} = require("./config");
const cryptoHash = require('./hash');
const hexToBinary = require("hex-to-binary");
class Block {
    constructor({timestamp, prevHash, hash, data, nonce, difficulty}){
        this.timestamp = timestamp;
        this.prevHash = prevHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static genesis(){
        return new this(GENESIS_DATA);
    }

    static mineBlock({prevBlock, data}){
        let hash,timestamp;
        const prevHash = prevBlock.hash;
        let {difficulty} = prevBlock;
        let nonce = 0;
        do{
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({originalBlock: prevBlock, timestamp});
            hash = cryptoHash(timestamp, prevHash,nonce, difficulty, data);
        }while(hexToBinary(hash).substring(0, difficulty)!== "0".repeat(difficulty));
        return new this({
            timestamp,prevHash,hash, nonce, difficulty,data
        });
    };

    static adjustDifficulty({originalBlock, timestamp}){
        const {difficulty} = originalBlock;
        if(difficulty < 1){
            return 1;
        };
        const difference = timestamp - originalBlock.timestamp;
        if(difference > MINE_RATE) return difficulty -1;
        if(difference < MINE_RATE) return difficulty + 1;
    }
}

const genesisBlock = Block.genesis();
console.log(genesisBlock);

const block1 = new Block({
    timestamp: "00/00/00",
    prevHash: "0xabcc",
    hash:"0x1234",
    data:[]
});

//const result = Block.mineBlock({prevBlock:block1, data:"block3"});
//console.log(result);

module.exports = Block;