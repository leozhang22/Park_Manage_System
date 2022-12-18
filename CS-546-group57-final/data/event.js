const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.user_collection;
const events = mongoCollections.event_collection;
const { ObjectId } = require('mongodb');
const userFunction = require("./users")

const validation = (string) => {
    let regex = /[^a-zA-Z0-9 ]/
    if (!string) throw 'No string'
    if (string === undefined) throw 'undefined string'
    if (typeof string != 'string') throw 'Invalid string type'
    string = string.trim();
    if (string.length === 0) throw 'Invalid string'
    if (!regex.test(string)) throw 'Invalid string'

}

const dateValidation = (date) => {
    let DA = [ 0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    if (date.indexOf('/') == -1) {
        throw 'please use mm/dd/yyyy format';
    }
    let arrD = date.split('/');
    if (arrD.length != 3) {
        throw 'please enter valid format'
    }
    let m = parseInt(arrD[ 0 ], 10);
    let d = parseInt(arrD[ 1 ], 10);
    let y = parseInt(arrD[ 2 ], 10);
    if (isNaN(m) || isNaN(d) || isNaN(y)) {
        throw 'the date is invaild';
    }
    let curDate = new Date();
    let curYear = curDate.getFullYear()
    let curMonth = curDate.getMonth()+1;
    let curDay = curDate.getDate();

    if (y < curYear) {
        throw 'the year of date cannot be past'
    }
    if (y === curYear && m < curMonth) {
        throw 'the month of date cannot be past'
    }
    if (y === curYear && m === curMonth && d < curDay) {
        throw 'the day of date cannot be past'
    }
    let gap = (y - curYear) * 356 + (m - curMonth) * 30 + (d - curDay);
    if (gap > 365) {
        throw 'sorry we only can add the event within a year'
    }
}

const getAllEvents = async () => {
    const eventCollection = await events();
    const eventList = await eventCollection.find({}).toArray();
    if (!eventList) throw 'No users in system!';
    return eventList;
}


const getSportsEvents = async () => {
    const eventCollection = await events()
    const sportEvents = await eventCollection.find({type:"sports"}).toArray();
    if (!sportEvents) throw 'No sports events found'
    return sportEvents;
}

const getArtEvents = async () => {
    const eventCollection = await events()
    const artEvents = await eventCollection.find({ type: "art" }).toArray()
    if (!artEvents) throw 'No arts events found'
    return artEvents;
}

const getConcertEvents = async () => {
    const eventCollection = await events()
    const concertEvents = await eventCollection.find({ type: "concert" }).toArray()
    if (!concertEvents) throw 'No concerts events found'
    return concertEvents;
}

const searchByDate = async (
    date
) => {
    dateValidation(date)

    
    const eventCollection = await events()
    const eventsByDate = await eventCollection.findOne({ date: date })
    if (await eventsByDate == null) throw 'No events found with this date'
    eventsByDate._id = await eventsByDate._id.toString();

    return await eventsByDate;
}

const searchByEventName = async (
    name
) => {
    if(typeof(name)==='undefined'||typeof(name) != 'string'){
        throw 'the eventName is invaild'
    }
    name = name.trim().toLowerCase()
    const eventCollection = await events()
    const eventsByName = await eventCollection.findOne({ name: name })
    if (await eventsByName == null) throw 'No events found with this name'
    eventsByName._id = await eventsByName._id.toString();
    return await eventsByName;
}

const getEventById = async (id) => {
    //checking id
    if (id === undefined) throw 'Invalid id'
    id = id.trim().toString();
    if (id.length === 0)
        throw `Error: id cannot be an empty string or just spaces`;
    const eventCollection = await events();
    let event = await eventCollection.findOne({ _id: ObjectId(id) });

    if (!event) throw 'No events found with this id'
    event._id = event._id.toString();
    return event;
}

//manager can opreate
const addEvent = async (
    type,
    name,
    capacity,
    date
) => {
    if(typeof(type) === 'undefined' || 
    typeof(name) === 'undefined' ||
    typeof(capacity) === 'undefined' ||
    typeof(date) === 'undefined'){
        throw 'the input is undefined'
    }
    if(typeof(type)!='string' || typeof (name ) != 'string') throw 'the input is not string'
    dateValidation(date)
    type = type.trim().toLowerCase();
    name = name.trim().toLowerCase();

    //checking type
    if (type != "sports" && type != "art" && type != "concert") throw 'Invalid type'

    //checking capacity
    if (!capacity) throw 'Invalid capacity'
    if (capacity === undefined) throw 'undefined capacity'
    if (typeof capacity != 'number') throw 'Invalid capacity type'
    if (capacity < 10 || capacity > 100) throw 'Capacity must be between 10 and 100'

    const collection = await events();
    let event = await collection.findOne({ name: name });
    if (await event != null) {
        throw 'eventName is already in the database';
    }

    let ans = {
        type: type,
        name: name,
        capacity: capacity,
        date: date,
        space: capacity,
        registerUsers: [],
        reviews: [],
        overallRating: 0
    }

    const createInfo = await collection.insertOne(ans);
    if (createInfo.insertedCount === 0) {
        throw 'Could not create'
    }

    return { message: "Event created successfully" }
}

const deleteEvent = async (
    id
) => {
    //checking id
    if (id === undefined) throw 'Invalid id'
    if (typeof id !== 'string') throw 'Invalid id'
    id = id.trim();
    if (id.length === 0)
        throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;

    const eventCollection = await events();
    const deletionInfo = await eventCollection.deleteOne({ _id: ObjectId(id) });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete user with id of ${id}`;
    }
    return true;
}

const updateEvent = async (
    id,
    type,
    name,
    capacity,
    date
) => {
    if(typeof(type) === 'undefined' || 
    typeof(name) === 'undefined' ||
    typeof(capacity) === 'undefined' ||
    typeof(date) === 'undefined'){
        throw 'the input is undefined'
    }
    if(typeof(type)!='string' || typeof (name ) != 'string') throw 'the input is not string'
    dateValidation(date)
    type = type.trim().toLowerCase()
    name = name.trim().toLowerCase()

    //checking type
    if (type !== 'sports' && type !== 'art' && type !== 'concert') throw 'Invalid type'

    //checking capacity
    if (!capacity) throw 'Invalid capacity'
    if (capacity === undefined) throw 'undefined capacity'
    if (typeof capacity != 'number') throw 'Invalid capacity type'
    if (capacity < 10 || capacity > 100) throw 'Capacity must be between 10 and 100'

    //checking id
    if (id === undefined) throw 'Invalid id'
    if (typeof id !== 'string') throw 'Invalid id'
    id = id.trim();
    if (id.length === 0)
        throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;

    const eventCollection = await events();
    const event = await eventCollection.findOne(
        { _id: ObjectId(id) }
    );
    let difference = Math.abs(capacity - event.capacity)
    let newSpace = event.space + difference

    let userUpdateInfo = {
        type: type,
        name: name,
        capacity: capacity,
        date: date,
        space: newSpace
    }

    const updateInfo = await eventCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: userUpdateInfo }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
        throw 'Update failed';
    return true;
}

const addUserOfEvent = async (
    eventName,
    userName
) => {
    if(typeof(eventName) === 'undefined' || typeof(userName) === 'undefined' ){
        throw 'the input is undefined'
    }
    if(typeof(eventName)!= 'string' || typeof(userName) != 'string'){
        throw 'the input is not a string'
    }
    eventName = eventName.trim().toLowerCase();
    userName = userName.trim().toLowerCase();
    const event = await searchByEventName(eventName)
    let eventId = event._id.toString()
    let space = event.space
    let userList = event.registerUsers
    let userId = await userFunction.getUserByName(userName);
    if(userId == null){
        throw 'no user with this name'
    }
    let id = await userId._id.toString();
    if (space === 0) throw 'Event is full, cannot be registered'
    if (userList.includes(id)) throw 'You have already registered for this event'
    //const users = events.registeredUsers
    userList.push(id)
    space = space - 1
    let userUpdateInfo = {
        registerUsers: userList,
        space: space
    }
    const eventCollection = await events();
    const updateInfo = await eventCollection.updateOne(
        { _id: ObjectId(eventId) },
        { $set: userUpdateInfo }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
        throw 'Update failed';

    const registerHistory = await userId.registerHistories;
    registerHistory.push(eventId)
    const userCollection = await users();   
    let userUpdateInfo_2 = {
        registerHistories: registerHistory
    }
    const updateInfo_2 = await userCollection.updateOne(
        { _id: ObjectId(id)  },
        { $set: userUpdateInfo_2 }
    );
    if (!updateInfo_2.matchedCount && !updateInfo_2.modifiedCount)
    throw 'Update failed';

    return true;
    

}

module.exports = {
    getAllEvents,
    getSportsEvents,
    getArtEvents,
    getConcertEvents,
    searchByDate,
    searchByEventName,
    getEventById,
    addEvent,
    updateEvent,
    deleteEvent,
    addUserOfEvent
}
