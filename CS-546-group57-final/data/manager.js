//check manager account

const mongoCollections = require('../config/mongoCollections');
const managers = mongoCollections.manager_collection;
const bcrypt = require('bcrypt');
const saltRounds = 16;

const checkManager = async (
    username, 
    password
  ) => {
    //all undefined error check
    if(typeof(username) === 'undefined'){
      throw 'username is undefined'
    }
    if(typeof(password) === 'undefined'){
      throw 'password is undefined'
    }

    //check all not string error 
    if(typeof(username) !== 'string'){
      throw 'username is not a string'
    }
    if(typeof(password) !== 'string'){
      throw 'password is not a string'
    }
    //username and the password RE check
    username = username.trim();
    password = password.trim();

    if(username.length < 4){
      throw 'username has to be at least 4 characters'
    }
    
    let re = /^[0-9a-zA-Z]+$/;

    if(!username.match(re)){
      throw 'no spaces in the username and only alphanumeric characters'
    }

    if(password.length < 6){
      throw 'password should be at least 6 characters long'
    }

    let re_2 = /^(?=.*[A-Z])(?=.*\d)[^]{6,}$/;
    
    if(!password.match(re_2)){
      throw 'password has to be at least one number and there has to be at least one special character'
    }

    username = username.toLowerCase();

    // compare the password is right or not;
    const collection = await managers();
    let user = await collection.findOne({managerName: username});
    if (await user == null){
      throw 'Either the username or password is invalid';
    }
    let compare = await bcrypt.compare(password, user.passWord)
    if(!compare ){
      throw 'Either the username or password is invalid';
    }
    return { authenticatedUser: true };
}
const creatManager = async (
  managerName,
  passWord
) => {
  if(typeof(managerName) === 'undefined'){
    throw 'managerName is undefined'
  }
  if(typeof(passWord) === 'undefined'){
    throw 'password is undefined'
  }
  if(typeof(managerName)!=='string' || managerName.trim().length == 0){
    throw 'managerName has to be string'
  }
  if(typeof(passWord) !== 'string' || passWord.trim().length == 0){
    throw 'passWord is not string or is empty'
  }
  managerName = managerName.trim();
  passWord = passWord.trim();

  if(managerName.length < 4){
    throw 'managerName has to be at least 4 characters'
  }
  
  let re = /^[0-9a-zA-Z]+$/;

  if(!managerName.match(re)){
    throw 'no spaces in the managerName and only alphanumeric characters'
  }

  if(passWord.length < 6){
    throw 'password should be at least 6 characters long'
  }

  let re_2 = /^(?=.*[A-Z])(?=.*\d)[^]{6,}$/;
  
  if(!passWord.match(re_2)){
    throw 'password has to be at least one number and there has to be at least one special character'
  }
  managerName = managerName.toLowerCase();
    const collection  = await managers();
    let manager = await collection.findOne({managerName: managerName});
    if(await manager!= null){
      throw 'managerName is already in the database';
    }

    // hashcode the password save all information in database
  let hashed = await bcrypt.hash(passWord, saltRounds);
  let creatmanager = {
      managerName : managerName,
      passWord : hashed,
  }
  let creatIn = await collection.insertOne(creatmanager);
  if(await creatIn.insertedCount === 0){
      throw 'cannot creat the new manager'
  }
  return { userInserted: true };
}
module.exports = {
  creatManager,
  checkManager
}
