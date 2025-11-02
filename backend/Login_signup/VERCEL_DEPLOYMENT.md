# Vercel Deployment Guide

## Fixed Issues

1. **Export Statement**: Changed from `app.listen()` to `export default app` for Vercel serverless functions
2. **Dependencies**: Added missing dependencies (`joi-password-complexity`, `joi`, `jsonwebtoken`)
3. **bcrypt Import**: Changed from `bcrypt` to `bcryptjs` in users.js route
4. **vercel.json Configuration**: Updated routing to properly handle Express app

## Deployment Steps

1. Make sure all environment variables are set in Vercel dashboard:
   - MongoDB connection string (if different from hardcoded)
   - Any other environment variables from your .env file
   - JWT secret (currently hardcoded as "secret-123" in user.js - consider moving to env variable)

2. The vercel.json is configured to:
   - Build `api/index.js` as a serverless function
   - Route all requests to `/api/index.js`
   - Express will handle the internal routing (`/api/users`, `/api/auth`, etc.)

## Testing Your Deployment

Once deployed, test these URLs:
- `https://your-app.vercel.app/` - Should return "Express on Vercel"
- `https://your-app.vercel.app/api` - Should return "API is working"
- `https://your-app.vercel.app/api/users` - POST endpoint for signup
- `https://your-app.vercel.app/api/auth` - POST endpoint for login

## Common Issues

If you still get 404:
1. Check that `api/index.js` exists and exports the Express app
2. Verify environment variables are set in Vercel dashboard
3. Check Vercel build logs for any errors
4. Ensure MongoDB connection string is accessible from Vercel's servers

