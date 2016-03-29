var Xray = require("x-ray");

var xray = new Xray();

xray('http://m.bnizona.com/index.php/category/index/promo', 'ul.menu li a',
    [{
        a: '',
        href: '@href',
    }]
)
    .write('categories.json');