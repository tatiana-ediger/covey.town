const { pg } = require('pg');

var connectionString = `postgres://kisvchxzkztlyx:02c7828881c5e71290f509916361926b80923b88c0dddeaf170cb111cdbb4c51@${"ec2-18-204-101-137.compute-1.amazonaws.com"}/ip:5432/d46idgb6list1r`

var pgClient = new pg.Client(connectionString);

pgClient.connect();

/**  
 * checks if a user already exists, if so, updates their account, otherwise creates a new user 
 * RETURN type: {success: true/false}
 */
export async function upsertUser(userInfo: UserInfo) {
    // UPDATE table SET ({originalA ?? newA})
}

/** 
 * gets user info given an email 
 * RETURN type: AccountTypes.User interface
 */
export async function getUser() {}

/**
 * deletes a user, specified by their email
 * RETURN type: {success: true/false}
 */
export async function deleteUser() {}


/**
 * below functions maybe unnecessary?
 */

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