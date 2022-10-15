const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const PORT = 8000;
const checkIntervalTime = 1000 * 60 * 60 // 1000ms = 1s => 1s * 60 = 60s * 60 = 3600s => 60min
const URL = 'https://www.vorwerk.com/pl/pl/s/shop/produkty/thermomix%C2%AE/akcesoria/os%C5%82ona-no%C5%BCa-miksuj%C4%85cego-2-0/p/75177';
const URL2 = 'https://www.vorwerk.com/pl/pl/s/shop/ciemna-pokrywa-przystawki-varomar';

const app = express();

const checkProductAvailability = () => {
    axios(URL2).then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        console.log($('.product-hero-hybris .price-info__delivery', html).hasClass('inStock')); 
    }).catch(err => console.error(err));
}

// setInterval(() => checkProductAvailability(), 5000);



app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));



