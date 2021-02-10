import express, { ErrorRequestHandler } from "express"
var createError = require('http-errors');
// var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var IndexController = require('./routes/index');
var usersRouter = require('./routes/users');

// catch 404 and forward to error handler
const errorHandler: ErrorRequestHandler = function(err, req, res, _next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}

class ExpressApplication {
  app: express.Express = express()
  controllers: any[] = [
    new IndexController()
  ]
  
  constructor() {
    this.app.set('views', path.join(__dirname, '../views'));
    this.app.set('view engine', 'jade');

    this.app.use(logger('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, 'public')));
    
    // this.app.use('/users', usersRouter);
    this.initRoutes()
    
    this.app.use(function(_req, _res, next) {
      next(createError(404));
    });
    
    this.app.use(errorHandler);
    
  }
  
  initRoutes() {
    this.controllers.forEach(controller => {
      const { __meta__ : meta } = controller
      
      const router = express.Router();
      if (meta.get) {
        for (const url in meta.get) {
          router.get(url, meta.get[url])
        }
      }
      
      this.app.use(meta.url, router)
    })
  }
}

const myapp = new ExpressApplication().app

module.exports = myapp;
