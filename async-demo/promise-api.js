const p1 = new Promise((resolve) => {
    setTimeout(() => {
        console.log('1 is ready ');
        resolve(1);
    }, 2000);
    console.log('start 1 ');
});

const p2 = new Promise((resolve) => {
    setTimeout(() => {
        console.log('2 is ready ');
        resolve(2);
    }, 3000);
    console.log('start 2 ');
});

Promise.all([p1, p2])
    .then((result) => {
        console.log('Both are ready ', result);
    });
