const { pg } = require('pg-promise')();

var connectionString = `postgres://kisvchxzkztlyx:02c7828881c5e71290f509916361926b80923b88c0dddeaf170cb111cdbb4c51@${"ec2-18-204-101-137.compute-1.amazonaws.com"}/ip:5432/d46idgb6list1r`

var pgClient = pg(connectionString);

pgClient.connect();

interface UserInfo {
    user_id: string,
    email: string,
    username: string,
    use_audio: boolean,
    use_video: boolean,
    JoinedTowns: TownInfo[],
}
interface TownInfo {
    user_id: string,
    server_id: number,
    map_id: number,
    x_pos:number,
    y_pos: number,
}

/**  
 * checks if a user already exists, if so, updates their account, otherwise creates a new user 
 * RETURN type: {success: true/false}
 */
export async function upsertUser(userInfo: UserInfo) : Promise<Boolean> {
    const user_id = userInfo.user_id
    try {
        const userIdQuery = await pgClient.query(`SELECT user_id FROM user_preferences WHERE user_id=${user_id};`)
        if (user_id === userIdQuery) {
            pgClient.query(`UPDATE user_preferences SET email = ${userInfo.email} WHERE user_id=${user_id};`)
            pgClient.query(`UPDATE user_preferences SET username = ${userInfo.username} WHERE user_id=${user_id};`)
            pgClient.query(`UPDATE user_preferences SET use_audio = ${userInfo.use_audio} WHERE user_id=${user_id};`)
            pgClient.query(`UPDATE user_preferences SET use_video= ${userInfo.use_video} WHERE user_id=${user_id};`)
            return true;
        } else {
            pgClient.query(`INSERT INTO user_preferences (user_id, username, use_audio, use_video) VALUES 
            (${user_id}, ${userInfo.username}, ${userInfo.use_audio}, ${userInfo.use_video});`)
            return true;
        }
    } catch {
        return false
    }
}

/** 
 * gets user info given an email 
 * RETURN type: AccountTypes.User interface
 */
export async function getUserByID(user_id: string) : Promise<UserInfo> {
    /**
     * going to need to get for each user: ID, email, username, use_audio, use_video, AccountTypes.JoinedTown[]
     * Where the JoinedTown[] comes from maps table (which I think should be renamed to towns table) 
     * (check John's discord message)
     */
    const email = await pgClient.query(`SELECT email FROM user_preferences WHERE user_id=${user_id};`);
    const username = await pgClient.query(`SELECT username FROM user_preferences WHERE user_id=${user_id};`);
    const use_audio = await pgClient.query(`SELECT use_audio FROM user_preferences WHERE user_id=${user_id};`);
    const use_video = await pgClient.query(`SELECT use_video FROM user_preferences WHERE user_id=${user_id};`);
    
    let townInfoQuery = await pgClient.query(`SELECT * from towns WHERE user_id=${user_id};`);
    const townArray = new Array<TownInfo>();

    pgClient.each(townInfoQuery, [], (town: { user_id: string; server_id: number; map_id: number; x_pos: number; y_pos: number; }) => {
        let townInfo: TownInfo = { user_id : town.user_id, server_id : town.server_id, map_id : town.map_id, x_pos : town.x_pos, y_pos : town.y_pos, }
        townArray.push(townInfo);
    })
        
    let userInfo: UserInfo = { user_id: user_id, email: email, username: username, use_audio: use_audio, use_video: use_video, JoinedTowns: townArray }
    
    return userInfo;
}

/**
 * deletes a user, specified by their email
 * RETURN type: {success: true/false}
 */
export async function deleteUser(user_id: string) : Promise<Boolean> {
    await pgClient.query(`DELETE FROM towns WHERE user_id=${user_id};`);
    let deletedRows = await pgClient.query(`DELETE FROM user_preferences WHERE user_id=${user_id};`);
    if (deletedRows == 0) {
        return false;
    }
    return true;
}

// Adds the a server to the list of servers that a user is part of
export async function addTownToTownArray(townInfo: TownInfo) : Promise<Boolean> {
    try {
        const townIDQuery = await pgClient.query(`SELECT server_id FROM towns WHERE server_id=${townInfo.server_id} AND user_id=${townInfo.user_id};`);
        if (townIDQuery === townInfo.server_id) {
            pgClient.query(`UPDATE user_preferences SET = map_id = ${townInfo.map_id} WHERE server_id=${townInfo.server_id};`);
            pgClient.query(`UPDATE user_preferences SET x_pos = ${townInfo.x_pos} WHERE server_id=${townInfo.server_id};`);
            pgClient.query(`UPDATE user_preferences SET y_pos = ${townInfo.y_pos} WHERE server_id=${townInfo.server_id};`);
            return true;
        } else {
            await pgClient.query(`INSERT INTO towns (user_id, server_id, map_id, x_pos, y_pos) VALUES 
            (${townInfo.user_id}, ${townInfo.server_id}, ${townInfo.map_id}, ${townInfo.x_pos}, ${townInfo.y_pos});`);
            return true;
        }
    } catch {
        return false;
    }
}

pgClient.end();