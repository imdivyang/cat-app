# Cat App 🐱

A React Native mobile app built with Expo for uploading, listing, favouriting, and voting on cat images using [The Cat API](https://thecatapi.com).

Built as part of a frontend technical test.

---

## Features

- 📸 Upload cat images from your device
- 🖼️ View all uploaded cats in a responsive grid (up to 4 columns)
- ❤️ Favourite and unfavourite cats with a single tap
- 👍👎 Vote cats up or down
- 🏆 See a live score on each cat based on votes
- 🔄 Pull to refresh the cat gallery
- ⚡ Optimistic UI updates for instant feedback

---

## Tech Stack

| Technology                   | Purpose                           |
| ---------------------------- | --------------------------------- |
| React Native + Expo          | Mobile framework                  |
| TypeScript                   | Type safety                       |
| Expo Router                  | File-based navigation             |
| NativeWind v4 (Tailwind CSS) | Styling                           |
| TanStack Query (React Query) | Server state management + caching |
| Axios                        | HTTP client                       |
| expo-image-picker            | Image selection from device       |
| The Cat API                  | Backend API                       |

---

## Project Structure

```
cat-app/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   └── upload/
│       └── index.tsx
├── src/
│   ├── api/
│   │   ├── cats.ts
│   │   └── queryKeys.ts
│   ├── components/
│   │   ├── CatCard.tsx
│   │   └── PageHeader.tsx
│   ├── constants/
│   │   └── config.ts
│   ├── hooks/
│   │   ├── use-cat-gallery.ts
│   │   └── use-responsive-cat-grid.ts
│   └── types/
│       └── env.d.ts
├── .env
├── global.css
├── tailwind.config.js
├── metro.config.js
└── babel.config.js
```

---

## Routes

| Route     | Description                                              |
| --------- | -------------------------------------------------------- |
| `/`       | Lists all uploaded cats with favourite and vote controls |
| `/upload` | Select and upload a new cat image                        |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator (or Expo Go on a physical device)
- A free API key from [thecatapi.com](https://thecatapi.com)

### Installation

1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/cat-app.git
cd cat-app
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root of the project

```bash
EXPO_PUBLIC_API_KEY=your_cat_api_key_here
EXPO_PUBLIC_BASE_URL=https://api.thecatapi.com/v1
```

4. Start the app

```bash
npm start
```

5. Press `i` for iOS Simulator or `a` for Android Emulator

---

## Key Technical Decisions

**TanStack Query** was chosen for server state management. It handles caching, background refetching, and optimistic updates out of the box — reducing boilerplate and making the UI feel instant.

**Optimistic Updates** are implemented on both favouriting and voting. The UI updates immediately on tap without waiting for the API response, giving a smooth native feel.

**NativeWind v4** was used for styling to keep component code clean and consistent using Tailwind utility classes instead of verbose StyleSheet objects.

**Per-card loading state** is tracked using a `Set<string>` of image IDs rather than a global boolean, so only the tapped card shows a loading indicator — not all cards simultaneously.

**Responsive grid** uses `useWindowDimensions` to calculate the number of columns dynamically based on screen width, scaling from 1 column at 340px up to 4 columns on larger screens.

---

## Quality Checks

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

---

## API Reference

All API calls are in `src/api/cats.ts` and integrate with [The Cat API](https://developers.thecatapi.com):

| Function              | Endpoint                 | Description               |
| --------------------- | ------------------------ | ------------------------- |
| `fetchUploadedImages` | `GET /images`            | Fetch uploaded cat images |
| `uploadCatImage`      | `POST /images/upload`    | Upload a new cat image    |
| `fetchFavourites`     | `GET /favourites`        | Fetch all favourites      |
| `addFavourite`        | `POST /favourites`       | Favourite a cat           |
| `removeFavourite`     | `DELETE /favourites/:id` | Unfavourite a cat         |
| `fetchVotes`          | `GET /votes`             | Fetch all votes           |
| `voteOnCat`           | `POST /votes`            | Vote on a cat             |
