This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([sign up here](https://supabase.com))
- A GitHub account (for OAuth)

### Setup Instructions

1. **Install dependencies:**

```bash
npm install
```

2. **Set up Supabase:**

   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings > API
   - Copy your Project URL (looks like `https://xxxxx.supabase.co`)
   - Copy your `anon` public key (it's a long JWT token starting with `eyJ...`)
   - **Important:** Make sure you copy the entire key - it's a very long string!

3. **Configure GitHub OAuth in Supabase:**

   - Go to Authentication > Providers in your Supabase dashboard
   - Enable GitHub provider
   - Create a GitHub OAuth App:
     - Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
     - Click "New OAuth App"
     - **Important:** Set Authorization callback URL to: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
       - Replace `[YOUR-PROJECT-REF]` with your actual Supabase project reference ID
       - You can find your project reference in your Supabase project URL
       - Example: `https://abcdefghijklmnop.supabase.co/auth/v1/callback`
     - Copy the Client ID and Client Secret
   - Paste the Client ID and Client Secret into Supabase GitHub provider settings
   - **Make sure the callback URL in GitHub matches exactly** - this is critical for OAuth to work

4. **Create environment variables:**

   Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. **Run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

6. **Set up Supabase Database:**

   To use the Goals feature, you need to create the goals table in your Supabase database:

   - Go to your Supabase Dashboard
   - Navigate to SQL Editor
   - Run the SQL script from `supabase-schema.sql` file in the project root
   - This will create the `goals` table with proper Row Level Security policies

   Alternatively, you can run this SQL directly in the Supabase SQL Editor:

   ```sql
   -- See supabase-schema.sql for the complete schema
   ```

### Authentication

The app uses Supabase for GitHub OAuth authentication. Users must sign in with GitHub to access the dashboard. The authentication flow is handled automatically through Supabase's built-in OAuth provider.

### Features

- **Dashboard**: Overview of GitHub activity with real-time data
- **Repositories**: Browse and search your GitHub repositories with pagination
- **Performance**: Analytics and insights from your GitHub activity
- **Goals**: Set and track development goals (requires Supabase database setup)

### Project Structure

- `/app` - Next.js App Router pages and API routes
- `/components` - React components
- `/lib` - Utility functions and Supabase clients
- `/hooks` - Custom React hooks
- `/middleware.ts` - Next.js middleware for route protection

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
