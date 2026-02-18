# CyberNav Hub - AI Development Rules

## Tech Stack
- **React 19 & TypeScript**: Core framework for building a type-safe, high-performance user interface.
- **Vite**: Modern build tool for fast development and optimized production bundles.
- **Tailwind CSS**: Primary styling engine using utility classes for responsive, cyberpunk-themed designs.
- **React Router 7**: Handles all client-side routing and navigation logic.
- **Lucide React**: Standard library for all iconography across the application.
- **Google Generative AI (@google/genai)**: Integrated for neural-link features and dynamic content generation.
- **Custom 3D & Motion**: Utilizes CSS perspective and transforms for high-fidelity UI interactions like the login flip-card.

## Development Rules

### 1. Styling & Design
- **Tailwind First**: Always use Tailwind CSS classes for layout, spacing, and colors.
- **Cyber Theme**: Use the custom `cyber-` color palette (`cyber-bg`, `cyber-neon`, `cyber-deep`) defined in `index.html`.
- **Responsiveness**: Every component must be fully responsive and mobile-friendly.
- **Animations**: Use Tailwind's transition utilities or custom keyframes defined in the config for motion.

### 2. Component Architecture
- **Small Components**: Keep components focused and under 100 lines of code. Refactor into sub-components if they grow too large.
- **File Structure**: Place pages in `src/pages/` and reusable UI elements in `src/components/`.
- **Lucide Icons**: Only use `lucide-react` for icons to maintain visual consistency.

### 3. Routing & Navigation
- **React Router**: Use `useNavigate` for programmatic navigation and `Link` for declarative links.
- **BottomNav**: Ensure all main application routes are registered in the `BottomNav.tsx` items list.

### 4. AI Integration
- **Gemini AI**: Use the `GoogleGenAI` client for any AI-related tasks.
- **Environment Variables**: Access the API key via `process.env.API_KEY` as configured in Vite.

### 5. Code Quality
- **TypeScript**: Maintain strict typing. Avoid `any` at all costs.
- **Clean Code**: Prioritize readability and simplicity. Avoid over-engineering simple features.