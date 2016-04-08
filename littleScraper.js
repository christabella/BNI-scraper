/* for testing */
var Xray = require('x-ray');
var x = Xray();

x('http://m.bnizona.com/index.php/promo/view/16/1124', {
                    promo_details_title: '#merchant-detail h5',
                    promo_details_description: '#merchant-detail p',
                    promo_image: '#banner img@src'
                })
(function(err, obj) {
    console.log(obj);   
})