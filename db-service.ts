////////////////////Cuong and Nicole ////////////////////////////////
import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';
import { ToDoItem, explore_page, share_page, request_page, userD, deal_page, comment } from './src/models';
import RNFS from 'react-native-fs';
import SimpleCrypto from 'react-native-simple-crypto';

enablePromise(true);

//------------------------------ECOEATSSTUFF----------------------------------
////////////////////Cuong////////////////////////////////
const dbName = 'ecoeats.db';
const internalDbPath = `${RNFS.DocumentDirectoryPath}/${dbName}`;

// Function to copy the database from assets to internal storage
export const copyDatabase = async () => {
  try {
    const dbExists = await RNFS.exists(internalDbPath);
    console.log('Internal DB Path:', internalDbPath); // Log the internal DB path
    console.log('Exists:', dbExists);
    if (dbExists) {
      await RNFS.unlink(internalDbPath); // Delete the existing database
      console.log('Old database deleted from internal storage');
    }

    await RNFS.copyFileAssets(`www/${dbName}`, internalDbPath);
    console.log('Database copied to internal storage');
    console.log(internalDbPath);
  } catch (error) {
    console.error('Error copying database: ', error);
    throw error;
  }
};

// Function to get the database connection
export const getEcoEatsDBConnection = async (): Promise<SQLiteDatabase> => {
  const dbPath = `${RNFS.DocumentDirectoryPath}/${dbName}`;
  console.log('Connecting to database at:', dbPath);
  return openDatabase({
    name: dbName,
    // createFromLocation: '~www/ecoeats.db',
    location: 'default', // Ensure it uses the correct location
  });
};

const listTables = async (db: SQLiteDatabase) => {
  try {
    const query = 'SELECT name FROM sqlite_master WHERE type="table"';
    const results = await db.executeSql(query);

    if (results.length > 0) {
      const tables = [];
      for (let i = 0; i < results[0].rows.length; i++) {
        tables.push(results[0].rows.item(i).name);
      }
      console.log('Tables in the database:', tables);
      return tables;
    } else {
      console.log('No tables found in the database');
      return [];
    }
  } catch (error) {
    console.error('Error fetching tables:', error);
    throw error;
  }
};

const checkTables = async () => {
  const db = await getEcoEatsDBConnection(); // Open the database
  const tables = await listTables(db);       // List the tables

  if (tables.length === 0) {
    console.log('No tables found in the database.');
  } else {
    console.log('Tables in the database:', tables);
  }
};

// Share and Explore related functions
////////////////////Cuong////////////////////////////////
export const getSharePage = async (
  db: SQLiteDatabase,
  type: number | undefined,
  keyword: string,
  id: string | undefined
): Promise<share_page[]> => {
  try {
    const sharePageItems: share_page[] = [];
    let query;
    if (keyword === '') {
      query = `SELECT * FROM Share WHERE type=${type}`;
    } else {
      query = `SELECT * FROM Share WHERE type=${type} AND title LIKE '%${keyword}%'`;
    }
    console.log(id);
    console.log(type);
    console.log(keyword);
    if (id && type === undefined && keyword==="") {
      query = `SELECT * FROM Share WHERE share_id IN (${id})`;
    } else if(id===null && type === undefined && keyword===""){
      return [];
    }

    const results = await db.executeSql(query);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        sharePageItems.push(result.rows.item(index));
      }
    });
    return sharePageItems;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get share pages items');
  }
};

export const getExplorePageUser = async(db:SQLiteDatabase, id:string):Promise<explore_page[]> =>{
  try{
    const explorePageItems: explore_page[] = [];
    let query;
    if (id) {
      query = `SELECT * FROM Explores WHERE explore_Id IN (${id})`;
    } else{
      return [];
    }
    const results = await db.executeSql(query);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        explorePageItems.push(result.rows.item(index));
      }
    });
    return explorePageItems;
  }catch(error){
    console.error(error);
    throw Error('Failed to get explore pages items for user profile');
  }
};

