const mongoose = require('mongoose');

const id = new mongoose.Types.ObjectId();
// const id2 = new mongoose.Types.ObjectId();
console.log(id.getTimestamp());
// console.log(id2);

const isValid = mongoose.Types.ObjectId.isValid('666');
console.log(isValid);