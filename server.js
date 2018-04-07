const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
  .then(() => {
    const server = express()
    server.get('/movie/:id', (req, res) => {
      const actualPage = '/movie'
      const queryParams = { id: req.params.id }
      app.render(req, res, actualPage, queryParams)
    })

    server.get('/list/:categoryId/:genreId', (req, res) => {
      const actualPage = '/list'
      const queryParams = { categoryId: req.params.categoryId, genreId: req.params.genreId }
      app.render(req, res, actualPage, queryParams)
    })

    server.get('/search/:keyword', (req, res) => {
      const actualPage = '/search'
      const queryParams = { keyword: req.params.keyword }
      app.render(req, res, actualPage, queryParams)
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })
    server.listen(3000, (err) => {
      if (err) throw err
    })
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })