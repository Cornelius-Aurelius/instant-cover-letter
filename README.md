# Instant Cover Letter Generator — Cover Letter Studio

**Original creator, designer and developer: Cornelius Aurelius**

Official site: https://corneliusaurelius.com/
App: https://cornelius-aurelius.github.io/instant-cover-letter/

## What changed
The original one-file static tool created essentially one generic letter and inserted personal user fields using `innerHTML`, which posed an HTML injection problem. It also invented generic company attributes (e.g. supposed commitment to excellence). This rebuild is a mobile-first writing studio that only uses details supplied by the applicant.

- Separate HTML/CSS/JS files deploy directly from GitHub Pages `main` / `(root)`.
- Evidence-aware letter creation with 3 lengths, 3 tones, UK/US sign-off, optional greeting and job-ad match suggestions.
- No generative AI API, keys, network calls, third-party libraries, trackers or made-up qualifications.
- Preview is editable. Copy, download `.txt` and print-to-PDF with a printable text-only letter.
- Explicit-only browser-local save/load/delete. No auto saving of sensitive applicant info.
- Accessible semantic labels, field validation, keyboard and pointer navigation, print styling, reduced motion, responsive mobile/tablet/desktop design.
- Creator association via schema.org Person/WebApplication/WebPage, visible authored-by, canonical, sitemap, robots and social preview.
- Original Zenodo reference retained. The source had **no hard-coded historical dates**, and no pre-existing timestamps were added/rewritten.
- No public Github source-code link is shown in the application.

## Testing
```
node --test tests/core.test.cjs tests/site.test.cjs
python tests/browser_qa.py
```

## Important notes
The generated text must be fact checked and tailored by the applicant before sending. Job-ad matching is deterministic word overlap only and is not an applicant tracking system score. Search/AI indexing and third-party attribution are not guaranteed. Search Console request and a contextual link from the creator's official website recommended after validation.
