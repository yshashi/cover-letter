---
description: "Angular/TypeScript style rules for component, service, and model files in this app"
applyTo: "src/app/**/*.ts"
---

# Angular Style Rules

Full rationale lives in [best-practices.md](../../src/app/best-practices.md) and [AGENTS.md](../../AGENTS.md) — this file is the actionable subset enforced on every `.ts` edit.

## Components

- `changeDetection: ChangeDetectionStrategy.OnPush` on every component (zoneless app; this is now the consistent, correct default — do NOT use `Eager`/`Default`).
- Do NOT set `standalone: true` (default in Angular 22).
- Inline `template` in the `@Component` decorator, not a separate `.html` file (except the root `App`).
- Use `inject()` for DI, not constructor injection.
- Use `class`/`style` bindings, not `ngClass`/`ngStyle`. For conditional class sets, use `[class]="cond ? 'a b' : 'c d'"` (see [template-selector.ts](../../src/app/components/template-selector.ts)).
- Use native control flow (`@if`, `@for`, `@switch`), not `*ngIf`/`*ngFor`/`*ngSwitch`.
- Use `input()`/`output()` functions instead of `@Input()`/`@Output()` decorators.

## Forms

- Use **Angular Signal Forms** (`import { form, FormField, required, email, validate, submit, applyEach, ... } from '@angular/forms/signals'`). Do NOT use `ReactiveFormsModule`, `FormsModule`, `ngModel`, `FormBuilder`, `FormGroup`, or `FormArray`.
- The model is a plain signal (`signal({...})` or `signal('')`); `form(model, schemaFn)` derives the field tree from it. Never use `null`/`undefined` as a model value — use `''`, `0`, or `[]`.
- A field/path must be **called** to access its state: `form.field().value()`, `form.field().touched()`, `form.field().errors()`. The schema callback's path params (e.g. `schemaPath.name`) are NOT signals — use the rule context's `valueOf`/`stateOf` to read other fields.
- `submit(form, async () => {...})` requires an `async` callback; it marks all fields touched and only runs the callback if the form is valid.
- See [form-editor.ts](../../src/app/components/form-editor.ts) and [profile-manager.ts](../../src/app/components/profile-manager.ts) for examples already in this repo (including an array field for skills, and a single-primitive-field form with a custom `validate()` rule).

## State (signals)

- Private signal named with `#` or `_` prefix; expose as `readonly` via `.asReadonly()`.
- Use `computed()` for derived state; use `update()`/`set()`, never `mutate()`.
- Route all persistence through `StorageService` — never call `localStorage` directly from a component or another service.

## Services

- `providedIn: 'root'`, single responsibility, `inject()` for dependencies.

## TypeScript

- Strict typing; avoid `any`, prefer `unknown` when uncertain; prefer inferred types when obvious.
