# Skola Nemackog

Production website repository for German language courses (A1-C1), focused on course information and lead capture via contact form.

## Tech Stack

- PHP
- HTML/CSS/JavaScript
- SEO files (`robots.txt`, `sitemap.xml`, `sitemap-index.xml`)

## Project Structure

- `index.php`: main landing page
- `process-form.php`: contact/lead form processing
- `images/`: media assets
- `privacy-policy.html`, `uslovi-koriscenja.html`: legal pages

## Local Preview

```bash
php -S 127.0.0.1:8080
```

Open: `http://127.0.0.1:8080`

## Live Site

- https://skolanemackog.online

## Deployment Notes

- Deploy is file-based (PHP + static assets).
- Keep `robots.txt` and sitemap files aligned with production URLs.
- Verify form processing in a safe environment before release.

## Language Note

The website content is intentionally in Serbian for the target audience.
