# AIDock Setup Guide

## Quick Setup (5 minutes)

### 1. Environment Variables
Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_OmsLjcfdkCMgJrCP0Frpeg_jMN0Af_k
```

**Note**: You need to replace `https://your-project.supabase.co` with your actual Supabase project URL.

### 2. Database Setup
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/schema.sql`
4. Run the SQL to create all tables and relationships

### 3. Add Your Own Data
1. Use the tool submission form at `/submit` to add AI tools
2. Or use the admin dashboard at `/admin` to manage tools
3. Create user accounts through the registration form

### 4. Start the App
```bash
npm run dev
```

Visit `http://localhost:5173` to see your AI tools directory!

## What's Included

✅ **Complete React App** with TypeScript and Tailwind CSS
✅ **Database Schema** with all necessary tables
✅ **Authentication System** ready for Supabase
✅ **Tool Submission System** for adding AI tools manually
✅ **Responsive Design** with dark mode support
✅ **Admin Dashboard** for tool approval
✅ **Search and Filtering** functionality
✅ **User Profiles** and upvoting system

## Next Steps

1. **Set up Supabase Authentication** - Configure email and Google OAuth
2. **Add Stripe Integration** - For paid featured listings
3. **Configure Mailchimp** - For newsletter subscriptions
4. **Deploy to Vercel** - For production hosting

## Troubleshooting

- **Import errors**: Make sure all file paths are correct
- **Database errors**: Verify your Supabase credentials and run the schema
- **Build errors**: Run `npm install` to ensure all dependencies are installed

## Support

If you encounter any issues, check the main README.md for detailed documentation.
