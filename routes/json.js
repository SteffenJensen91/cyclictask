var express = require('express');
var router = express.Router();
const CyclicDB = require('@cyclic.sh/dynamodb')
const db = CyclicDB(process.env.CYCLIC_DB)
let json = db.collection('json')

const AWS = require('aws-sdk');

// Initialize the Amazon S3 service object
const s3 = new AWS.S3();

const BUCKET_NAME = 'cyclic-sparkling-lamb-fez-eu-west-3'; 
const FILE_NAME = 'data.json';  

router.get('/', async function(req, res, next) {
    try {
        const params = {
            Bucket: BUCKET_NAME,
            Key: FILE_NAME
        };
        const data = await s3.getObject(params).promise();
        res.send(data.Body.toString('utf-8'));
    } catch (error) {
        // Handle the specific case where the file doesn't exist yet.
        if (error.code === 'NoSuchKey') {
            res.send('{}');
        } else {
            next(error);
        }
    }
});

router.post('/', async function(req, res, next) {
    try {
        const textData = JSON.stringify(req.body);

        const params = {
            Bucket: BUCKET_NAME,
            Key: FILE_NAME,
            Body: textData,
            ContentType: 'application/json'
        };

        await s3.putObject(params).promise();
        res.end();
    } catch (error) {
        next(error);
    }
});

module.exports = router;