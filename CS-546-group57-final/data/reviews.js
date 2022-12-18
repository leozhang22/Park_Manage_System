///post review for events
const eventFunction = require('./event');
const mongoCollections = require('../config/mongoCollections');
const userCollection = mongoCollections.user_collection;
const eventCollection = mongoCollections.event_collection;
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const { arrayBuffer } = require('stream/consumers');
const saltRounds = 16;

const createReview = async (
    eventId,
    userId,
    text,
    rating,
  ) => {
    //check all undefined error
    if(typeof eventId === 'undefined'){
      throw 'userName is undefined'
    }
    if(typeof userId === 'undefined'){
      throw 'eventName is undefined'
    }
    if(typeof text === 'undefined'){
      throw 'review text is undefined'
    }
    if(typeof rating === 'undefined'){
      throw 'rating is undefined'
    }

    //check all the data type
    if(typeof eventId !== 'string'){
      throw 'review is not a string'
    }
    if(typeof rating !== 'number'){
      throw 'rating is not a number'
    }
    if (typeof eventId !== 'string') {
        throw "eventId is not a string or is empty";
    }
    if (typeof text !== 'string' || text.trim().length === 0) {
        throw "review is not a string or is empty";
    }
    if(text.trim().length > 50){
        throw "review is too long";
    }
    //check the event table registerusers attribute have or not have the userId
    const events = await eventCollection();
    let eId = ObjectId(eventId);

    const event = await events.findOne({_id: eId});
    if(event === null){
        throw 'No event with this id'
    }
    let pre  = false;
    let resigterUsers = await event.registerUsers;
    await resigterUsers.forEach(element => {
        if(element!== null){
            if(element.toString() == userId){
                pre = true;
            }
        }
    });
    if(pre === false){
        throw 'the user did not register this event';
    }
    //check is this user already give the review and rating
    const users = await userCollection();
    const uId = ObjectId(userId);
    const user = await users.findOne({_id: uId});
    if(user === null){
        throw 'No user with this id'
    }
    pre = true;
    let userReview = await user.reviews;
    await userReview.forEach(element => {
        if(element != null){
            if(element.eventId.toString() === eventId)
                throw 'the user already give this event review and rating'
        }
    });
    //check the rating
    if(rating > 5 || rating < 1){
        throw 'rating is invaild';
    }
    if (!Number.isInteger(rating)) {
        throw "invalid rating";
    }

    let eventReviews = await event.reviews;
    let userReviews = await user.reviews;
    //this is the list update to the eventcollection and also the usercollection
    const newreviews = {
        _id:ObjectId(),
        eventId: eventId,
        userId: userId,
        text: text,
        rating: rating
    };
    //update reviews to user table
    await userReviews.push(newreviews);
    let userUpdateInfo = {
        reviews: userReviews
    }
    const updateInfo = await users.updateOne(
        { _id: uId },
        { $set: userUpdateInfo }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
        throw 'Update failed userreview';

    //now change the overrate of the event
    await eventReviews.push(newreviews);
    let sum = 0;
    let count = 0;
    for(let x of eventReviews){
        sum = sum + x.rating;
        count++;
    }
    let overallRating = 0;
    if(count != 0){
        overallRating = parseFloat((sum / count).toFixed(1))
    }
    let eventUpdateInfo = {
        reviews: eventReviews,
        overallRating : overallRating
    }
    const updateInfo_2 = await events.updateOne(
        { _id: eId },
        { $set:eventUpdateInfo }
    );
    if (!updateInfo_2.matchedCount && !updateInfo_2.modifiedCount)
        throw 'Update failed eventsreview';
    return true;
}


const getReviewById = async (
    reviewId,
    userId
) => {
    //check the data type
    if(typeof reviewId == 'undefined'){
        throw 'reviewId is undefined';
    }
    if(typeof reviewId !== 'string' || reviewId.trim().length === 0){
        throw 'reviewId is is not a string or is empty'
    }
    if (!ObjectId.isValid(reviewId)) {
        throw "reviewId is not Key";
    }
    if(typeof userId == 'undefined'){
        throw 'userId is undefined';
    }
    if(typeof userId !== 'string' || userId.trim().length === 0){
        throw 'userId is is not a string or is empty'
    }
    if (!ObjectId.isValid(userId)) {
        throw "userId is not Key";
    }
    const users = await userCollection();
    let id = ObjectId(userId);
    const user = await users.findOne({_id:id})
    if (user == null){
        throw 'no user with this id'
    }
    let pre = false;
    const reviews = await user.reviews;
    await reviews.forEach(element => {
        if(element._id.toString() === reviewId){
            pre = true;
            //return json object;
            element['_id'] = element['_id'].toString();
            return element;
        }
        else{
            throw 'this user do not have the review with this review id'
        }
    });
}
  
module.exports = {
   createReview,
   getReviewById
}
