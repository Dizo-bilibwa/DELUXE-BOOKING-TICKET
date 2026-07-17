# TODO - Debug: blank site on dev server

- [ ] Inspect browser console/network to identify missing JS/CSS/assets
- [ ] Verify Django is serving `core/static/index.html` at `/`
- [ ] Verify TemplateView + staticfiles settings align (DEBUG/WhiteNoise/STATIC_ROOT)
- [ ] Check if JS file paths referenced in `core/static/index.html` exist under `core/static/static/...`
- [ ] If assets are missing, build frontend (React) and copy/collect static files correctly
- [ ] Ensure Django dev server serves uncollected static files (STATICFILES_DIRS) and/or run `collectstatic`
- [ ] Re-test route `/` and SPA routes, confirm React renders

