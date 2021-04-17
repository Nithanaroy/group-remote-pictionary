# Group Remote Pictionary
Play your favourite pictionary game remotely in WhatsApp and other messaging groups.

## Dev Setup
- Clone the repo
- Create .env.local file with `NEXT_PUBLIC_FIREBASE_API_KEY` field. The API key can be obtained from https://console.firebase.google.com/u/0/project/group-pictionary/settings/general/web:ZTViNWYyYzItZDk0Zi00NzI5LWEwZTQtYjJlMzQwM2JmMjM0. Or you can pull all the environment variables from the hosted website on vercel using `vercel env pull .env.local`. https://nextjs.org/docs/basic-features/environment-variables#environment-variables-on-vercel has more details on environment variables support
- `yarn` to install dependecies
- `next run` or `npm run dev` to start the server

