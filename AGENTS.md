# AGENTS.md

Cover Letter Generator — an Angular 22 zoneless SPA that lets users pick a template, fill a form, and preview/export a cover letter as PDF. No backend; all persistence is `localStorage`.

## Commands

- `npm start` / `ng serve` — dev server at `http://localhost:4200`
- `npm run build` / `ng build` — production build to `dist/`
- `npm test` / `ng test` — unit tests via **Vitest** (not Karma/Jasmine, despite devDependencies still listing them)
- `ng generate component <name>` — scaffold a component (project prefix is `app`)

## Architecture

- **Zoneless**: `provideZonelessChangeDetection()` in [app.config.ts](src/app/app.config.ts) — no Zone.js. Change detection relies on signals.
- **No routing yet**: [app.routes.ts](src/app/app.routes.ts) is empty; the app is single-view, composed in [app.html](src/app/app.html) from top-level components.
- **State flows through services, not a store.** `CoverLetter` ([services/cover-letter.ts](src/app/services/cover-letter.ts)) is the central signal-based state holder (form data, selected template, compiled preview HTML) and owns the built-in template definitions (HTML strings with `{{placeholder}}` / `{{#if_has_x}}...{{/if_has_x}}` mini-templating, compiled in this service — not a templating library).
- `StorageService` ([services/storage.ts](src/app/services/storage.ts)) wraps all `localStorage` access (profiles, autosave, current profile). `CoverLetter` calls it via an `effect()` to autosave on every form change — always route persistence through this service, don't touch `localStorage` directly elsewhere.
- `NotificationService` / `<app-notification>` is the toast system — use `notification.success/error/warning/info(message)` for user feedback instead of `alert()`.
- `Theme` service toggles the `dark` class on `<html>` and persists to `localStorage`; Tailwind `dark:` variants are used throughout templates.
- Models live in [models/cover-letter.ts](src/app/models/cover-letter.ts): `CoverLetterData` (form fields) and `CoverLetterTemplate` (id/name/description/template string/sample data).

## Conventions actually used in this codebase

The codebase now matches [best-practices.md](src/app/best-practices.md) — this is the current, consistent state (as of the Signal Forms/OnPush revamp):

- All components use `changeDetection: ChangeDetectionStrategy.OnPush` (the zoneless-compatible default; `Eager`/`Default` is only for legacy CheckAlways behavior and should not be used in new code).
- No `standalone: true` in `@Component` decorators (implicit default) and no `ngClass`/`ngStyle` — use `[class]`/`[class.x]`/`[style.x]` bindings instead. See [template-selector.ts](src/app/components/template-selector.ts) for the `[class]="cond ? 'a' : 'b'"` pattern used for conditional class sets.
- **Forms use Angular Signal Forms** (`@angular/forms/signals` — `form()`, `FormField`, `required`, `email`, `validate`, `submit`), not `ReactiveFormsModule`/`FormsModule`/`ngModel`. See [form-editor.ts](src/app/components/form-editor.ts) (full model-driven form with an array field for skills) and [profile-manager.ts](src/app/components/profile-manager.ts) (single-field form with a custom `validate()` rule) for the patterns to follow. Remember: a `FormField`/path must be **called as a function** to read its state (`field().touched()`, `field().errors()`), and path objects inside the schema callback are not signals — use `valueOf`/`stateOf` from the rule context to read other fields.
- Templates are inline strings inside the `@Component` decorator (no separate `.html` files) for all components except the root `App`.
- Use `inject()` for DI everywhere — no constructor injection.
- Signals: private signal named with `#` or `_` prefix, exposed as `readonly` via `.asReadonly()` (see `Theme`, `NotificationService`, `CoverLetter`). Component-local inputs use `input()`, not `@Input()` (see [character-counter.ts](src/app/components/character-counter.ts)).
- Styling is Tailwind utility classes with shared component classes defined in [styles.css](src/styles.css) (`.btn-primary`, `.card`, `.form-input`, `.section-title`, etc.) — reuse these instead of duplicating utility strings.

## Key pitfalls

- PDF export uses `html2pdf.js` on the live preview DOM in [preview.ts](src/app/components/preview.ts); preview HTML is rendered via `[innerHTML]` with `DomSanitizer.bypassSecurityTrustHtml` — template strings must not include unsanitized user input beyond what the existing placeholder substitution already handles.
- `CoverLetter`'s autosave `effect()` guards on `isInitialized` to avoid overwriting saved data during construction — keep this guard if you touch that constructor.
- `localStorage` keys are prefixed `lp_coverletter_*`; keep this prefix for any new persisted keys.

For full Angular/TypeScript style rules (signals, `input()`/`output()`, control flow, forms), see [best-practices.md](src/app/best-practices.md).
