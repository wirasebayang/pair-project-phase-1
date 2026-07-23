// Middleware untuk cek apakah user sudah login (ada session)
function authentication(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login')
    }
    next()
}

// Middleware untuk cek role user, contoh pemakaian:
// authorization('admin')            -> hanya admin
// authorization('tutor', 'admin')   -> tutor atau admin
function authorization(...allowedRoles) {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect('/login')
        }

        if (!allowedRoles.includes(req.session.user.role)) {
            return res.status(403).send('Akses ditolak. Kamu tidak memiliki izin untuk mengakses halaman ini.')
        }

        next()
    }
}

module.exports = { authentication, authorization }
