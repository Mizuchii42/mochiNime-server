import * as cheerio from "cheerio";

// In-memory cache
const animeData = new Map();

// ==============================
// MAIN CONTROLLER
// ==============================
export const viewPage = async (req, res, url) => {
  const startTime = Date.now();

  try {
    // Cache hit
    if (animeData.has(url)) {
      return res.json({
        ...animeData.get(url),
        cached: true,
        responseTime: Date.now() - startTime
      });
    }

    // Direct scrape
    const data = await performScraping(url);

    animeData.set(url, {
      ...data,
      scrapedAt: new Date().toISOString()
    });

    return res.json({
      ...data,
      cached: false,
      responseTime: Date.now() - startTime
    });

  } catch (err) {
    console.error("Scraping error:", err.message);

    return res.status(500).json({
      success: false,
      error: err.message,
      responseTime: Date.now() - startTime
    });
  }
};

// ==============================
// SCRAPING FUNCTION
// ==============================
async function performScraping(slug) {
  const baseUrl = `https://otakudesu.best/anime/${slug}`;

  const response = await fetch(baseUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Referer": "https://otakudesu.best/"
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const $venser = $(".venser").first();
  if (!$venser.length) {
    throw new Error("Anime content not found");
  }

  // ==============================
  // BASIC INFO
  // ==============================
  const title =
    $venser.find("div.jdlrx > h1").first().text().trim() || "Unknown";

  const image = $venser.find("div.fotoanime > img").attr("src") || null;

  // ==============================
  // DETAIL INFO
  // ==============================
  const info = {};
  $venser
    .find("div.infozin > div.infozingle > p")
    .slice(0, 8)
    .each((_, el) => {
      const text = $(el).text().trim();
      if (!text.includes(":")) return;

      const [key, ...value] = text.split(":");
      info[key.trim().toLowerCase().replace(/\s+/g, "_")] =
        value.join(":").trim();
    });

  // ==============================
  // EPISODES (FIXED)
  // ==============================
  const episodes = [];
  $venser
    .find("div.episodelist > ul > li")
    .each((_, el) => {
      const $link = $(el).find("a");
      if (!$link.length) return;

      const episodeTitle = $link.text().trim();
      const href = $link.attr("href");
      if (!href) return;

      const parts = href.split("/").filter(Boolean);

      episodes.push({
        ptitle: episodeTitle,
        ppath: parts[parts.length - 2] || "",
        plink: parts[parts.length - 1] || ""
      });
    });

  // ==============================
  // FINAL RESULT
  // ==============================
  return {
    success: true,
    url: baseUrl,
    anime: [
      {
        title,
        image,
        content: info,
        eps: episodes,
        episodeCount: episodes.length
      }
    ]
  };
}

// ==============================
// CACHE CLEANER
// ==============================
setInterval(() => {
  const now = Date.now();

  for (const [key, value] of animeData.entries()) {
    const age = now - new Date(value.scrapedAt).getTime();

    if (age > 5 * 60 * 1000) {
      animeData.delete(key);
      console.log(`🗑️ Cache expired: ${key}`);
    }
  }
}, 60 * 1000);
