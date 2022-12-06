require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const dayjs = require("dayjs");
const appMailer = require("./mailers/appMailer");

const app = express();

const PORT = process.env.PORT || 8000;
const checkIntervalTime = 1000 * 60 * 60; // 1000ms = 1s => 1s * 60 = 60s * 60 = 3600s => 60min
const URL =
  "https://www.vorwerk.com/pl/pl/s/shop/produkty/thermomix%C2%AE/akcesoria/os%C5%82ona-no%C5%BCa-miksuj%C4%85cego-2-0/p/75177";
const URL2 =
  "https://www.vorwerk.com/pl/pl/s/shop/ciemna-pokrywa-przystawki-varomar";
const recipients = [
  {
    email: process.env.USER1,
    lastDateNotified: dayjs().set("date", 24).set("month", 9).set("year", 2022),
  },
  {
    email: process.env.USER2,
    lastDateNotified: dayjs().set("date", 24).set("month", 9).set("year", 2022),
  },
  {
    email: process.env.USER3,
    lastDateNotified: dayjs().set("date", 24).set("month", 9).set("year", 2022),
  },
];
const endOfProgramDate = dayjs()
  .set("date", 31)
  .set("month", 0)
  .set("year", 2023);

const isSameDate = (date) => {
  return (
    dayjs().isSame(date, "day") &&
    dayjs().isSame(date, "month") &&
    dayjs().isSame(date, "year")
  );
};

const sendNotification = () => {
  recipients.forEach((recipient) => {
    if (!isSameDate(recipient.lastDateNotified)) {
      appMailer
        .applicationNotify({
          email: recipient.email,
          data: { url: URL },
        })
        .then(() => {
          console.log("email sent");
        })
        .catch((error) => {
          console.error(error);
        });

      recipient.lastDateNotified = dayjs();
    }
  });
};

const checkProductAvailability = () => {
  return axios(URL)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const isAvailable = $(
        ".product-hero-hybris .price-info__delivery",
        html
      ).hasClass("inStock");

      if (isAvailable) {
        sendNotification();
      } else if (isSameDate(endOfProgramDate)) {
        clearInterval(startChecking);
      }
      return isAvailable;
    })
    .catch((err) => console.error(err));
};

const startChecking = setInterval(
  () => checkProductAvailability(),
  checkIntervalTime
);

app.get("/", (req, res) => {
  checkProductAvailability().then((response) => {
    res.send(
      `<p>Followed product is - ${
        response ? "AVAILABLE" : "UNAVAILABLE"
      } to buy ${
        response ? "on this url <a href='" + URL + "'>" + URL + "</a>" : ""
      }</p>
      <p>Last check: ${dayjs().format("DD-MM-YYYY HH:mm:ss")}</p>
      <p>This program will stop working at - ${endOfProgramDate}<p/>`
    );
  });
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
