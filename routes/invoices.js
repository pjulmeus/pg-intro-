const express = require("express");
const ExpressError = require('../expressError')
const slugify = require("slugify");
const db = require("../db")
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let router = new express.Router();

router.get("/", async function(req,res,next){
    try{
   const results = await db.query(`SELECT * FROM invoices`)
   console.log(results.rows)
    return res.json({"invoices": results.rows})

    } catch (e){
       next(e)
    }
 
})

router.get("/:id", async function(req,res,next){
    try{
   const invoicesResults = await db.query(`SELECT * FROM invoices WHERE id = $1`,
                                     [req.params.id])
        console.log(invoicesResults.rows)
         let {comp_code} = invoicesResults.rows[0]    
         console.log(comp_code)                    
    const companiesResults = await db.query(`SELECT * FROM companies WHERE code  = $1`,
    [comp_code])
    console.log(companiesResults.rows)
        const inv = invoicesResults.rows[0]
        inv.companies = companiesResults.rows

   
    return res.json(inv)

    } catch (e){
       next(e)
    }
 
})


router.post("/", async function(req,res,next){
    try{
    let {comp_code, amt} = req.body
    console.log(comp_code, amt)
    const result = await db.query(
        `INSERT INTO invoices (comp_code, amt, paid, paid_date) 
         VALUES ($1, $2, 'false', null)
         RETURNING id, comp_code, amt, paid, paid_date`,
      [comp_code, amt]
  );

   console.log(result.rows[0])
    return res.status(201).json({"invoices": result.rows[0]})

    } catch (e){
       next(e)
    }
 
})

router.put("/:id", async function(req,res,next){
    try{
        let {amt} = req.body
        console.log(amt)
        const result = await db.query(
            `UPDATE invoices SET amt =  $1 WHERE id = $2
             RETURNING id, comp_code, amt, paid, paid_date`,
          [amt, req.params.id]
      );
   
    return res.status(200).json(result.rows[0])

    } catch (e){
       next(e)
    }
 
})

router.delete("/:id", async function (req, res, next) {
    /// Dont Forget this is a asyncronous code 
    try{
    let id = req.params.id
    const results =  await db.query(
            `DELETE FROM invoices 
            WHERE id=$1`,
              [id] );
              console.log(results.rows[0])
        return res.json({status: "deleted"});
    
    } catch(e){
        next(e)
        }
      });


module.exports = router