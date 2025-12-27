# 📚 MochiNime Server API Documentation

Dokumentasi resmi untuk **MochiNime Server API** — API tidak resmi untuk mengambil data anime (pencarian, detail, genre, dan streaming).

---

## 🌐 Base URL

```
https://mochiserver.mochinime.cyou
```

Semua endpoint menggunakan metode **GET** dan mengembalikan **JSON**.

---

## 🏠 Root

### `GET /`

Menampilkan informasi dasar server.

**Response (contoh):**

```json
{
  "message": "MochiNime API is running"
}
```

---

## 🔍 Search Anime

### `GET /search/:name`

Mencari anime berdasarkan judul.

**Path Params**

| Param | Tipe   | Wajib | Deskripsi   |
| ----- | ------ | ----- | ----------- |
| name  | string | ✔     | Judul anime |

**Contoh:**

```
/search/naruto
```

**Response (contoh):**

```json
{
  "results": [
    {
      "title": "Naruto",
      "link": "naruto",
      "image": "https://...jpg"
    }
  ]
}
```

---

## 📖 Detail Anime

### `GET /view/:link`

Mengambil detail anime dan daftar episode.

**Path Params**

| Param | Tipe   | Wajib | Deskripsi         |
| ----- | ------ | ----- | ----------------- |
| link  | string | ✔     | Slug / link anime |

**Contoh:**

```
/view/naruto-shippuden
```

**Response (contoh):**

```json
{
  "title": "Naruto Shippuden",
  "synopsis": "...",
  "episodes": [
    { "title": "Episode 1", "link": "..." }
  ]
}
```

---

## 🏷️ Genre

### `GET /genre/:id`

Mengambil daftar anime berdasarkan genre.

**Path Params**

| Param | Tipe   | Wajib | Deskripsi          |
| ----- | ------ | ----- | ------------------ |
| id    | string | ✔     | ID atau slug genre |

**Contoh:**

```
/genre/vampire
```

**Response (contoh):**

```json
{
  "genre": "vampire",
  "total": 40,
  "data": [
    {
      "title": "Hellsing Ultimate",
      "image": "https://...jpg",
      "eps": "Episode 10"
    }
  ]
}
```

---

## ▶️ Streaming

### `GET /striming/:plink`

Mengambil link streaming untuk episode/anime.

**Path Params**

| Param | Tipe   | Wajib | Deskripsi          |
| ----- | ------ | ----- | ------------------ |
| plink | string | ✔     | Slug episode/anime |

**Contoh:**

```
/striming/naruto-shippuden-episode-1
```

**Response (contoh):**

```json
{
  "streams": [
    { "quality": "720p", "url": "https://..." }
  ]
}
```

---

## ⚠️ Error Handling

**Response (contoh):**

```json
{
  "message": "Data tidak ditemukan"
}
```

HTTP Status:

* `200` OK
* `404` Not Found
* `500` Server Error

---

## 🧠 Catatan

* Tidak membutuhkan API Key
* Gunakan dengan bijak (rate limit alami)
* Struktur HTML sumber dapat berubah

---

## ❤️ Kredit

MochiNime Server API

Jika ingin kontribusi atau issue, silakan hubungi pengembang.

