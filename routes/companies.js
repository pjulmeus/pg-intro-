const express = require("express");
const ExpressError = require('../expressError')
const slugify = require("slugify");
const db = require("../db")

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let router = new express.Router();

router.get("/", async function (req, res, next) {
/// Dont Forget this is a asyncronous code 
try{
const results =  await db.query(
          `SELECT * FROM companies;`);
          console.log(results.rows)
    return res.json({"companies" : results.rows});

} catch(e){
    next(e)
    }
  });


router.get("/:code", async function (req, res, next) {
try {
const newCode =req.params.code
const results = await db.query(`SELECT c.code, c.name, c.description,i.id, i.amt, i.paid, i.add_date, i.paid_date FROM companies AS c                                                       
LEFT JOIN invoices AS i ON c.code = i.comp_code WHERE code = $1`, [newCode])
// const results = await db.query(`SELECT * FROM companies WHERE code ='${code}'`)
const {code, name, description} = results.rows[0]
let invoices = results.rows.map(r => (r.id))
return res.json({code, name, description, invoices});
} catch (e) {
    next(e)
};
})

router.post("/", async function(req,res,next){
try{
   let {code ,name, description} = req.body;
    const result = await db.query(
          `INSERT INTO companies (code, name, description) 
           VALUES ($1, $2, $3) 
           RETURNING code, name, description`,
        [code, name, description]);
        console.log(result)
    return res.status(201).send({"company": result.rows[0]});

    } catch(e){
    next(e)
    }
})

router.patch("/:code", async function (req, res, next) {
    /// Dont Forget this is a asyncronous code 
    try{
    let code = req.params.code
    console.log(code)
    let {name, description} = req.body;
    console.log(name, description)
    const results =  await db.query(
            `UPDATE companies SET name=$1, description=$2
            WHERE code=$3 RETURNING code, name, description;`,
              [name, description, code] );
              console.log(results.rows[0])
        return res.json({"company" : results.rows});
    
    } catch(e){
        next(e)
        }
      });

      router.delete("/:code", async function (req, res, next) {
        /// Dont Forget this is a asyncronous code 
        try{
        let code = req.params.code
        const results =  await db.query(
                `DELETE FROM companies 
                WHERE code=$1`,
                  [code] );
                  console.log(results.rows[0])
            return res.json({status: "deleted"});
        
        } catch(e){
            next(e)
            }
          });

module.exports = router