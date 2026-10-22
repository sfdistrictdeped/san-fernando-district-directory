SFD OneDirectory — PWA Identity Fix (v1.0)
===========================================

Files in this ZIP:
- manifest.json
- service-worker.js

Deploy
1. Extract this ZIP.
2. In the sfdistrictdeped/san-fernando-district-directory repository, replace
   manifest.json and service-worker.js in the repository root.
3. Keep index.html, icons/, and all logo/image files unchanged.
4. Commit and wait for GitHub Pages to deploy.
5. Verify:
   https://sfdistrictdeped.github.io/san-fernando-district-directory/manifest.json

Expected manifest identity:
- id: /san-fernando-district-directory/
- start_url: /san-fernando-district-directory/
- scope: /san-fernando-district-directory/

Important:
- This identity matches the current GitHub Pages project path and is distinct
  from AutoTarp's /autotarp/ identity.
- If the repository is renamed or GitHub Pages moves to a different path, update
  these three manifest values and check service-worker registration in index.html.
- The service worker uses an app-specific cache prefix and only intercepts URLs
  within its registered scope. It deletes older caches only when their names
  start with "sfd-one-directory-".
- After deployment, uninstall the incorrectly identified SFD OneDirectory and
  reinstall it from its canonical URL if the browser still shows stale identity.
