import t from"crypto-js/sha256";var i=/*#__PURE__*/function(){function i(t,i,n,s){this.data=void 0,this.index=void 0,this.timestamp=void 0,this.previousHash=void 0,this.hash=void 0,this.nonce=void 0,this.data=t,this.index=i,this.timestamp=n,this.previousHash=s,this.hash=this.calculateHash(),this.nonce=0}var n=i.prototype;return n.calculateHash=function(){var i=this.index+this.timestamp+JSON.stringify(this.data)+this.nonce+this.previousHash;return t(i).toString()},n.mineBlock=function(t){for(var i=Array(t+1).join("0"),n=0,s=this.calculateHash();s.substring(0,t)!==i;)n++,s=this.calculateHashWithNonce(n);this.nonce=n,this.hash=s,console.log("Block mined: "+this.hash)},n.calculateHashWithNonce=function(i){return t(this.index+this.timestamp+JSON.stringify(this.data)+i+this.previousHash).toString()},i}(),n=/*#__PURE__*/function(){function t(t){var i;void 0===t&&(t=4),this.chain=void 0,this.difficulty=void 0,this.pendingTransactions=void 0,this.miningReward=void 0,this.chain=[this.genesisBlock()],this.difficulty=null!=(i=t)?i:4,this.pendingTransactions=[],this.miningReward=100}var n=t.prototype;return n.genesisBlock=function(){return new i(null,0,0,"")},n.getLastBlock=function(){return this.chain[this.chain.length-1]},n.generateBlock=function(t){var n=this.getLastBlock().index+1,s=(new Date).getTime()/1e3,e=this.getLastBlock().hash,r=new i(t,n,s,e);return r.mineBlock(this.difficulty),this.isValid()?(console.log("VALIDO"),this.chain.push(r),!0):(console.log("INVALIDO"),!1)},n.isValid=function(){if(JSON.stringify(this.genesisBlock())!==JSON.stringify(this.chain[0]))return console.log("GENESIS BLOCK FALSO"),console.log("GEN",JSON.stringify(this.genesisBlock())),console.log("[0]",JSON.stringify(this.chain[0])),!1;for(var t=1;t<this.chain.length;t++){var i=this.chain[t],n=this.chain[t-1];if(i.hash!==i.calculateHash())return console.log("CURRENT BLOCK HASH FALSO"),!1;if(n.hash!==i.previousHash)return console.log("PREVIOUS BLOCK HASH FALSO"),!1}return!0},t}();function s(t,i){(null==i||i>t.length)&&(i=t.length);for(var n=0,s=new Array(i);n<i;n++)s[n]=t[n];return s}function e(t,i){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(n)return(n=n.call(t)).next.bind(n);if(Array.isArray(t)||(n=function(t,i){if(t){if("string"==typeof t)return s(t,i);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?s(t,i):void 0}}(t))||i&&t&&"number"==typeof t.length){n&&(t=n);var e=0;return function(){return e>=t.length?{done:!0}:{done:!1,value:t[e++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r=/*#__PURE__*/function(){function i(t,i,n){void 0===n&&(n=""),this.previousHash=void 0,this.timestamp=void 0,this.transactions=void 0,this.nonce=0,this.hash=this.calculateHash(),this.previousHash=n,this.timestamp=t,this.transactions=i,this.nonce=0,this.hash=this.calculateHash()}var n=i.prototype;return n.calculateHash=function(){return t(this.previousHash+this.timestamp+JSON.stringify(this.transactions)+this.nonce).toString()},n.mineBlock=function(t){for(var i=Array(t+1).join("0"),n=0,s=this.calculateHash();s.substring(0,t)!==i;)n++,s=this.calculateHashWithNonce(n);this.nonce=n,this.hash=s,console.log("Block mined: "+this.hash)},n.calculateHashWithNonce=function(i){return t(this.previousHash+this.timestamp+JSON.stringify(this.transactions)+i).toString()},n.hasValidTransactions=function(){for(var t,i=e(this.transactions);!(t=i()).done;)if(!t.value.isValid())return!1;return!0},i}(),a=new(0,require("elliptic").ec)("secp256k1"),o=/*#__PURE__*/function(){function i(t,i,n){this.fromAddress=void 0,this.toAddress=void 0,this.amount=void 0,this.timestamp=void 0,this.signature=null,this.fromAddress=t,this.toAddress=i,this.amount=n,this.timestamp=Date.now()}var n=i.prototype;return n.calculateHash=function(){return t(this.fromAddress+this.toAddress+this.amount+this.timestamp).toString()},n.signTransaction=function(t){if(t.getPublic("hex")!==this.fromAddress)throw new Error("You cannot sign transactions for other wallets!");var i=this.calculateHash(),n=t.sign(i,"base64");this.signature=n.toDER("hex")},n.isValid=function(){if(null===this.fromAddress)return!0;if(!this.signature||0===this.signature.length)throw new Error("No signature in this transaction");return a.keyFromPublic(this.fromAddress,"hex").verify(this.calculateHash(),this.signature)},i}(),h=/*#__PURE__*/function(){function t(t){this.chain=void 0,this.difficulty=void 0,this.pendingTransactions=void 0,this.miningReward=void 0,this.chain=[this.genesisBlock()],this.difficulty=null!=t&&t.difficulty?null==t?void 0:t.difficulty:4,this.pendingTransactions=[],this.miningReward=100}var i=t.prototype;return i.genesisBlock=function(){return new r(Date.now(),[],"0")},i.getLastBlock=function(){return this.chain[this.chain.length-1]},i.minePendingTransactions=function(t){var i=new o(null,t,this.miningReward);this.pendingTransactions.push(i);var n=new r(Date.now(),this.pendingTransactions,this.getLastBlock().hash);n.mineBlock(this.difficulty),this.chain.push(n),this.pendingTransactions=[]},i.addTransaction=function(t){if(!t.fromAddress||!t.toAddress)throw new Error("Missing (from address) or (to address) in the transaction.");if(!t.isValid())throw new Error("Invalid transaction");if(t.amount<=0)throw new Error("Transaction amount should not to be 0.");var i=this.getBalanceByAddress(t.fromAddress);if(i<t.amount)throw new Error("Not enough balance");var n=this.pendingTransactions.filter(function(i){return i.fromAddress===t.fromAddress});if(n.length>0&&n.map(function(t){return t.amount}).reduce(function(t,i){return t+i})+t.amount>i)throw new Error("Pending transactions for this wallet is higher than its balance.");this.pendingTransactions.push(t)},i.getBalanceByAddress=function(t){for(var i,n=0,s=e(this.chain);!(i=s()).done;)for(var r,a=e(i.value.transactions);!(r=a()).done;){var o=r.value;o.fromAddress===t&&(n-=o.amount),o.toAddress===t&&(n+=o.amount)}return n},i.getAllTransactionsForWallet=function(t){for(var i,n=[],s=e(this.chain);!(i=s()).done;)for(var r,a=e(i.value.transactions);!(r=a()).done;){var o=r.value;o.fromAddress!==t&&o.toAddress!==t||n.push(o)}return n},i.isValid=function(){if(JSON.stringify(this.genesisBlock())!==JSON.stringify(this.chain[0]))return!1;for(var t=1;t<this.chain.length;t++){var i=this.chain[t],n=this.chain[t-1];if(!i.hasValidTransactions())return!1;if(i.hash!==i.calculateHash())return!1;if(n.hash!==i.previousHash)return!1}return!0},t}(),c=new(0,require("elliptic").ec)("secp256k1").keyFromPrivate("7c4c45907dec40c91bab3480c39032e90049f1a44f3e18c3e07c23e3273995cf"),l=c.getPublic("hex"),u={local:"Três Corações",data:(new Date).toISOString(),remetente:"BH transporter",destinatario:"Centro de Distribuição Nanico Bufador"};console.log(u);var d=new n,f=new n,g=new h(8);g.minePendingTransactions(l);var v=new o(l,"myWalletAddress",10);v.signTransaction(c),g.addTransaction(v),g.minePendingTransactions(l),f.generateBlock(u),d.generateBlock(u),console.log("BCHAIN",f),console.log("GENERIC CHAIN",d),console.log("TYPECOIN",g);
//# sourceMappingURL=index.m.js.map
