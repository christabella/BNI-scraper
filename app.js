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
        // image: xray('a@href', [{title: 'title'}])
        // image: function($, cb2) {
        //   return x($(this), 'title', [{
        //     name: ''
        //   }])(cb2);
        // }
    }]).stream()];
})
.each(function(catObjAndStream){
    return new Promise(function(resolve, reject){
        var data = '';
        var catObj  = catObjAndStream[0];
        var stream = catObjAndStream[1];
        stream.on('data', function(chunk) {
            data += chunk;
        })

        stream.on('end', function() {
            promoData[catObj.category] = JSON.parse(data); 
            resolve(catObj);
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