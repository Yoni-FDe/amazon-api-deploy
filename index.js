const express =require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);


const app = express()
app.use(cors({origin:true}));

app.use(express.json());

app.get("/", (req, res) =>{
    res.status(200).json({
        message: "Success",
    });
});


//Test for payment made 
app.post("/payment/create", async(req, res)=> {

    const total = req.query.total; // This reuest from client side
    if(total > 0) {
        // console.log("payment recived", total); // if this total payment to send to stripe
        // res.send(total);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: total,
            currency: "usd",    
        });
        console.log(paymentIntent);

        res.status(201).json({
            clientSecret: paymentIntent.client_secret, // This is client payment request
        })

        res.status(201).json(paymentIntent);
    }
    else{
        res.status(403).json({
            message: "total must be greater than 0"
        });
   }
});

// create a listen port
app.listen(5001, (err)=>{
    if(err) throw err
    console.log("Amazon Server Running on PORT:5001,http://localhost:5001")
})

// This is not firebase function just use instance server of our local machine
// we can set start config to run app, so I set up start up app in package.json like this : "start": "node index.js": npm start
