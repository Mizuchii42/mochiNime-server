//import fetch from "node-fetch";
import * as cheerio from "cheerio";
const cleanText = (text) => {
  return text ? text.trim().replace(/\s+/g, ' ') : '';
};
const resolveUrl = (baseUrl, url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return new URL(url, baseUrl).href;
};

export const home = async (req, res) => {
  try {
    const baseUrl = "https://otakudesu.best/"
    const response = await fetch(baseUrl);
    const body = await response.text();
    const $ = cheerio.load(body);

    const data = [];

    const venzSections = $('.venz');
    venzSections.each((sectionIndex, sectionElement) => {
      const $section = $(sectionElement);

      // Cari parent div untuk mendapatkan title section
      const parentSection = $section.closest('.rseries, .detpost, div[class*="series"]');
      let sectionTitle = 'Episode Terbaru';

      // Coba ambil title dari berbagai selector
      const titleElement = parentSection.find('h1').first();
      if (titleElement.length > 0) {
        sectionTitle = cleanText(titleElement.text()) || sectionTitle;
      }

      const animeItems = [];

      // Scrape setiap item di dalam ul li
      $section.find('ul li').each((itemIndex, itemElement) => {
        const $item = $(itemElement);

        // Extract data berdasarkan struktur yang terlihat
        const linkElement = $item.find('a').first();
        const title = cleanText(linkElement.text());
        const link = linkElement.attr('href');

        // Extract episode info dari span dengan class yang mengandung 'episode'
        const episodeSpan = $item.find('span[class*="ep"], .epz, span:contains("Episode")').first();
        const episode = cleanText(episodeSpan.text());

        // Extract date dari span dengan class yang berkaitan dengan waktu
        const dateSpan = $item.find('.newnime, span[class*="time"], span[class*="date"]').first();
        const date = cleanText(dateSpan.text());

        // Extract image jika ada
        const image = $item.find('img').attr('src') || $item.find('img').attr('data-src');
        const links = resolveUrl(baseUrl, link);
        if (title) {
          animeItems.push({
            title,
            episode: episode || 'Unknown',
            date: date || 'Unknown',
            link: links.split("/")[4],
            image: resolveUrl(baseUrl, image)
          });
        }
      });

      if (animeItems.length > 0) {
        data.push({
          section: sectionTitle,
          content: animeItems
        });
      }
    });

    // 2. Scrape dari div.detpost (detail posts/ongoing anime)
    $('.detpost').each((sectionIndex, sectionElement) => {
      const $section = $(sectionElement);

      // Skip jika sudah di-scrape di atas
      if ($section.find('div.rvad').length > 0) return;

      const sectionTitle = cleanText($section.find('h1').first().text()) || 'Anime Ongoing';
      const animeItems = [];

      // Scrape items dalam section ini
      $section.find('ul li, .anime-item').each((itemIndex, itemElement) => {
        const $item = $(itemElement);

        const linkElement = $item.find('a').first();
        const title = cleanText(linkElement.text());
        const link = linkElement.attr('href');

        const episode = cleanText($item.find('.epz, .episode').text());
        const date = cleanText($item.find('.newnime, .date').text());
        const image = $item.find('img').attr('src');

        if (title) {
          animeItems.push({
            title,
            episode: episode || 'Ongoing',
            date: date || 'Unknown',
            link: resolveUrl(baseUrl, link),
            image: resolveUrl(baseUrl, image)
          });
        }
      });

      if (animeItems.length > 0) {
        data.push({
          section: sectionTitle,
          content: animeItems
        });
      }
    });

    // 3. Scrape dari div.rseries (anime series)
    $('.rseries').each((sectionIndex, sectionElement) => {
      const $section = $(sectionElement);

      // Skip jika sudah di-scrape di atas
      if ($section.find('div.rvad').length > 0) return;

      const sectionTitle = cleanText($section.find('h1').first().text()) || 'Anime Series';
      const animeItems = [];

      $section.find('ul li, .series-item').each((itemIndex, itemElement) => {
        const $item = $(itemElement);

        const linkElement = $item.find('a').first();
        const title = cleanText(linkElement.text());
        const link = linkElement.attr('href');

        // Untuk series, mungkin tidak ada episode spesifik
        const status = cleanText($item.find('.status, .type').text());
        const rating = cleanText($item.find('.rating, .score').text());
        const image = $item.find('img').attr('src');

        if (title) {
          animeItems.push({
            title,
            episode: status || 'Series',
            date: 'Various',
            link: resolveUrl(baseUrl, link),
            image: resolveUrl(baseUrl, image),
            rating: rating || null
          });
        }
      });

      if (animeItems.length > 0) {
        data.push({
          section: sectionTitle,
          content: animeItems
        });
      }
    });

    // 4. Fallback: scrape semua link anime yang ada
    if (data.length === 0) {
      console.log("Using fallback scraping...");

      const fallbackItems = [];
      $('a[href*="/anime/"]').each((index, element) => {
        if (index >= 30) return false; // Limit to 20 items

        const $link = $(element);
        const title = cleanText($link.text());
        const link = $link.attr('href');

        // Skip jika title kosong atau terlalu pendek
        if (!title || title.length < 3) return;


        const $parent = $link.closest('li, .item, .post');
        const episode = cleanText($parent.find('.epz, .episode').text());
        const date = cleanText($parent.find('.newnime, .date').text());
        const image = $parent.find('img').attr('src');

        fallbackItems.push({
          title,
          episode: episode || 'Unknown',
          date: date || 'Unknown',
          link: resolveUrl(baseUrl, link),
          image: resolveUrl(baseUrl, image)
        });
      });

      if (fallbackItems.length > 0) {
        data.push({
          section: 'Anime List',
          content: fallbackItems
        });
      }
    }
    console.log(data)
    console.log(`Scraping completed. Found ${data.length} sections with total ${data.reduce((acc, section) => acc + section.content.length, 0)} anime items`);
    res.send({
      data
    })
  } catch (err) {
    console.log("err log: " + err);
    res.status(500).json({ error: "Internal server error" });
  }
};
