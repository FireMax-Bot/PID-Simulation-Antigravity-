# ANTIGRAVITY // PID DIFFERENTIAL DRIVE

An interactive 3D simulation of a PID-controlled differential drive robot.

![Demo](https://via.placeholder.com/800x450?text=ANTIGRAVITY+Demo)

## Tech Stack
- Next.js 16
- Three.js r184
- TypeScript
- Tailwind CSS v4

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```

## Build for Production

```bash
npm run build
npm start
```

## Google Cloud Run Deploy

To deploy to Google Cloud Run, ensure you have the Google Cloud SDK installed and configured.

```bash
gcloud builds submit --tag gcr.io/[PROJECT_ID]/antigravity
gcloud run deploy antigravity \
  --image gcr.io/[PROJECT_ID]/antigravity \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## License
MIT License
