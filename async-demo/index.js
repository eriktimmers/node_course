console.log('before');
user = getUser(1, (usr) => {
    console.log(usr);
    getRepositories(usr.githubUser, (listOfRepositories) => {
        console.log('   All repositories ', listOfRepositories);

    });
});
console.log('after');

function getUser(id, callback) {
    setTimeout(() => {
        console.log(' Reading a user from the database ... ');
        callback({id: id, githubUser: 'erik'});
    }, 2000);
}

function getRepositories(username, callback) {
    setTimeout(() => {
        console.log(` Calling github for ${username} ... `);
        callback(['repo1', 'repo2', 'repo3']);
    }, 2000);
}
