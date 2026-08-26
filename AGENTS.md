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
- **Personal info vs. job info**: `PersonalInfo` (fullName/email/phone/address) is a single global value owned by `PersonalInfoService` ([services/personal-info.ts](src/app/services/personal-info.ts)) and edited once in `<app-personal-info-editor>`. It is never duplicated per template/profile — `CoverLetter.formData` is a `computed()` that merges `personalInfo.data()` with the per-letter `JobLetterData`. Saved profiles ([services/storage.ts](src/app/services/storage.ts) `SavedProfile.data`) and built-in template `sampleData` only contain `JobLetterData` (job title, company, intro, skills, etc.) — do not add personal fields back into either.
- **State flows through services, not a store.** `CoverLetter` ([services/cover-letter.ts](src/app/services/cover-letter.ts)) holds the per-letter `JobLetterData` signal, the selected template, and the merged `compiledContent` preview HTML; it owns the built-in template definitions (HTML strings with `{{placeholder}}` / `{{#if_has_x}}...{{/if_has_x}}` mini-templating, compiled in this service — not a templating library). `{{themeColor}}` is substituted with the literal string `accent` so templates render with the app's accent color scale.
- `StorageService` ([services/storage.ts](src/app/services/storage.ts)) wraps all `localStorage` access (profiles, autosave, current profile, personal info). Both `CoverLetter` and `PersonalInfoService` call it via an `effect()` to autosave on every change — always route persistence through this service, don't touch `localStorage` directly elsewhere.
- `NotificationService` / `<app-notification>` is the toast system — use `notification.success/error/warning/info(message)` for user feedback instead of `alert()`.
- `Theme` service toggles the `dark` class on `<html>` and persists to `localStorage`; Tailwind `dark:` variants are used throughout templates.
- Models live in [models/cover-letter.ts](src/app/models/cover-letter.ts): `PersonalInfo`, `JobLetterData`, merged `CoverLetterData = PersonalInfo & JobLetterData`, and `CoverLetterTemplate` (sampleData is `JobLetterData` only).
- **Mobile layout**: below the `lg:` breakpoint, [app.html](src/app/app.html) shows an Edit/Preview segmented tab (state in `App.mobileView` signal) instead of the two-column layout, since the edit form is long relative to the payoff (the preview).

## Conventions actually used in this codebase

The codebase now matches [best-practices.md](src/app/best-practices.md) — this is the current, consistent state (as of the Signal Forms/OnPush revamp):

- All components use `changeDetection: ChangeDetectionStrategy.OnPush` (the zoneless-compatible default; `Eager`/`Default` is only for legacy CheckAlways behavior and should not be used in new code).
- No `standalone: true` in `@Component` decorators (implicit default) and no `ngClass`/`ngStyle` — use `[class]`/`[class.x]`/`[style.x]` bindings instead. See [template-selector.ts](src/app/components/template-selector.ts) for the `[class]="cond ? 'a' : 'b'"` pattern used for conditional class sets.
- **Forms use Angular Signal Forms** (`@angular/forms/signals` — `form()`, `FormField`, `required`, `email`, `validate`, `submit`), not `ReactiveFormsModule`/`FormsModule`/`ngModel`. See [form-editor.ts](src/app/components/form-editor.ts) (full model-driven form with an array field for skills) and [profile-manager.ts](src/app/components/profile-manager.ts) (single-field form with a custom `validate()` rule) for the patterns to follow. Remember: a `FormField`/path must be **called as a function** to read its state (`field().touched()`, `field().errors()`), and path objects inside the schema callback are not signals — use `valueOf`/`stateOf` from the rule context to read other fields.
- Templates are inline strings inside the `@Component` decorator (no separate `.html` files) for all components except the root `App`.
- Use `inject()` for DI everywhere — no constructor injection.
- Signals: private signal named with `#` or `_` prefix, exposed as `readonly` via `.asReadonly()` (see `Theme`, `NotificationService`, `CoverLetter`). Component-local inputs use `input()`, not `@Input()` (see [character-counter.ts](src/app/components/character-counter.ts)).
- Styling is Tailwind utility classes with shared component classes defined in [styles.css](src/styles.css) (`.btn-primary`, `.card`, `.form-input`, `.section-title`, etc.) — reuse these instead of duplicating utility strings.
- **Theme**: warm-neutral (`stone`) base + a single `accent` color scale defined in [tailwind.config.js](tailwind.config.js) — no `primary`/`secondary` hues, no gradient-text/`shadow-glow` effects, no animated background blobs. Keep new UI flat/editorial; only `fade-in`/`slide-in-*` micro-animations remain.

## Key pitfalls

- PDF export uses `html2pdf.js` on the live preview DOM in [preview.ts](src/app/components/preview.ts); preview HTML is rendered via `[innerHTML]` with `DomSanitizer.bypassSecurityTrustHtml` — template strings must not include unsanitized user input beyond what the existing placeholder substitution already handles.
- `CoverLetter`'s autosave `effect()` guards on `isInitialized` to avoid overwriting saved data during construction — keep this guard if you touch that constructor (`PersonalInfoService` has the same guard).
- `localStorage` keys are prefixed `lp_coverletter_*`; keep this prefix for any new persisted keys.
- `PersonalInfoService` seeds itself once from legacy autosave data (`StorageService.getLegacyPersonalInfoFromAutoSave()`) for users who had data saved before the personal/job split — don't remove this migration path.

For full Angular/TypeScript style rules (signals, `input()`/`output()`, control flow, forms), see [best-practices.md](src/app/best-practices.md).
