var Promise = require('bluebird')
,   fs      = require('fs')
,   Xray    = require("x-ray")
,   xray    = new Xray()
,   promoData    = {};

var getCategories = Promise.promisify(xray('http://m.bnizona.com/index.php/category/index/promo', 'ul.menu li a',
    [{
        category: '',
        href: '@href',
    }]
));

var categoriesPromise = getCategories().then(function(catArr){
    return catArr; 
})
.map(function(catObj){
    return [catObj, xray(catObj.href, 'ul.list2 li', [{
        title: 'span.promo-title',
        merchant: 'span.merchant-name',
        merchant_logo: 'img@src',
        valid_until: 'span.valid-until',
        details_link: 'a@href',
    }]).stream()];
}) // returns stream of [{title: 'title'}, {...}]
.each(function(catObjAndStream){
    return new Promise(function(resolve, reject){
        var data = '';
        var catObj  = catObjAndStream[0];
        var stream = catObjAndStream[1];
        stream.on('data', function(chunk) {
            data += chunk;
        })

        stream.on('end', function() {
            // promoData[catObj.category] = JSON.parse(data); 
            var promoPromise = Promise.resolve(JSON.parse(data))
            .map(function(catObj) {
                // scrape promotion details page
                return [catObj, xray(catObj.details_link, {
                    promo_details_title: '#merchant-detail h5',
                    promo_details_description: '#merchant-detail p',
                    promo_image: '#banner img@src'
                }).stream()];
            })
            .map(function(promoObjAndStream){ // NOT .each, or resolved result would been that of the previous .map function, i.e. return [obj, stream]
                return new Promise(function(resolve, reject){
                    var promoDetailsData = '';
                    var promoObj  = promoObjAndStream[0];
                    var promoStream = promoObjAndStream[1];

                    promoStream.on('data', function(chunk) {
                        promoDetailsData += chunk;
                    })

                    promoStream.on('end', function() {
                        promoDetailsObj = JSON.parse(promoDetailsData); // parse stream data
                        // merge promo details object into main promo object
                        for (var attrname in promoDetailsObj) { 
                            promoObj[attrname] = promoDetailsObj[attrname]; 
                        }                        
                        resolve(promoObj);
                    })
                })
            })

            promoPromise.then(function(promo) {
                // log to global promoData object
                promoData[catObj.category] = promo
                resolve(catObj);
            });

        });
    });
});

categoriesPromise.then(function() {
    jsonOutput = JSON.stringify(promoData, null, 2);
    jsonOutput = jsonOutput.replace(/"([^(")"]+)":/g,"$1:"); // strip double quotes from JSON properties
    // jsonOutput = jsonOutput.replace(/valid until /g,""); // strip "valid until " from valid_until fields; but very slow
    fs.writeFile("data.json", jsonOutput, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("Scraped data written to data.json.");
    }); 
})