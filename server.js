const puppeteer = require("puppeteer");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3001;

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

app.get("/:query", async (req, res) => {
  keyword = req.params.query;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = `https://www.google.com/search?q=${keyword}`;
  console.log("url: ", url);
  await page.goto(url);

  const alts = await page.evaluate(() =>
    Array.from(document.getElementsByClassName("YQ4gaf zr758c wA1Bge"), (e) => [
      e.alt,
      e.src,
    ])
  );

  const prices = await page.evaluate(() => {
    const priceElements = Array.from(
      document.getElementsByClassName("z235y jAPStb")
    );
    const prices = priceElements.map((element) => {
      const spanElement = element.querySelector("span"); // Find the <span> element within the current element
      return spanElement ? spanElement.innerText : ""; // Extract the text content of the <span> or return an empty string if not found
    });
    return prices;
  });

  await browser.close();
  const altsWithPrices = alts.map((element, index) => {
    return {
      title: element[0],
      src: element[1],
      price: prices[index],
    };
  });
  res.send(altsWithPrices);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
