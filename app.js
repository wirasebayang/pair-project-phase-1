require('dotenv').config()

const express = require('express')
const session = require('express-session')

const indexRouter = require('./routes/index')
const adminRouter = require('./routes/admin')
const tutorRouter = require('./routes/tutor')
const studentRouter = require('./routes/student')

const app = express()
const port = 3000

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))

app.use(express.static(__dirname + '/public'))

app.use(session({
    secret: process.env.SESSION_SECRET || 'pair-project-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax'
    }
}))

app.locals.catColor = function (name) {
    const palette = ['cat-a', 'cat-b', 'cat-c', 'cat-d', 'cat-e', 'cat-f']

    if (!name) return palette[0]

    let hash = 0

    for (let i = 0; i < name.length; i++) {
        hash = (hash * 31 + name.charCodeAt(i)) >>> 0
    }

    return palette[hash % palette.length]
}

app.locals.statusColor = function (status) {
    const map = {
        pending: 'status-pending',
        confirmed: 'status-confirmed',
        completed: 'status-completed',
        cancelled: 'status-cancelled'
    }

    return map[status] || 'status-pending'
}

app.use('/', indexRouter)
app.use('/admin', adminRouter)
app.use('/tutor', tutorRouter)
app.use('/student', studentRouter)

app.use((req, res) => {
    res.status(404).render('error', { message: 'Halaman tidak ditemukan' })
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})