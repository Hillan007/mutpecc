# Mutpecc

A comprehensive community wellness platform built with React, TypeScript, and Supabase. Mutpecc provides mood tracking, event management, community engagement, and professional counseling services.

## Features

- **Mood Check-ins**: Daily mood tracking and mental health insights
- **Dashboard**: Role-based dashboards for Members, Counselors, and Executives
- **Community**: Community links and engagement features
- **Events Management**: Create and manage community events
- **Activities**: Track and organize activities
- **Vlogs**: Share and manage video content
- **Counselor Services**: Book sessions and apply for professional counseling
- **Q&A Management**: Community question and answer system
- **User Management**: Administrative user control and management
- **Content Management**: Manage platform content
- **Booking System**: Session booking and calendar management

## Tech Stack

**Frontend:**
- React 18+ with TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- shadcn-ui (UI components)
- Vitest (testing)

**Backend:**
- Supabase (PostgreSQL database + auth)
- Edge Functions

**Development:**
- Node.js with Bun package manager
- ESLint for code quality
- PostCSS for CSS processing

## Getting Started

### Prerequisites

- Node.js 16+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- Bun or npm package manager
- Git

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd mutpecc

# Install dependencies using bun
bun install
# or with npm
npm install

# Start development server
bun run dev
# or with npm
npm run dev
```

The application will be available at `http://localhost:5173`.

### Development

```sh
# Run tests
bun run test

# Build for production
bun run build

# Preview production build
bun run preview

# Lint code
bun run lint
```

## Project Structure

```
src/
├── components/        # React components
│   ├── dashboard/    # Dashboard components (Member, Counselor, Executive)
│   └── ui/           # shadcn-ui component library
├── pages/            # Page components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── integrations/     # External service integrations (Supabase)
└── test/             # Test files

supabase/
├── migrations/       # Database migrations
└── functions/        # Edge functions
```

## Database

The project uses Supabase (PostgreSQL) for data storage. Database migrations are located in the `supabase/migrations/` directory.

## Environment Setup

Create a `.env.local` file in the root directory with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

[Add your license information here]

## Support

For issues and questions, please open an issue in the repository.
