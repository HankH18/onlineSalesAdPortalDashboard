let Router = require('express').Router;
const proxyRouter = Router()
const MWSClient = require('mws-api');

var monthArray = [31,28,31,30,31,30,31,31,30,31,30,31]
var monthNameArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
var d = new Date()
var m = d.getMonth()
var y = d.getFullYear()
var day = d.getDate()

proxyRouter.get('/reports', function(req,res) {
  const mws = new MWSClient({
      accessKeyId: req.query.accessKeyId,
      secretAccessKey: req.query.secretAccessKey,
      merchantId: req.query.merchantId,
      meta: {
        retry: true, // retry requests when throttled 
        next: true, // auto-paginate 
        limit: Infinity // only get this number of items (NOT the same as MaxRequestsPerPage) 
      }
    });
  
    var afterDate = monthNameArray[req.query.month] + ' 1 ' + req.query.year
    var beforeDate

    if (parseInt(req.query.month) === m && parseInt(req.query.year) === y) {
      beforeDate = monthNameArray[req.query.month] + ' ' + day + ' ' + req.query.year
    } else {
      beforeDate = monthNameArray[req.query.month] + ' ' + monthArray[req.query.month] + ' ' + req.query.year
    }

    var promise = mws.Orders.ListOrders({
        MarketplaceId: 'ATVPDKIKX0DER',
        MaxResultsPerPage: 100,
        CreatedAfter: new Date(afterDate),
        CreatedBefore: new Date(beforeDate)
    })

    promise.then((result, metadata) => {
      res.json({
        reports: result
      })
    }, err => {
      res.status(400).json({
        error: err
      })
    });
})

module.exports = proxyRouter