const multer = require('multer')
const path = require('path')
const fs = require('fs')

const MAX_FILE_SIZE = 2 * 1024 * 1024

const uploadDir = path.join(__dirname, '..', 'public', 'uploads')

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, uniqueSuffix + path.extname(file.originalname).toLowerCase())
    }
})

const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('File harus berupa gambar (jpg, png, gif, webp)'))
        }

        cb(null, true)
    }
})

function uploadImage(req, res, next) {

    upload.single('image')(req, res, (err) => {

        if (err) {

            if (err.code === 'LIMIT_FILE_SIZE') {
                req.uploadError = 'Ukuran file maksimal 2MB. Silakan pilih gambar yang lebih kecil.'
            } else {
                req.uploadError = err.message
            }
        }

        next()
    })
}

module.exports = uploadImage
