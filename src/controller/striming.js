import * as cheerio from "cheerio";

export const stream = async (req, res) => {
  try {
    const { url } = req.params;

    // slug fix (+ → /)
    const parseUrl = url.replace(/\+/g, "/");
    const baseUrl = `https://otakudesu.best/episode/${parseUrl}`;

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

    // ✅ container yang benar
    const container = $(".venser");

    if (!container.length) {
      throw new Error("Stream container not found");
    }

    // ======================
    // STREAM IFRAME
    // ======================
    const iframeSrc =
      container.find("#lightsVideo iframe").attr("src") ||
      container.find("iframe").first().attr("src") ||
      null;

    // ======================
    // MIRROR & RESOLUSI
    // ======================
    const resolutionOptions = [];

    container.find("div.mirrorstream > ul").each((_, ul) => {
      const $ul = $(ul);
      const className = $ul.attr("class") || "";

      let quality = "unknown";
      if (className.includes("m360p")) quality = "360p";
      else if (className.includes("m480p")) quality = "480p";
      else if (className.includes("m720p")) quality = "720p";
      else if (className.includes("m1080p")) quality = "1080p";
      else if (className.includes("mkv")) quality = "download";

      const mirrorTitle = $ul.find("span").parent().text().trim() || quality;

      $ul.find("li > a").each((i, a) => {
        const dataContent = $(a).attr("data-content");
        const server = $(a).text().trim();
        const isDefault = $(a).attr("data-default") === "true";

        if (dataContent) {
          resolutionOptions.push({
            quality,
            mirrorTitle,
            server,
            dataContent,
            isDefault,
            index: i
          });
        }
      });
    });

    // ======================
    // RESPONSE
    // ======================
    res.json({
      success: true,
      url: baseUrl,
      videoStream: iframeSrc,
      resolutionOptions,
      totalResolutions: resolutionOptions.length
    });

  } catch (err) {
    console.error("Stream error:", err.message);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
