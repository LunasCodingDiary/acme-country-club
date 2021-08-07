//dependencies
const pg = require('pg');
const Sequelize = require('sequelize');
const express = require('express');

//require the exported
const {syncAndSeed, Models} = require('/db.js')

const app=express()

// access the database 

app.get('/facilities',async(req,res,next)=>{
    try{
        res.send(await Facilities.findAll({

        }))
    } catch(error){
        next(error);
    }
})

app.get('/bookings',async(req,res,next)=>{
    try{
        res.send(await Bookings.findAll({

        }))
    } catch(error){
        next(error);
    }
})

app.get('/members', async(req,res,next)=>{
    try{
        res.send(await Members.findAll({
            include:[
                {models: Member,as:'sponsor'},
                {models: Member,as:'sponsored'}
            ]
        }))

    } catch(error){
        next(error);
    }
})


//init
//what's the difference between this and just do app.listen('2021')?
const init=async()=>{
    await syncAndSeed(); //why do we need to await? isn't it already called inside db?
    const port = process.env.PORT || 3000;
    app.listen(port)
}
init();