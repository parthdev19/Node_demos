const album = require('./../models/M_album');
const {errorRes,successRes} = require('../res/msgcode');


const IncPictureView = async(req,res) => {
    try {

        const { albumId } = req.body;

        if(!albumId){
            return errorRes(res,400,"albumId is required");
        }

        const findAlbum = await album.findById(albumId);

        if(!findAlbum){
            return errorRes(res,400,"album not found");
        }

        const updateRes = await album.findByIdAndUpdate(
            albumId,{
                $inc: { total_view: 1 },
            }
        );

        if(updateRes){
            return successRes(res,200,"success");
        }


    } catch (error) {
        console.log("Error from the IncPictureView",error);
        return errorRes(res,"some internal error");
    }
}

module.exports = {
    IncPictureView
}