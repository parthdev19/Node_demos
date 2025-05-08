const express = require('express');
const router = express.Router();

router.get("/",async(req,res)=>{
    res.render("client/V_C_home")
})

router.get('/alogin', (req, res) => {
    if(req.session.token == undefined){
        return res.render("admin/A_Login");
    }
    res.render('admin/A_dashborad');
})

router.get('/adminIndex', (req, res) => {
    if(req.session.token == undefined){
        return res.redirect("/alogin");
    }
    res.render('admin/A_dashborad',{
        token:req.session.token
    })
})

module.exports = router;