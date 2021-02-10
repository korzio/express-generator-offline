import express, {Request, Response, NextFunction}  from 'express';

/* GET home page. */
@controller('/')
class IndexController {
  @get('/')
  index(req: Request, res: Response, next: NextFunction) {
    console.log('my routed index')
    
    res.render('index', { title: 'Express' });
  }
}

function controller(url: string) {
  return function controller({ prototype: target }: any, ...args: any[]) {
    target.__meta__.url = url
  }
}

function get(url: string) {
  return function get(target: any, name: string, ...args: any[]) {
    if (!target.__meta__) {
      target.__meta__ = {
        get: {}
      }
    }
    const { __meta__ : meta }  = target
    meta.get[url] = target[name]
  }
}

module.exports = IndexController;
