import * as cheerio from "cheerio";
import fetch from "node-fetch";

export const genreSection = async (req, res) => {
  try {
    const { slug } = req.params;

    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Referer": "https://otakudesu.best/"
    };

    const result = [];
    let page = 1;

    while (true) {
      const url =
        page === 1
          ? `https://otakudesu.best/genres/${slug}`
          : `https://otakudesu.best/genres/${slug}/page/${page}/`;

      const response = await fetch(url, { headers });
      if (!response.ok) break;

      const html = await response.text();
      const $ = cheerio.load(html);

      const items = $(".venser .col-anime");
      if (!items.length) break;

      items.each((_, el) => {
        const title = $(el)
          .find(".col-anime-title a")
          .text()
          .trim();
        let link = $(el).find(".col-anime-title > a").attr("href");

        let image = $(el)
          .find(".col-anime-cover img")
          .attr("src");

        if (image?.startsWith("/")) {
          image = "https://otakudesu.best" + image;
        }

        const eps = $(el)
          .find(".col-anime-eps")
          .text()
          .trim();
        const linkPraf = link.split("/")[4]
        result.push({
          title, image, eps, linkPraf
        });
      });

      page++;
      await new Promise(r => setTimeout(r, 400)); // anti 403
    }

    res.json({
      genre: slug,
      total: result.length,
      data: result
    });

  } catch (err) {
    res.status(500).json({
      message: "Gagal mengambil semua data",
      error: err.message
    });
  }
};
