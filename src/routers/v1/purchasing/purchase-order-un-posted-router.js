var Router = require('restify-router').Router;
var router = new Router();
var db = require("../../../db");
var PurchaseOrderManager = require("dl-module").managers.purchasing.PurchaseOrderManager;
var resultFormatter = require("../../../result-formatter");

var passport = require('../../../passports/jwt-passport');
const apiVersion = '1.0.0';


router.get("/",passport, (request, response, next) => {
    db.get().then(db => {
            var manager = new PurchaseOrderManager(db, request.user);

            var query = request.query;
            query.filter = !query.filter ? {} : JSON.parse(query.filter);

            manager.readUnposted(query)
                .then(docs => {
                    var result = resultFormatter.ok(apiVersion, 200, docs);
                    response.send(200, result);
                })
                .catch(e => {
                    response.send(500, "gagal ambil data");
                });
        })
        .catch(e => {
            var error = resultFormatter.fail(apiVersion, 400, e);
            response.send(400, error);
        });
});

module.exports = router;
