# 👻 Ghost Protocol - Frontend

A blockchain-powered platform for eternal IP protection and royalty distribution, built for the Story Protocol hackathon.

## 🎨 Overview

Ghost Protocol is the first blockchain protocol that allows creators' intellectual property to earn royalties forever—even after death. Built with modern web technologies and a sophisticated design system inspired by "elegant mortality."

## ✨ Features

### 🏠 Landing Page

- **Hero Section**: Animated particle background with compelling value proposition
- **Problem Statement**: Visual storytelling of IP ownership issues (Bram Stoker example)
- **Solution Cards**: Interactive cards explaining Ghost Protocol's features
- **Stats Section**: Animated counters showing platform impact
- **Timeline**: Step-by-step process visualization
- **Responsive Design**: Mobile-first approach with smooth animations

### 📝 IP Registration Flow

- **Multi-step Form**: 5-step guided registration process
- **File Upload**: Drag-and-drop interface with validation
- **Creator Details**: Handle both living and deceased creators
- **Work Metadata**: AI-assisted content analysis
- **Licensing Terms**: Flexible royalty configuration
- **Live Preview**: Real-time registration preview
- **Progress Tracking**: Visual step indicator with validation

### 🎨 Design System

- **Color Palette**: Warm neutrals with gold accents
- **Typography**: SF Pro Display/Text font system
- **Components**: Production-ready, reusable UI library
- **Animations**: Smooth Framer Motion transitions
- **Accessibility**: WCAG-compliant design patterns

## 🛠 Tech Stack

### Core Technologies

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS v4** - Utility-first styling with custom design tokens

### UI & Animation

- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, consistent icons
- **Class Variance Authority** - Component variant management
- **React Router DOM** - Client-side routing

### Form Management

- **React Hook Form** - Performant form handling
- **Zod** - Schema validation
- **React Dropzone** - File upload interface

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/ghost-protocol.git
   cd ghost-protocol
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint checks

## 🎯 Key Features Implemented

### ✅ Landing Page Components

- [x] Hero section with animated background
- [x] Problem statement with visual examples
- [x] Solution cards with hover effects
- [x] Animated statistics section
- [x] Process timeline with step indicators
- [x] Professional footer with social links

### ✅ IP Registration Flow

- [x] Multi-step form with progress tracking
- [x] File upload with drag-and-drop
- [x] Creator details (living/deceased handling)
- [x] Work metadata collection
- [x] Licensing configuration
- [x] Live preview panel
- [x] Form validation and error handling

### ✅ UI Component Library

- [x] Button component with 9+ variants
- [x] Card component with multiple layouts
- [x] Input/Textarea with validation states
- [x] Modal system with accessibility
- [x] Badge system for status indicators
- [x] Progress components for multi-step flows
- [x] Loading spinners and overlays

### ✅ Design System Foundation

- [x] Comprehensive color palette
- [x] Typography system with SF Pro fonts
- [x] Consistent spacing and sizing
- [x] Animation system with Framer Motion
- [x] Utility functions for common tasks
- [x] TypeScript types for all components

## 🎨 Design Philosophy

**"Elegant Mortality"** - The design blends timeless elegance with modern blockchain aesthetics, creating a sophisticated platform that honors deceased creators while embracing cutting-edge technology.

### Key Principles

1. **Clarity over Complexity** - Information-dense but never cluttered
2. **Respect for Legacy** - Honor deceased creators with dignified design
3. **Trust through Transparency** - All data visible, nothing hidden
4. **Smooth Interactions** - Premium micro-animations, not gimmicky

## 🏆 Hackathon Submission

This project was built for the **Story Protocol Hackathon**, demonstrating:

- **Innovation**: Novel approach to posthumous IP management
- **Technical Excellence**: Production-quality React/TypeScript codebase
- **Design Quality**: Professional UI/UX with comprehensive design system
- **Story Protocol Integration**: Built for seamless blockchain integration
- **Market Potential**: Addresses real problems in IP ownership and inheritance

## 📄 React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

# story_ip

# story_ip

# story_ip

# story_ip

# story_ip

# story_ip

# story_ip

# story_ip