////////////////////Cuong////////////////////////////////
export const getRequestPage = async(db:SQLiteDatabase, id:number):Promise<request_page> => {
  try{
    const [results] = await db.executeSql(`SELECT * FROM Request WHERE share_Id=?`, [id]);
    if(results.rows.length > 0){
      const item = results.rows.item(0);
      if(item.description === undefined){
        item.description = '';
      }
      const requestPageItem: request_page = {
        share_Id: item.share_Id,
        user_Id: item.user_Id,
        description: item.description
      };
      return requestPageItem;
    }else{
      throw new Error('No request page found');
    }
  }catch(error){
    console.error(error);
    throw Error('Failed to get request page items');
  }
};

////////////////////Cuong////////////////////////////////
export const getUserDetails = async(db:SQLiteDatabase, id:number): Promise<userD> =>{
  try{
    const [results] = await db.executeSql(`SELECT * FROM User WHERE user_id =?`,[id]);
    if(results.rows.length>0){
      const userP = results.rows.item(0);
      const userProfile: userD = {
        user_Id: userP.user_id,
        name: userP.name,
        birthday: userP.birthday,
        email: userP.email,
        phone_Number: userP.phone_Number,
        address: userP.address,
        followers: userP.followers,
        following: userP.following,
        redeemed_Coupons: userP.redeemed_Coupons,
        bio: userP.bio,
        pf: userP.pf,
        share_Posts: userP.share_Posts,
        explore_Posts: userP.explore_Posts
      };
      return userProfile;
    }else{
      throw new Error('No user found');
    }
  }catch(error){
    console.error(error);
    throw Error('Failed to get request page items');
  }
}

////////////////////Cuong////////////////////////////////
export const saveNewRequestItem = async (db: SQLiteDatabase, user_Id:number,description:string) => {
  try {
    const insertRequestQuery = `INSERT INTO Request (user_Id, description) VALUES (${user_Id}, "${description}")`;
    console.log(insertRequestQuery);
    return db.executeSql(insertRequestQuery);
  } catch (error) {
    console.error('Error saving request item:', error);
    throw error;
  }
};

////////////////////Cuong////////////////////////////////
export const getLastestRequestItem =  async(db:SQLiteDatabase) =>{
  try{
    const getShareIdQuery = `SELECT share_Id FROM Request ORDER BY share_Id DESC LIMIT 1`;
    return Number(db.executeSql(getShareIdQuery));
  }catch(error){
    console.log('Failed to get latest request item');
  }
}

