const express = require('express')
const mongoose = require('mongoose')
const app = express()
const dotenv = require("dotenv");
const port = 3000
const Company = require("./models/Company")
const csvtojson = require("csvtojson");




dotenv.config();
app.use(express.static('public'))
app.use(express.json())

app.get('/getInfor', async (req, res) => {
  var identifier = req.headers["identifier"];
  var identifier;
  if(identifier == "Company"){
      responseinfor = await Company.find({Company: req.headers["value"]});
  }
  else if(identifier == "Ticker"){
      responseinfor = await Company.find({Ticker: req.headers["value"]});
  }
  else{
      return res.status(400).json({err: "Please give valid input"})
  }

  if(!responseinfor){
      return res.status(400).json({err: "Please give valid input"})
  }
  res.status(200).json({responseInfor: responseinfor});
})

app.listen(port, async() => {
  console.log(`Listening at http://localhost:${port}`)
  await mongoose.connect(
    "mongodb+srv://stockTicker:stockTicker@cluster0.lygfi.mongodb.net/companies?retryWrites=true&w=majority",
    { useNewUrlParser: true,  useUnifiedTopology: true },
    () => console.log("Connected to db")
  );
  await csvtojson()
    .fromFile("companies-1.csv")
    .then(csvData => {
      csvData.forEach(async (company) => {
        const old = await Company.findOne({Company: company.Company})
        if(!old){
          const newCompany = new Company({
            Company: company.Company,
            Ticker: company.Ticker
          });
          try{
            const savedCompany = await newCompany.save();
            console.log(savedCompany)
          }
          catch(err){
            console.log("Something is wrong")          
          }
        }
      })
    }); 
})