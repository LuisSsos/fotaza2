require('dotenv').config();

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

console.log(process.env.CLOUDINARY_API_KEY);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const almacenamiento = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'fotaza2',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif']
    }
});

const subida = multer({ storage: almacenamiento });

module.exports = subida;