# Future Finders private replies — setup

This folder is the starter for a private reply system. It is **not live just because these files are in GitHub**: GitHub Pages is static hosting and cannot safely store private replies by itself.

## Design
- A visitor submits an idea and receives a random reference code.
- The project team can add a reply to that submission.
- The visitor uses the reference code to check for a reply.
- The database denies direct public reads and writes. A server-side function must validate reference codes and access the database using a secret stored only by the backend.

## Required one-time setup
A trusted adult needs to create a free Supabase project, run `schema.sql` in its SQL editor, and deploy a server-side function with the Supabase service-role key stored as a server secret. **Never put the service-role key in any file in this public repository.**

After that, the website can be connected to the deployed function and tested. Until then, do not tell visitors that replies can be stored or checked online.

## Privacy
Do not ask children to enter home addresses or sensitive personal information. Reference codes should be treated like passwords: anyone who has one may be able to see the related reply. Keep the code private and involve a trusted adult in handling submissions.
