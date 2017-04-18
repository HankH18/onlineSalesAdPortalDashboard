let Router = require('express').Router;
const proxyRouter = Router()
const MWSClient = require('mws-api');

proxyRouter.get('/reports', function(req,res) {
  console.log(req.query)
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

    var promise = mws.Orders.ListOrders({
        MarketplaceId: 'ATVPDKIKX0DER',
        MaxResultsPerPage: 100,
        CreatedAfter: new Date("Jan 1 2016"),
        CreatedBefore: new Date("Feb 1 2016")
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