const express = require('express');
const session = require('express-session');
const router = express.Router();
const data = require('../data');
const userData = data.userData;
const eventData = data.eventData;
const reviewData = data.reviewData;

router
    .route('/')
    .get(async (req,res) =>{
        if (!req.session.user){
            res.status(403).redirect('/user/userLogin');
        }
        else{
            try{
                let eventsList = await eventData.getAllEvents();
                let newEventList = [];
                for (let event of await eventsList){
                    if (event.reviews.length > 0) {
                        event.rated = true;
                      } else {
                        event.rated = false;
                      }
                    newEventList.push(await event);
                }
                res.render('events', {events:newEventList,userLoggedIn:true})
            }catch(e){
                res.status(400).render('events',{
                    title:'events',
                    error:true,
                    error_message : e,
                    userLoggedIn:true
                })
            }
        }

    })

    router
    .route('/sports')
    .get(async (req,res) =>{
        if (!req.session.user){
            res.status(403).redirect('/user/userLogin');
        }
        else{
            try{
                let eventsList = await eventData.getSportsEvents();
                let newEventList = [];
                for (let event of eventsList){
                     newEventList.push( event);
                }
                res.render('events', {events:newEventList,userLoggedIn:true})
            }catch(e){
                res.status(400).render('events',{
                    title:'sports',
                    error:true,
                    error_message : e,
                    userLoggedIn:true
                })
            }
        }

    })

router
    .route('/art')
    .get(async (req,res) =>{
        if (!req.session.user){
            res.status(403).redirect('/user/userLogin');
        }
        else {
            try{
                let eventsList = await eventData.getArtEvents();
                let newEventList = [];
                for (let event of eventsList){
                    newEventList.push(event);
                }
                res.render('events', {events:newEventList, userLoggedIn:true})
            }catch(e){
                res.status(400).render('events',{
                    title:'events',
                    error:true,
                    error_message : e,
                    userLoggedIn:true
                })
            }
        }

})

router
    .route('/concert')
    .get(async (req,res) =>{
        if (!req.session.user){
            res.status(403).redirect('/user/userLogin');
        }
        else {
            try{
                let eventsList = await eventData.getConcertEvents();
                let newEventList = [];
                for (let event of eventsList){
                    newEventList.push(event);
                }
                res.render('events', {events:newEventList, userLoggedIn:true})
            }catch(e){
                res.status(400).render('events',{
                    title:'events',
                    error:true,
                    error_message : e,
                    userLoggedIn:true
                })
            }
        }

})

router
    .route('/:id')
    .get(async(req,res) => {
        try{
            if (!req.session.user){
                res.status(403).redirect('/user/userLogin');
            }

            else{
                let event = await eventData.getEventById(req.params.id);
                let reviewList = [];
                
                for (let review of event.reviews){
                    let u = await userData.getUserById(review.userId);
                    let uu = u.userName;
                    review.user = uu;
                    reviewList.push(review);
                }
                let isUser = false;
                if (req.session.user){
                    let userName = req.session.user
                    for (UserId of event.registerUsers){
                        let un = await userData.getUserById(UserId);
                        let UserName = un.name;
                        if (UserName == userName){
                            isUser = true;
                        }
                    }
                }
                res.status(200).render('event', {event:event,reviews:reviewList,userLoggedIn: true,isUser:isUser})
            }


        }catch(e){
            res.status(400).render('event',{error:true, error_message:e,userLoggedIn: true});
        }
    })



router
    .route('/searchEventByName')
    .post(async (req, res) => {
        try{
            if (!req.session.user){
                res.status(403).redirect('/user/userLogin');
            }

            else{
                let event = await eventData.searchByEventName(req.body.searchByEventName);
                let reviewList = [];
                
                for (let review of event.reviews){
                    let u = await userData.getUserById(review.userId);
                    let uu = u.userName;
                    review.user = uu;
                    reviewList.push(review);
                }
                let isUser = false;
                if (req.session.user){
                    let userName = req.session.user
                    for (UserId of event.registerUsers){
                        let un = await userData.getUserById(UserId);
                        let UserName = un.name;
                        if (UserName == userName){
                            isUser = true;
                        }
                    }
                }
                res.status(200).render('event', {event:event,reviews:reviewList,userLoggedIn: true,isUser:isUser})
            }


        }catch(e){
            res.status(400).render('event',{error:true, error_message:e,userLoggedIn: true});
        }
    })

