console.log('before');
user = getUser(1, displayUser);
console.log('after');

function getUser(id, callback) {
    setTimeout(() => {
        console.log(' Reading a user from the database ... ');
        callback({id: id, githubUser: 'erik'});
    }, 2000);
}

function displayUser(usr) {
    getRepositories(usr.githubUser, displayRepos);
}

function getRepositories(username, callback) {
    setTimeout(() => {
        console.log(` Calling github for ${username} ... `);
        callback(['repo1', 'repo2', 'repo3']);
    }, 2000);
}

function displayRepos(listOfRepositories) {
    getCommits(listOfRepositories, displayCommits);
}

function getCommits(repos, callback) {
    setTimeout(() => {
        console.log(` Calling github for commits ... `);
        callback(['repo1', 'repo2', 'repo3']);
    }, 2000);
}

function displayCommits(commits) {
    console.log('   All commits ', commits);
}