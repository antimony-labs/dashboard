# UI & Aesthetic Standards

The frontend dashboard of antimony-labs must look exceptionally premium. **"Basic MVPs" are strictly rejected.**

## Core Aesthetics
1. **Dark Mode by Default**: The application should have a deep, seamless dark background. Use subtle animated gradients (`#0a0a0a` to `#111` or deep space colors).
2. **Glassmorphism**: Cards, sidebars, and panels should use glassmorphism.
   - Always use a class like `.glass-panel` instead of opaque blocks.
   - Provide a backdrop-filter blur and a highly transparent white/grey border.
3. **Typography**: Use modern, crisp sans-serif fonts (e.g., Inter, Outfit) with high contrast colors.
4. **Micro-animations**: Elements MUST feel alive.
   - Hovering over a card should trigger a slight translate (scale up 1.02) and an increase in border glow.
   - Use subtle pulsing animations for "Active/Online" status indicators.

## CSS Rules
- We use **Vanilla CSS** (`app/globals.css`).
- Avoid TailwindCSS utility spam for complex glassmorphism blocks; centralize into reusable semantic Vanilla CSS classes. 
- Maintain a highly organized token system in `:root` for colors and spacing.

## Component Structure
- Keep React components clean.
- Abstract purely visual wrapper elements (like `Card` or `GlassContainer`) into reusable component functions.
