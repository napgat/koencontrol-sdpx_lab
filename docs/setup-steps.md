# Setup Steps

## Before (WS-05)

1. Install Node.js 24.
2. Run `npm ci`.
3. Run `npm run dev`.

→ 3 steps. Baseline time has not yet been measured on a clean machine.

## After (Lab 05)

1. Run `docker compose up`.

→ 1 command. Repeat startup measured at 6.63 seconds.

> The repeat measurement uses `docker compose up -d --wait` after images have
> already been built. First startup time, including image build and download,
> has not yet been measured.

## Current limitations

- The current MVP does not use a real database.
- Test seed and cleanup endpoints are guarded no-op placeholders.
- `.env.example` is reserved for future authentication and database integration; it is not required to run the current MVP.