////////////////////Cuong////////////////////////////////
export const saveNewShareItem = async (db: SQLiteDatabase, type:number, title:string,tags:string|null,address:string,picture:string,expiration:string, id: number) => {
  try {
    const insertShareQuery = `INSERT INTO Share (share_Id, type, title, tags, address, picture, expiration) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    return db.executeSql(insertShareQuery, [id,type, title, tags, address, picture,expiration]);
  } catch (error) {
    console.error('Error saving share item:', error);
    throw error;
  }
};

////////////////////Cuong////////////////////////////////
export const updateUserSharePosts = async (db: SQLiteDatabase, share_Id:number, user_Id:number) => {
  try{
    console.log("testing backend of adding share"+user_Id);
    let query = `SELECT * FROM User WHERE user_Id = ${user_Id}`;
    let [output] = await db.executeSql(query);
    let newSharePosts;
    if(output.rows.item(0).share_Posts){
      newSharePosts = output.rows.item(0).share_Posts.concat(",",share_Id);
    }else{
      newSharePosts = share_Id.toString();
    }
    query = `UPDATE User SET share_Posts = '${newSharePosts}' WHERE user_Id = ${user_Id}`;
    return db.executeSql(query);
  }catch(error){
    console.log('Failed to update user share posts');
  }
};

////////////////////Cuong////////////////////////////////
export const updateUserExplorePosts = async (db: SQLiteDatabase, explore_Id:number, user_Id:number) => {
  try{
    console.log("testing backend of adding share"+user_Id);
    let query = `SELECT * FROM User WHERE user_Id = ${user_Id}`;
    let [output] = await db.executeSql(query);
    let newExplorePosts;
    if(output.rows.item(0).explore_Posts){
      newExplorePosts = output.rows.item(0).explore_Posts.concat(",",explore_Id);
    }else{
      newExplorePosts = explore_Id.toString();
    }
    query = `UPDATE User SET explore_Posts = '${newExplorePosts}' WHERE user_Id = ${user_Id}`;
    return db.executeSql(query);
  }catch(error){
    console.log('Failed to update user share posts');
  }
};

//Profile page related stuff
////////////////////Nicole////////////////////////////////

export const hashPassword = async (password: string): Promise<string> => {
  // Convert the password string to an ArrayBuffer
  const passwordBuffer = SimpleCrypto.utils.convertUtf8ToArrayBuffer(password);

  // Hash the ArrayBuffer using SHA-256
  const hash = await SimpleCrypto.SHA.sha256(passwordBuffer);

  // Convert the hash (ArrayBuffer) to a hexadecimal string
  return SimpleCrypto.utils.convertArrayBufferToHex(hash);
};

////////////////////Cuong&Nicole////////////////////////////////
export const checkLoginDetails = async (db: SQLiteDatabase, username: string, loginHashedPassword: string) => {
  try {
    const profileQuery = `SELECT * FROM User_credential WHERE username = ?`;
    const [results] = await db.executeSql(profileQuery, [username]);

    if (results.rows.length > 0) {
      const storedHashedPassword = results.rows.item(0).password;

      // Compare the hashed passwords
      if (storedHashedPassword === loginHashedPassword) {
        // Return the entire user data object
        return results.rows.item(0);
      } else {
        throw new Error('Invalid password');
      }
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error("Error in checkLoginDetails:", error);
    throw new Error('Failed to get user credentials');
  }
};

////////////////////Cuong&Nicole////////////////////////////////
export const registeringUser = async (db: SQLiteDatabase, username: string, password: string, accountType: number, email: string) => {
  try {
    // Insert into User_credential table with the hashed password

    const insertAccCredentialQuery = `INSERT INTO User_credential (username, password, account_Type) VALUES (?, ?, ?)`;
    const result = await db.executeSql(insertAccCredentialQuery, [username, password, accountType]);

    const userId = result[0]["insertId"]; // Get the inserted user ID
    console.log("Registering Hashed Password in db" + password);

    // Create a default name using the user ID
    const name = 'NewUser'.concat(userId.toString());

    // Insert into User table
    const insertAccProfileQuery = `INSERT INTO User (user_Id, name, email) VALUES (?, ?, ?)`;
    await db.executeSql(insertAccProfileQuery, [userId, name, email]);

    console.log("Registered user:", name);

    // Return the user ID
    return userId;
  } catch (error) {
    console.error("Error in registeringUser:", error);
    throw new Error('Failed to add user');
  }
};

////////////////////Cuong////////////////////////////////
export const updateProfilePicture = async(db:SQLiteDatabase, user_Id:number,picture:any,name:string|null) =>{
  try{
    console.log("testing backend of updating profile picture");
    console.log(picture);
    console.log(name);
    let query;
    if(name == null || name == ""){
      query = `UPDATE User SET pf = "${picture}" WHERE user_Id = ${user_Id}`;
    }else if (picture == null){
      query = `UPDATE User SET name = "${name}" WHERE user_Id = ${user_Id}`;
    }else{
      query = `UPDATE User SET name = "${name}", pf = "${picture}" WHERE user_Id = ${user_Id}`;
    }
    console.log(query);
    return db.executeSql(query);
  }catch(error){
    console.log('Failed to update user profile picture');
  }
};

////////////////////Cuong////////////////////////////////
export const getAccountType = async (db: SQLiteDatabase, userId: number): Promise<number> => {
  try {
    const query = `SELECT account_Type FROM User_credential WHERE user_Id = ?`;
    const [result] = await db.executeSql(query, [userId]);

    if (result.rows.length > 0) {
      return result.rows.item(0).account_Type;
    } else {
      throw new Error('User type not found');
    }
  } catch (error) {
    console.error('Error in getAccountType:', error);
    throw error;
  }
};

//Deals page related stuff
////////////////////Nicole////////////////////////////////

// Fetch deals from the database
export const getDealsPage = async(db: SQLiteDatabase, keyword: string): Promise<deal_page[]> => {
  try {
    const deals: deal_page[] = [];
    let query = `SELECT * FROM Deals`;

    if (keyword) {
      query += ` WHERE title LIKE '%${keyword}%' OR description LIKE '%${keyword}%'`;
    }

    const results = await db.executeSql(query);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        deals.push(result.rows.item(index));
      }
    });

    return deals;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get deals');
  }
};

////////////////////Nicole////////////////////////////////
// Insert a new deal
export const saveNewDeal = async(db: SQLiteDatabase, deal: deal_page) => {
  try{
    console.log(deal);
    const insertQuery = `INSERT INTO Deals (title, description, picture, date_created, isBusinessAccount, isRedeemed) VALUES ('?','?','?','?',0,0)`;
    return db.executeSql(insertQuery,[deal.title,deal.description,deal.picture,deal.date_created]);
  }catch(error){
    console.error(error);
    throw Error('Failed to add new deal');
  }
};

////////////////////Nicole////////////////////////////////
export const updateDeal = async(db: SQLiteDatabase, deal: deal_page) => {
  const updateQuery = `
    UPDATE Deals 
    SET title = '${deal.title}', 
        description = '${deal.description}', 
        picture = '${deal.picture}'
    WHERE deal_Id = ${deal.deal_Id}
  `;

  return db.executeSql(updateQuery);
};

export const deleteDeal = async(db: SQLiteDatabase, deal_Id: number) => {
  const deleteQuery = `DELETE FROM Deals WHERE deal_Id = ${deal_Id}`;

  return db.executeSql(deleteQuery);
};

////////////////////Nicole////////////////////////////////
export const getCommentsForDeal = async(db: SQLiteDatabase, dealId: number): Promise<comment[]> => {
  try {
    const comments: comment[] = [];
    const query = `SELECT * FROM Comments WHERE deal_Id = ?`;
    const results = await db.executeSql(query, [dealId]);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        comments.push(result.rows.item(index));
      }
    });
    return comments;
  } catch (error) {
    console.error('Failed to get comments', error);
    throw Error('Failed to get comments');
  }
};

////////////////////Nicole////////////////////////////////
export const getRedeemedState = async (db: SQLiteDatabase, dealId: number): Promise<boolean> => {
  try {
    const [result] = await db.executeSql('SELECT isRedeemed FROM Deals WHERE deal_Id = ?', [dealId]);
    if (result.rows.length > 0) {
      return result.rows.item(0).isRedeemed === 1;
    }
    return false;
  } catch (error) {
    console.error('Failed to get redeemed state', error);
    throw Error('Failed to get redeemed state');
  }
};

////////////////////Nicole////////////////////////////////
export const saveRedeemedState = async (db: SQLiteDatabase, dealId: number, redeemed: boolean) => {
  try {
    await db.executeSql('UPDATE Deals SET isRedeemed = ? WHERE deal_Id = ?', [redeemed ? 1 : 0, dealId]);
  } catch (error) {
    console.error('Failed to save redeemed state', error);
    throw Error('Failed to save redeemed state');
  }
};


//Explore page related stuff
////////////////////Nicole////////////////////////////////
export const getExplorePage = async(db: SQLiteDatabase, type: number, keyword: string): Promise<explore_page[]> => {
  try {
    const explores: explore_page[] = [];
    let query = `SELECT * FROM Explores WHERE type=${type}`;

    if (keyword) {
      query += ` AND (title LIKE '%${keyword}%' OR description LIKE '%${keyword}%')`;
    }

    const results = await db.executeSql(query);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        explores.push(result.rows.item(index));
      }
    });

    return explores;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get explores');
  }
};
////////////////////Nicole////////////////////////////////
export const saveNewExplore = async(db: SQLiteDatabase, explore: explore_page) => {
  try{
    const insertQuery = `
    INSERT INTO Explores (title, description, picture, date_created,type,user_Id) 
    VALUES ('${explore.title}', '${explore.description}', '${explore.picture}', '${explore.date_created}',${explore.type},${explore.user_Id})
    `;
    return db.executeSql(insertQuery);
  }catch(error){
    console.error(error);
    throw Error('Failed to add explore');
  }
};

//comments
////////////////////Nicole////////////////////////////////
export const getCommentsForExplore = async (db: SQLiteDatabase, explore_Id: number): Promise<comment[]> => {
  try {
    const commentsQuery = `
      SELECT * FROM Comments WHERE explore_Id = ? ORDER BY parent_comment_id ASC, comment_Id ASC
    `;
    const [results] = await db.executeSql(commentsQuery, [explore_Id]);

    const comments: comment[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      comments.push(results.rows.item(i));
    }
    return comments;
  } catch (error) {
    console.error('Error retrieving comments:', error);
    throw Error('Failed to retrieve comments');
  }
};

////////////////////Nicole////////////////////////////////
export const saveNewComment = async (db: SQLiteDatabase, comment: comment) => {
  try {
    const insertQuery = `
      INSERT INTO Comments (explore_Id, user_Name, comment_Text, parent_comment_id, like_count) 
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.executeSql(insertQuery, [
      comment.explore_Id,
      comment.user_Name,
      comment.comment_Text,
      comment.parent_comment_id,
      comment.like_count,
    ]);
  } catch (error) {
    console.error('Error saving comment:', error);
    throw new Error('Failed to save comment');
  }
};

