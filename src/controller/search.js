//import fetch from "node-fetch"
import * as cheerio from "cheerio";
export const search = async (req, res, itm) => {
  try {
    const BaseUrl = `https://otakudesu.best/?s=${itm}&post_type=anime`
    const ress = await fetch(BaseUrl, {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    });
    const body = await ress.text();
    const $ = cheerio.load(body);
    const data = []
    const peternBody = $(".page")
    peternBody.each((index, element) => {
      const $element = $(element);
      $element.find("ul li", ".chivsrc").each((index, itemElement) => {
        const $item = $(itemElement);
        const img = $item.find("img").attr("src");
        const title = $item.find("h2 > a").first().text();
        const link = $item.find("a").attr("href").split("/")[4];
        data.push({
          title: title,
          image: img,
          link: link,

        })
      })
    })
    res.send({
      search: data
    })
  } catch (err) {
    console.error("log: " + err)
  }
}
