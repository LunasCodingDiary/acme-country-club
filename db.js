//dependencies
// const pg = require('pg') // why not? we are not using pg directly inn the code
const Sequelize = require('sequelize')

//use Sequelize + connect to psql
const {UUID, UUIDV4, STRING, DATE, VIRTUAL} = Sequelize.DataTypes; //shortcut to write the types //deconstruction
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_db');

//primary keys
const UUID = Sequelize.DataTypes.UUID;
const UUIDV4 = Sequelize.DataTypes.UUIDV4;

//models (use schema design to decide what is within)
const Memeber = conn.define('members',{
    id:{
        primaryKey:true,
        type:UUID, //keeps things unique
        defaultValue: UUIDV4 //?? in association with UUID
    }
    ,
    firstName:{
        type:STRING,
        allowNull: false //validation eg. unique:true
    },
    createdAt:{
        type: DATE
    },
    UpdatedAt:{
        type: DATE
    },
    referId: {
        type:VIRTUAL,
        get: function(){
            return this.Id 
        }
    }
})

//foreign key, associations/relations written in syncAndSeed (sometimes it is 2-way, sometimes it is not)
//f key can be in abother table or the self table 
//f key always in the 'belong to' table
Memeber.belongsTo(Member,{as:'sponsor'}); // alias, more readable
Member.hasMany(Member,{as:'sponsored', foreignKey:'sponsorId'});// id, usually unique and primary

//Model 2
const Facility = conn.define('facilities',{
    facId:{
        primaryKey:true,
        type:UUID,  
        defaultValue: UUIDV4  
    },
    facName:{
        type:STRING,
        allowNull: false  
    }
})

const Booking = conn.define('bookings',{
    bookingId,
    




})

//data
const members = ['moe', 'lucy', 'larry', 'ethyl'];
const facilities = ['tennis', 'ping-pong', 'raquet-ball', 'bowling'];

//Sync And Seed
const syncAndSeed = async()=>{
    await conn.sync({force:true});

    //deconstruction //why not a string? because it is a variable
    const [moe, lucy, larry, ethhyl] = await Promise.all(members.map(firstname=>Member.create({firstname}))); //the key to create can be different from prmary key
    moe.sponsorId = lucy.id;
    larry.sponsorId = lucy.id;
    ethhyl.sponsorId = moe.id;
    await Promise.all([moe.save(), ethyl.save(),larry.save()]) //you have to save it, Sequlize .save()

    const [tennis, pingpong, raquetBall, bowling] = await Promise.all(   
        facilities.map( fac_name => Facility.create({facName}))
    );
}

syncAndSeed()

//Export
module.exports= {syncAndSeed, models:{Member, Facility}} //why another object? just convention.

