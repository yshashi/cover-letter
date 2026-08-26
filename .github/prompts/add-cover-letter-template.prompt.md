---
description: "Add a new built-in cover letter template to the CoverLetter service"
---

# Add a Cover Letter Template

Add a new entry to the `templates` array in [cover-letter.ts](../../src/app/services/cover-letter.ts), following the existing `professional`/`creative`/etc. entries.

Ask the user for (if not already given): a template `id` (kebab-case, unique), `name`, `description`, and desired visual style/tone.

## Steps

1. **Add a `CoverLetterTemplate` object** to the `templates` array with:
   - `id`, `name`, `description`
   - `template`: an HTML string using Tailwind utility classes (match the visual density/tone of existing templates — reuse `.btn-primary`, `.card`, etc. from [styles.css](../../src/styles.css) where applicable, and support `dark:` variants).
   - `sampleData`: a fully-populated realistic `CoverLetterData` object so the template preview looks good by default.

2. **Use only the supported placeholder syntax** — do not invent new placeholders without also updating `compiledContent` in the same file:
   - Simple substitutions: `{{fullName}}`, `{{email}}`, `{{phone}}`, `{{address}}`, `{{jobTitle}}`, `{{companyName}}`, `{{hiringManager}}`, `{{introduction}}`, `{{experience}}`, `{{closing}}`, `{{date}}`, `{{skillsList}}` (rendered `<li>` items), `{{skillsBadges}}` (rendered `<span>` badges).
   - Conditional blocks (omitted entirely when the field is empty): `{{#if_has_address}}...{{/if_has_address}}`, `{{#if_has_skills}}...{{/if_has_skills}}`, `{{#if_has_experience}}...{{/if_has_experience}}`, `{{#if_has_closing}}...{{/if_has_closing}}`.
   - `{{themeColor}}` is used as a Tailwind color prefix (e.g. `text-{{themeColor}}-700`) in some templates — check whether this is substituted before relying on it; if not, use a fixed color class instead.

3. **Do not add new user-facing input fields** to `CoverLetterData` for this task — templates work with the existing data shape. If the template needs a genuinely new field, flag that as a separate change (model + form-editor + `compiledContent` all need updating).

4. **Verify**: run `npm test`, then `npm start` and visually check the new template appears in the template selector, compiles without leftover `{{...}}` tokens, and looks correct in both light and dark mode.
