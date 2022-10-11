const memoryController  = require("../controllers/memoryController")
const keys              = require('../config/keys')
const accessKeyId       = keys.s3_accessKeyId
const secretAccessKey   = keys.s3_secretAccessKey
const region            = keys.region
const multer            = require("multer");
//const uploadv3            = multer({})
const aws 		        = require('aws-sdk')
const aws3              = require('@aws-sdk/client-s3')
aws.config.update({credentials : {accessKeyId,secretAccessKey,region}})
const multerS3 		    = require('multer-s3')
const s3 		        = new aws3.S3Client({ 
    credentials : {accessKeyId,secretAccessKey,},region
});

module.exports = function(app) {

    //get memories from database

    app.get('/api/getMemories', memoryController.getMemories)    


    //image upload params
    const storage = multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: keys.bucket,
        metadata: function(req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function(req, file, cb) {
            const fileName = `${Date.now()}-${file.originalname}`
            cb(null, fileName)
        }
    });

    // checking file type
    const fileFilter = (req, file, cb) => {
        console.log('fileFilter mimetype = ', file.mimetype)
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            console.log('not an Image')
    //        cb(new Error('Not an image! Please upload an image.', 400), false);
            cb(null, false);
        }
    };

    // multer params
    const upload = multer({
        storage: storage,
        limits: {fieldSize: 1024 * 1024 * 25},
        fileFilter: fileFilter
    })

    app.post('/api/addImage', upload.single('memory'),memoryController.createMemory)

//AWS s3 buckets access
//    app.get('/v3/buckets', async (req, res)=> {
//        try {
//          // test connection
//          const command = new AWS3.ListBucketsCommand({})
//          const response = await S3.send(command)
//          res.send(response.Buckets)
//        } catch(error) {
//          console.log(error)
//          res.send(error)
//        }
//      })
//
//      app.post('/v3/post', uploadv3.single('memory'), async (req, res)=> {
//        console.log('req.file = ', req.file)
//        try {
//          const fileName = `${Date.now()}-${req.file.originalname}`
//          let uploadParams = {Key: fileName,Bucket: 'caringvegan',Body: req.file.buffer}
//          const command = new AWS3.PutObjectCommand(uploadParams)
//          const response = await S3.send(command)
//          if (response.$metadata.httpStatusCode===200) res.send('success')
//        } catch(error) {
//          console.log(error)
//          res.send(error)
//        }
//      
//      })
}