
const p = new Promise((resolve, reject) => {
    // Async work
    // ...
    setTimeout(() => {
        resolve(1);
        reject(new Error('message!'));
    }, 2000);
    console.log('Waiting ... ');
})

p
    .then(result => console.log('Result', result))
    .catch(err => console.log('Error', err.message));
