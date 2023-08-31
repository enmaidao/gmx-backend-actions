import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import subscribePriceFeeds from './src/subscribe'
import routes from './src/routes'

dotenv.config()

const app = express()
const port = process.env.PORT
const options = {
  origin: '*',
}

app.use(cors(options))
// app.use(express.json());
// app.use(function (_, res, next) {
//   res.header('Content-Type', 'application/json');
//   next();
// });

// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );
// app.use(bodyParser.json());

// Subscribe events
subscribePriceFeeds()

// API routes
routes(app)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
