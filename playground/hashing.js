const {SHA256} = require('crypto-js');
const bcrypt = require('bcryptjs');
var message = 'I am user number 3';

var hash = SHA256(message).toString();

console.log(`Message ${message}`);
console.log(`hash: ${hash}`);

var data = {
    id: 4
};
var token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'I am a secret salt used to prevent manipulating data and hashing it').toString()
}

token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();

var resultHash = SHA256(JSON.stringify(token.data)+'I am a secret salt used to prevent manipulating data and hashing it').toString();

if(resultHash===token.hash){
    console.log('Data was not changed');
} else {
    console.log('Data was changed. Do not trust!');
}

var password = '123abcc';

bcrypt.genSalt(10, (err, salt)=> {
    bcrypt.hash(password, salt, (err, hash)=>{
        console.log(hash);
    });
});

var hashedPassword = '$2a$10$DmyLpwDCs24TWpoOGqi1M.I6o7dprIh3BLBjXVKUjsLmRRTrJcVOS';

bcrypt.compare(password, hashedPassword, (err, res)=>{
    console.log(res);
})