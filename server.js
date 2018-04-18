const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const mobxReact = require('mobx-react')
const handle = app.getRequestHandler()
mobxReact.useStaticRendering(true)

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
    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })