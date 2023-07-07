console.log('before');

getUser(1)
    .then(usr => getRepositories(usr.githubUser))
    .then(repos => getCommits(repos[0]))
    .then(commits => displayCommits(commits))
    .catch(err => console.log(err.message));

console.log('after');

function getUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(' Reading a user from the database ... ');
            resolve({id: id, githubUser: 'erik'});
        }, 2000);
    });
}

function getRepositories(username) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(` Calling github for ${username} ... `);
            resolve(['repo1', 'repo2', 'repo3']);
        }, 2000);
    });
}

function getCommits(repos) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(` Calling github for commits ... `);
            resolve(['commit1', 'commit1', 'commit1']);
        }, 2000);
    });
}

function displayCommits(commits) {
    console.log('   All commits ', commits);
}