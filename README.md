# Skola Nemackog

Produkcioni kod sajta za kurseve nemackog jezika (A1-C1), sa fokusom na pregled programa, nivoa i direktan upit kroz kontakt formu.

## Tehnologije

- PHP (entrypoint i obrada forme)
- HTML/CSS/JavaScript
- SEO fajlovi (`robots.txt`, `sitemap.xml`, `sitemap-index.xml`)

## Kljucne celine

- `index.php`: glavna landing stranica
- `process-form.php`: backend obrada kontakt/lead forme
- `images/`: medijski fajlovi i SEO slike
- `privacy-policy.html`, `uslovi-koriscenja.html`: pravne stranice

## Lokalni razvoj

```bash
php -S 127.0.0.1:8080
```

Zatim otvori: `http://127.0.0.1:8080`.

## Live Preview

- https://skolanemackog.online

## Deploy smernice

- Deploy je file-based (PHP + staticki fajlovi).
- Posle izmena proveri da su `sitemap*.xml` i `robots.txt` uskladjeni sa produkcionim URL-om.
- Obrati paznju da test podaci za formu ne ostanu u kodu.

## Napomena

Repo je namenjen odrzavanju produkcione verzije i brzom rollout-u promena bez build koraka.
