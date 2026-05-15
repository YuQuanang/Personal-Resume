# Yu Quan Ang — Personal Portfolio

Welcome to the repository for my personal portfolio website! This project is a modern, modular React web application built with Vite, designed to showcase my background in Computer Science, Business, and my technical project experiences.

It features a premium, Floema-inspired design system with complex bidirectional GSAP animations, a custom magnetic cursor, and butter-smooth scrolling powered by Lenis.

## 🚀 Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Animations**: [GSAP](https://gsap.com/) (GreenSock Animation Platform) + `@gsap/react`
- **Scrolling**: [Lenis](https://lenis.studiofreight.com/) (`@studio-freight/react-lenis`)
- **Styling**: Vanilla CSS (CSS Modules / Global scoped)

## 🛠️ Installation & Setup

To get a local copy up and running, follow these simple steps:

### Prerequisites

You will need [Node.js](https://nodejs.org/en) installed on your machine (v16 or higher is recommended).

### 1. Clone the repository
```bash
git clone https://github.com/YuQuanang/<your-repo-name>.git
cd <your-repo-name>
```
*(Note: Replace `<your-repo-name>` with the actual name of your GitHub repository once pushed)*

### 2. Install dependencies
Run the following command to install all necessary packages (including Vite, React, GSAP, and Lenis):
```bash
npm install
```

### 3. Run the development server
Start the local Vite development server:
```bash
npm run dev
```
Open your browser and navigate to the local host address provided in the terminal (usually `http://localhost:5173`) to view the site.

## 📦 Building for Production

When you're ready to deploy the site (e.g., to Netlify, Vercel, or GitHub Pages), you need to create an optimized production build.

Run the build command:
```bash
npm run build
```

This will generate a `dist` folder containing all the minified HTML, CSS, and JS files, which are ready to be hosted.

## 📁 Project Structure highlights
- `/src/components/sections/` - Contains individual layout components (Hero, About, Projects, etc.)
- `/src/components/ui/` - Contains reusable UI elements like the CustomCursor, SplitText utility, and Magnetic wrapper.
- `/src/hooks/` - Contains custom React hooks (e.g., `useBidirScrollTrigger` for GSAP intersection observers).
- `/src/index.css` - The global stylesheet containing all design tokens and layout logic.
- `/legacy_static/` - A backup of the original vanilla HTML/JS implementation of the site.

---
*Designed & Built by Yu Quan Ang*
