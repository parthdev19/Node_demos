const admin = require('./../models/M_admin');
const album = require('./../models/M_album');
const {errorRes,successRes} = require('../res/msgcode');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/') // Directory where files will be stored
    },
    filename: function (req, file, cb) {
      cb(null, `${req.body.photo_name}-${file.originalname}`) // Use original file name
    }
});

const upload = multer({ storage: storage });

const adminSignin = async(req,res)=>{
    try {
        const {name,email,password} = req.body;

        if(!name || !email || !password){
            return errorRes(res,201,"Please Provide data")
        }

        const insert_data = {
            name:name,
            email:email,
            password:password
        }

        const res_add = new admin(insert_data);

        res_add.save()
            .then(async(result) => {
                const token = await jwt.sign({ id: result._id.toString() },process.env.SECRETKEY, { expiresIn: "10 days" });
                req.session.token = token;
                return res.json({success:true,token:token,});
            })
            .catch((error) => {
                console.log("Error >>>>> ", error.message);
                return errorRes(res, 500, "Some Internal Error");
        });
    } catch (error) {
        console.log("Error >>>>> ", error.message);
        return errorRes(res, 500, "Some Internal Error");
    }
}

const adminlogin = async (req,res)=>{
    try {
        const {email , password}=req.body;
        const login_data = {
            email:email,
            password:password,
        }

        const adminRes = await admin.find(login_data);

        if(adminRes.length > 0){
            const token = await jwt.sign({ id: adminRes[0]._id.toString() },process.env.SECRETKEY, { expiresIn: "10 hours" });
            req.session.token = token;
            return res.send({token:token,available:true});
        }else{
            res.json({ available: false });
        }
    } catch (error) {
        console.log("Error from the adminLogin >>>>>",error.message);
    }

}

const addPicture = async (req,res) => {
    try {
        const {photo_name,photo_description,photo_url} = req.body;

        const insert_data = {
            photo_name:photo_name,
            photo_url:`${photo_name}-${req.file.originalname}`
        }

        if(photo_description){
            insert_data.photo_description = photo_description;
        }

        const res_add = new album(insert_data);

        res_add.save()
            .then(async(result) => {
                return res.json({success:true,inserted_data:result});
            })
            .catch((error) => {
                console.log("Error >>>>> ", error.message);
                return errorRes(res, 500, "Some Internal Error");
        });


    } catch (error) {
        console.log("Error from the addPicture : ",error);
        return errorRes(res,"Some internal error")
    }
}

const album_view_all_picture = async (req,res) => {
    try {
        const Total_view = await album.find({is_deleted:false});

        if(Total_view){
            return res.json({success:true,Total_view:Total_view});
        }
        
    } catch (error) {
        console.log("Error from the album_view_all_picture : ",error);
        return errorRes(res,"Some internal error")
    }
}

const adminlogout = async (req,res) => {
    req.session.destroy(err => {
        if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).send('Error destroying session');
        }
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Expires', '0');
          res.setHeader('Pragma', 'no-cache');
          res.redirect('/A_logout');
    });
}

const delete_Picture = async(req,res) =>{
    try {
        const { picId } = req.body;

        const findPic = await album.find({_id:picId,is_deleted:false});

        if(findPic){

            const FilePath = path.join(__dirname+`./../public/${findPic[0].photo_url}`);

            fs.unlink(FilePath, (err) => {
                if (err) {
                  console.error('Error occurred while deleting the file:', err);
                  return;
                }
            })

            const deletePic = await album.findByIdAndUpdate({_id:picId},{$set:{
                is_deleted:true
            }})

            if(deletePic){
                return res.json({success:true,deletePic:deletePic})
            }
        }
    } catch (error) {
        console.log("Error : ",error);
    }
}

module.exports = {
    adminSignin,
    adminlogin,
    addPicture,
    album_view_all_picture,
    adminlogout,
    delete_Picture,
    upload
}

