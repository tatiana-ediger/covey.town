const { pg } = require('pg');

var connectionString = `postgres://kisvchxzkztlyx:02c7828881c5e71290f509916361926b80923b88c0dddeaf170cb111cdbb4c51@${"ec2-18-204-101-137.compute-1.amazonaws.com"}/ip:5432/d46idgb6list1r`

var pgClient = new pg.Client(connectionString);

pgClient.connect();

/**  creates a new user */
export function createUser() {

}

// updates the user information for the given user
// can update username, email, setting preferences 
function updateUserInfo(userInfo: UserInfo) {
    // UPDATE table SET ({originalA ?? newA})
}

// retrieves the list of JoinedServers for a given user 
function getJoinedServers() {

}

// retrieves the Username for the given user
function getUsername() {

}


// Adds the a server to the list of servers that a user is part of
function addServerToServerArray(server: String) {

}



pgClient.end();