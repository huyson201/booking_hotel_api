require('dotenv').config()
const S3 = require('aws-sdk/clients/s3')
const fs = require('fs')

const awsName = process.env.AWS_BUCKET_NAME
const awsRegion = process.env.AWS_BUCKET_REGION
const awsKey = process.env.AWS_BUCKET_ACCESS_KEY
const awsSecret = process.env.AWS_BUCKET_ACCESS_SECRET
const s3 = new S3({
    region: awsRegion,
    accessKeyId: awsKey,
    secretAccessKey: awsSecret
})

// upload file
const uploadFile = (file) => {
    const fileStream = fs.createReadStream(file.path)
    const uploadParams = {
        Bucket: awsName,
        Body: fileStream,
        Key: file.filename
    }

    return s3.upload(uploadParams).promise()
}

// download file

const getStreamFile = (fileKey) => {
    const downloadParams = {
        Key: fileKey,
        Bucket: awsName
    }

    return s3.getObject(downloadParams).createReadStream()
}

module.exports = { uploadFile, getStreamFile }