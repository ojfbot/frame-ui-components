# CLAUDE.md — @ojfbot/frame-ui-components

Shared UI component library for Frame OS. All 9 sub-apps import from this package. See ADR-0030.

## Commands

```bash
pnpm install          # install dependencies
pnpm test             # vitest (jsdom)
pnpm type-check       # tsc --noEmit
pnpm storybook        # storybook on port 6007
```

## Structure

```
src/
  components/       # 7 exported components (pure, prop-driven)
  styles/           # 7 CSS files + tokens.css (Carbon custom properties)
  types/actions.ts  # BadgeAction, Action union, factory functions
  __tests__/        # unit tests for all components
.storybook/         # config + colocated stories (*.stories.tsx)
```

## Conventions

- **Pure/prop-driven:** No Redux, no app-specific context. Only React built-ins and Carbon Design System.
- **Style entry points:** Each component has a CSS file importable as `@ojfbot/frame-ui-components/styles/<name>` (e.g. `styles/chat-shell`). Consumers import only the styles they use.
- **Peer dependencies:** `@carbon/react`, `@carbon/styles`, `react`, `react-dom`, `react-markdown`, `remark-gfm`.
- **Source-dependency:** No build step. Consumers import `.tsx` and `.css` directly via `file:../../../frame-ui-components`.

## Adding a component

1. Create `src/components/MyComponent.tsx` (pure, prop-driven)
2. Export from `src/index.ts`
3. Add CSS in `src/styles/MyComponent.css`
4. Add style export path in `package.json` exports map
5. Add test in `src/__tests__/MyComponent.test.tsx`
6. Add story in `src/components/MyComponent.stories.tsx`