////////////////////Nicole////////////////////////////////
export const likeComment = async (db: SQLiteDatabase, userId: number, commentId: number) => {
  try {
    // Add a like to the CommentLikes table
    await db.executeSql(
      `INSERT INTO CommentLikes (user_Id, comment_Id) VALUES (?, ?)`,
      [userId, commentId]
    );

    // Update the like count in the Comments table
    const [likeCountResult] = await db.executeSql(
      `SELECT COUNT(*) AS likeCount FROM CommentLikes WHERE comment_Id = ?`,
      [commentId]
    );
    const newLikeCount = likeCountResult.rows.item(0).likeCount;

    await db.executeSql(
      `UPDATE Comments SET like_count = ? WHERE comment_Id = ?`,
      [newLikeCount, commentId]
    );

    return newLikeCount;
  } catch (error) {
    console.error('Error liking comment:', error);
    throw new Error('Failed to like comment');
  }
};

////////////////////Nicole////////////////////////////////
export const unlikeComment = async (db: SQLiteDatabase, userId: number, commentId: number) => {
  try {
    // Remove the like from the CommentLikes table
    await db.executeSql(
      `DELETE FROM CommentLikes WHERE user_Id = ? AND comment_Id = ?`,
      [userId, commentId]
    );

    // Update the like count in the Comments table
    const [likeCountResult] = await db.executeSql(
      `SELECT COUNT(*) AS likeCount FROM CommentLikes WHERE comment_Id = ?`,
      [commentId]
    );
    const newLikeCount = likeCountResult.rows.item(0).likeCount;

    await db.executeSql(
      `UPDATE Comments SET like_count = ? WHERE comment_Id = ?`,
      [newLikeCount, commentId]
    );

    return newLikeCount;
  } catch (error) {
    console.error('Error unliking comment:', error);
    throw new Error('Failed to unlike comment');
  }
};

////////////////////Nicole////////////////////////////////
export const checkIfUserLikedComment = async (db: SQLiteDatabase, userId: number, commentId: number) => {
  try {
    const [result] = await db.executeSql(
      `SELECT * FROM CommentLikes WHERE user_Id = ? AND comment_Id = ?`,
      [userId, commentId]
    );

    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking if user liked comment:', error);
    throw new Error('Failed to check if user liked comment');
  }
};


