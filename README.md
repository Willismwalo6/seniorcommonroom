# COMMON ROOM website
Static site — open index.html, or upload the whole folder to any host.

## Before launch
1. **WhatsApp number** — js/data.js → `CONFIG.whatsapp` (e.g. `254712345678`, digits only). Also set phone, email, delivery zones/fees there.
2. **Images** — see images/README.md for exact file names. Missing photos show a brown placeholder automatically.
3. **Reviews** — js/data.js → `CR.REVIEWS` holds sample feedback. Replace with real ones, then set `sampleReviewsNotice: false`.
4. **Menu / prices** — js/data.js → the `RAW` list.
5. Terms & Cookies text lives in js/app.js (`MODALS`) — review before going live.

Pages are generated from shared JS (header, footer, cart); styles are in css/style.css.
