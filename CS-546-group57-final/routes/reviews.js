const express = require('express');
const session = require('express-session');
const router = express.Router();
const data = require('../data');
const userData = data.userData;
const eventData = data.eventData;
const reviewData = data.reviewData;

router
    .route('/:id/delete')
    .get(async(req,res) =>{
        try{
            let isDeleted = await reviewData.removeReview(req.params.reviewId);
            if (isDeleted){
                return res.redirect('/event/' + req.params.eventId);
            }
            else {
                res.status(404).send();
            }
        }catch(e){
            res.status(500).json({error:e});
        }
    })

router
    .route('/:eventId/add')
    .post(async(req,res) =>{
        if (!req.session.user){
            res.redirect('user/userLogin');
        }
        try{
            let userName = req.session.user;
            let user = await userData.getUserByName(userName);
            let userId = user._id.toString();
            const input = req.body;
            const rating = input.rating;
            const text = input.text;
            let isCreat = await reviewData.createReview(req.params.eventId, userId, text, Number(rating));
            if (isCreat){
                res.render('events',{error:true, error_message:'createReview Successfully',userLoggedIn:true})
            }
            else {
                res.render('events',{
                    title:'event',
                    error:true,
                    error_message:'can not create this review',
                    userLoggedIn:true
                })
            }
        }catch(e){
            res.status(400).render('events',{error:true,error_message:e,userLoggedIn:true});
        }

    })


module.exports = router;