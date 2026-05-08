# Cat App

Expo Router React Native app for uploading, listing, favouriting, and voting on cat images with The Cat API.

## Setup

Install dependencies:

```bash
npm install
```

Create environment variables:

```bash
EXPO_PUBLIC_API_KEY=your_cat_api_key
EXPO_PUBLIC_BASE_URL=https://api.thecatapi.com/v1
```

Run the app:

```bash
npm start
```

Useful checks:

```bash
npm run lint
npx tsc --noEmit
```

## Routes

- `/` lists uploaded cats and lets you favourite, unfavourite, vote, and view scores.
- `/upload` lets you select and upload a cat image.
