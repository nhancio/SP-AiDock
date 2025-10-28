# AIDock - AI Tools Directory & Marketplace

A comprehensive directory and marketplace for AI tools and agents, built with React, TypeScript, and Supabase.

## Features

- 🔍 **Browse AI Tools** - Discover tools by category, pricing, and popularity
- 📝 **Submit Tools** - Easy tool submission with approval workflow
- 👥 **User Authentication** - Sign up, sign in, and manage profiles
- ⭐ **Upvote System** - Community-driven tool ranking
- 🎨 **Modern UI** - Clean, responsive design with dark mode
- 🔧 **Admin Dashboard** - Tool approval and analytics
- 💰 **Monetization Ready** - Stripe integration for paid listings
- 📧 **Newsletter** - Mailchimp integration for subscriptions

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Payments**: Stripe
- **Email**: Mailchimp
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd AiDock
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration (Optional)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Mailchimp Configuration (Optional)
MAILCHIMP_API_KEY=your_mailchimp_api_key
MAILCHIMP_LIST_ID=your_mailchimp_list_id

# OpenAI Configuration (Optional)
OPENAI_API_KEY=your_openai_api_key

# App Configuration
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=AIDock
```

### 3. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
3. Add your own tools through the submission form or admin dashboard

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   ├── Layout.tsx      # Main layout wrapper
│   ├── ToolCard.tsx    # Tool display card
│   ├── CategoryCard.tsx # Category display card
│   └── SearchBar.tsx   # Search modal component
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state
│   └── ThemeContext.tsx # Dark/light theme
├── pages/              # Page components
│   ├── HomePage.tsx    # Landing page
│   ├── ToolsPage.tsx   # Tools listing
│   ├── ToolDetailPage.tsx # Individual tool page
│   ├── SubmitToolPage.tsx # Tool submission form
│   ├── LoginPage.tsx   # User login
│   ├── RegisterPage.tsx # User registration
│   ├── ProfilePage.tsx # User profile
│   ├── AdminDashboard.tsx # Admin panel
│   ├── CategoryPage.tsx # Category listing
│   └── NotFoundPage.tsx # 404 page
├── lib/                # Utilities and configs
│   └── supabase.ts     # Supabase client setup
└── types/              # TypeScript type definitions
```

## Database Schema

The app uses the following main tables:

- **users** - User accounts and profiles
- **tools** - AI tools directory
- **categories** - Tool categories
- **upvotes** - User upvotes for tools
- **featured_tools** - Paid featured listings
- **analytics** - Usage tracking
- **newsletter_subscriptions** - Email subscribers

## Features in Detail

### Tool Management
- Submit new tools with detailed information
- Admin approval workflow
- Category-based organization
- Tag-based filtering
- Search functionality

### User System
- Email/password authentication
- Google OAuth integration
- User profiles and preferences
- Role-based access (user/admin)

### Monetization
- Stripe integration for payments
- Featured tool listings
- Sponsored content support
- Affiliate link tracking

### Analytics
- Tool view tracking
- Click analytics
- User engagement metrics
- Admin dashboard with insights

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Backend (Supabase)
1. Your Supabase project is already hosted
2. Configure authentication providers
3. Set up Row Level Security policies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email hello@nhancio.com or create an issue on GitHub.

---

Built with ❤️ for the AI community