const mongoose          = require('mongoose');
//const Memory            = mongoose.model('Memory');
const memoryController  = require("../controllers/memoryController")
//const aws 		        = require('aws-sdk')
const keys              = require('../config/keys')
const credentials = {
    region          : keys.region,
    credentials : {
        accessKeyId     : keys.s3_accessKeyId,
        secretAccessKey : keys.s3_secretAccessKey,
    }
}
const { S3Client }      = require('@aws-sdk/client-s3')
const multer            = require("multer");
const multerS3 		    = require('multer-s3')
const s3 		        = new S3Client(credentials);
module.exports = function(app) {
    //image upload
    const storage = multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: keys.bucket,
        metadata: function(req, file, cb) {
            console.log('metadata file ', file)
            console.log('fieldName = ', file.fieldname)
            cb(null, {fieldName: file.fieldname});
        },
        key: function(req, file, cb) {
            console.log('key')
            const uniqueSuffix = Date.now()+ '-' + Math.round(Math.random() * 1E9)
            console.log("unique suffix", uniqueSuffix)
            cb(null, uniqueSuffix)
        }

    });

    // checking file type
    const fileFilter = (req, file, cb) => {
        console.log('fileFilter mimetype = ', file.mimetype)
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            console.log('not an Image')
    //        cb(new Error('Not an image! Please upload an image.', 400), false);
            cb(null, false);
        }
    };

    const upload = multer({
        storage: storage,
        limits: {fieldSize: 1024 * 1024 * 25},
        fileFilter: fileFilter
    })

    app.post('/api/addImage', upload.single('memory'), async (req,res) => {       
        console.log('req.file', req.file)
         await res.send('Successfully uploaded files!')
    })
}