Static blank-page debug (SPA)

Symptom: blank React page, Django serves index.html but nothing mounts.

Likely mismatch:
- core/static/index.html references: /static/js/main.70b62dc1.js and /static/css/main.e6c13ad2.css
- repo contains: core/static/static/js/... and core/static/static/css/...

Expected for Django:
- With STATICFILES_DIRS=[BASE_DIR/core/static], the files should be found at:
  - core/static/js/main.70b62dc1.js
  - core/static/css/main.e6c13ad2.css

But actual location has an extra directory level:
- core/static/static/js/main.70b62dc1.js
- core/static/static/css/main.e6c13ad2.css

Fix options:
A) Move/copy build output from core/static/static/* to core/static/* (js/, css/, etc.)
B) Or change frontend build/publicPath and/or HTML references to match /static/static/...

Next checks (must do):
1) Browser DevTools -> Network -> filter "static" and reload '/'
2) Confirm whether these requests are 404:
   - /static/js/main.70b62dc1.js
   - /static/css/main.e6c13ad2.css
3) If 404, do fix A or B.

