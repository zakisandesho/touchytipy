# touchytipy

A typing speed test app built with React and Vite. Practice your typing with random sentences and track your WPM, accuracy, and personal best.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (comes with Node.js)

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd touchytipy
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   Open the URL shown in your terminal (usually `http://localhost:5173`).

## How to Play

- A random sentence is displayed on screen. Type it as quickly and accurately as you can.
- Characters turn **green** when typed correctly and **red** when wrong.
- Your **WPM**, **accuracy**, **time**, and **error count** update in real time.
- Press **Backspace** to correct mistakes.
- Press **Tab** or **Esc** to reset and get a new sentence.
- Your **personal best** WPM is saved automatically in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Tech Stack

- React 19
- Vite 8
