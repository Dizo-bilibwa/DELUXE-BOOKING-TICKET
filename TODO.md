# Deployment Checklist

## Current Status
- `deluxe-frontend/vercel.json` is configured for a Create React App build.
- `deluxe-frontend/.gitignore` still ignores `/build`, which is correct for Vercel.
- Frontend production build succeeds locally with `npm run build`.
- Backend payment and ticket download flow were updated in this repo, but backend dependencies still need to be installed in the active Python environment before local Django checks can run.

## Next Git Steps
```bash
git add core/serializers.py core/views.py core/urls.py deluxe-frontend/src/Payment.js TODO.md
git commit -m "Improve payment flow and secure ticket download"
git push origin main
```

## Vercel Frontend
- Root directory: `deluxe-frontend`
- Build command: `npm run build`
- Output directory: `build`
- Set `REACT_APP_API_URL` to your deployed Django backend URL before redeploying.

## Render Backend
- `render.yaml` is set up for the Django API and PostgreSQL.
- Set `CORS_ALLOWED_ORIGINS` to your Vercel frontend URL.
- Set `FRONTEND_URL` to your Vercel frontend URL.
- Ensure `SECRET_KEY` and `DATABASE_URL` are present in Render.

## Redeploy
```bash
cd deluxe-frontend
vercel --prod
```

## Notes
- Do not commit the generated `build/` folder for Vercel.
- The ticket PDF download now requires a logged-in user and a successful payment record.
- The current payment flow is still simulated until a real payment gateway is integrated.
