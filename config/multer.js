const multer =  require('multer');
const path = require('path');

const almacenamiento = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'publico/imagenes');
    },
    filename: (req,file,cb) => {
        const nombre = Date.now() + path.extname(file.originalname);
        cb(null,nombre)
    }
});

const subida = multer ({storage: almacenamiento});

module.exports = subida;