router
    .route('/searchByDate')
    .post(async(req,res) =>{
        try{
            if (!req.session.user){
                res.status(403).redirect('/user/userLogin');
            }

            else{
                let event = await eventData.searchByDate(req.body.searchByDate);
                let reviewList = [];
                
                for (let review of event.reviews){
                    let u = await userData.getUserById(review.userId);
                    let uu = u.userName;
                    review.user = uu;
                    reviewList.push(review);
                }
                let isUser = false;
                if (req.session.user){
                    let userName = req.session.user
                    for (UserId of event.registerUsers){
                        let un = await userData.getUserById(UserId);
                        let UserName = un.name;
                        if (UserName == userName){
                            isUser = true;
                        }
                    }
                }
                res.status(200).render('event', {event:event,reviews:reviewList,userLoggedIn: true,isUser:isUser})
            }


        }catch(e){
            res.status(400).render('event',{error:true, error_message:e,userLoggedIn: true});
        }
    })

router
    .route('/add')
    .post(async (req,res) => {
        if (!req.session.user){
            res.redirect('/manager/managerLogin');
        }
        else {
            const body = req.body;
            try{
                let added = await eventData.addEvent(body.type, body.name, Number(body.capacity), body.date);
                if (!added){
                    res.render('manageEvent',{error:true,error_message:'can not add the event',managerLoggedIn:true});
                }
                else {
                    res.render('manageEvent',{error:true,error_message:'add Event successfully',managerLoggedIn:true});
                }
            }catch(e){
                res.render('manageEvent',{error:true,error_message:e,managerLoggedIn:true});
            }
        }

    })

router
    .route('/edit/:eventId/')
    .get(async(req,res) =>{
        if (!req.session.user){
            res.redirect('/manager/managerLogin')
        }
        else {
            let event = await eventData.getEventById(req.params.eventId);
            res.render('editEvent',{
                event:event,
                managerLoggedIn:true
            });
        }

    })

router
    .route('/edit/:eventId')
    .post(async(req,res) => {
        if (!req.session.user){
            res.redirect('/manager/managerLogin')
        }
        else {
            const body = req.body;
            try{
                let isUpdate = await eventData.updateEvent(req.params.eventId,body.type,body.name,Number(body.capacity),body.date);
                if (isUpdate){
                    res.render('manageEvent',{
                        error:true,
                        error_message:'upDate successfully',
                        managerLoggedIn:true
                    })
                }
                else {
                    res.render('manageEvent',{
                        error:true,
                        error_message:'can not update',
                        managerLoggedIn:true
                    })
                }
            }catch(e){
                res.render('manageEvent',{
                    error:true,
                    error_message:e,
                    managerLoggedIn:true
                })
            }
        }

    })

    /*
router
    .route('/registerEvent')
    .get(async(req.res) ={
        
    })
    */

router
    .route('/:id/registerEvent')
    .get(async(req,res) =>{
        if (!req.session.user){
            res.redirect('/');
        }
        else {
            try{
                let userName = req.session.user;
                let event = await eventData.getEventById(req.params.id);
                let eventName = event.name;
                let isAdded = await eventData.addUserOfEvent(eventName,userName);
                if (isAdded){
                    res.render('events',{error:true,error_message:'register successfully',userLoggedIn : true});
                }
                else{
                    res.render('events',{error:true,error_message:'could not register this event',userLoggedIn : true});
                }
            }catch(e){
                res.render('events',{error:true,error_message:e,userLoggedIn : true});
            }
        }
    })
module.exports = router;