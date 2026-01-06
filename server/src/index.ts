import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import ocrRoute from './routes/ocr-to-flashcards'

const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: '5mb' }))

app.use('/api/ai', ocrRoute)

const port = process.env.PORT || 4000
app.listen(port, ()=>console.log(`Server listening on ${port}`))
