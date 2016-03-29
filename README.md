# BNI-scraper
Node.js web scraper with [x-ray](https://github.com/lapwinglabs/x-ray).

### Usage
Run `node app.js`.

### Input
URL to the [BNI Zona Promotions](http://m.bnizona.com/index.php/promo) web page.

### Output

```
{
  Fashion: [
    {
      title: "GRATIS Gelang Swarovski dengan Kartu Debit BNI ",
      merchant: "Shafira",
      merchant_logo: "http://m.bnizona.com/files/6efcf507ce5bd867ad106939fc2110ae.jpg",
      valid_until: "valid until 03 April 2016",
      details_link: "http://m.bnizona.com/index.php/promo/view/16/1169"
    },
    {
      ...
    },
    ...
  ],
  Groceries: [
    {
      title: "Gratis Voucher Belanja Rp 25.000 di Baji Pamai Supermarket dengan Kartu Kredit BNI",
      merchant: "Baji Pamai Supermarket",
      merchant_logo: "http://m.bnizona.com/files/cd526c4b708fea7e52efa7b96c1db395.jpg",
      valid_until: "valid until 18 July 2016",
      details_link: "http://m.bnizona.com/index.php/promo/view/17/1200"
    },
    ...
  ]
}
```
