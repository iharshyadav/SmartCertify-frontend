   # 🌐 SmartCertify Frontend

   <div align="center">

   ![SmartCertify](https://img.shields.io/badge/SmartCertify-Frontend-blue?style=for-the-badge)
   ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
   ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
   ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
   ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

   **Modern, Responsive Web Application for Certificate Management**

   </div>

   ---

   ## 🎨 What is SmartCertify Frontend?

   Welcome to the face of SmartCertify! Our frontend is a modern, responsive web application built with the latest technologies to provide an exceptional user experience. From stunning authentication pages to intuitive dashboards, every pixel is crafted with care to make certificate management a delightful experience.

   ### ✨ Why Our Frontend Stands Out

   - **🎯 User-Centric Design**: Intuitive interfaces designed with real users in mind
   - **📱 Fully Responsive**: Perfect experience across all devices and screen sizes
   - **🚀 Lightning Fast**: Built with Next.js 15 and Turbopack for optimal performance
   - **🎨 Beautiful UI**: Sleek design using Tailwind CSS and shadcn/ui components
   - **🔒 Secure by Default**: Advanced authentication with route protection
   - **♿ Accessible**: Built following WCAG guidelines for inclusivity
   - **🌙 Theme Support**: Dark/light mode with smooth transitions

   ---

   ## 🌈 Features That Matter

   ### 🔐 Authentication Excellence
   - **Stunning Sign-in/Sign-up Pages**: Beautiful, conversion-optimized auth flows
   - **Smart Form Validation**: Real-time validation with helpful error messages
   - **Social Login Ready**: Google OAuth integration (expandable to more providers)
   - **Account Security**: Password strength indicators and security notifications
   - **Remember Me**: Persistent sessions for user convenience

   ### 🎨 UI/UX Excellence
   - **Modern Design Language**: Clean, professional aesthetic
   - **Micro-Interactions**: Subtle animations that enhance user experience
   - **Loading States**: Beautiful loading indicators and skeleton screens
   - **Error Handling**: User-friendly error messages with recovery suggestions
   - **Responsive Grid**: Perfect layouts on mobile, tablet, and desktop

   ### 🛡️ Security & Performance
   - **Route Protection**: Automatic redirects for protected pages
   - **Token Management**: Secure JWT handling with automatic refresh
   - **Performance Optimized**: Code splitting and lazy loading
   - **SEO Friendly**: Server-side rendering with Next.js
   - **Type Safety**: Full TypeScript coverage for reliability

   ---

   ## 🚀 Quick Start Guide

   ### Prerequisites

   Make sure you have these installed:

   - **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
   - **pnpm** package manager - `npm install -g pnpm`

   ### 🔧 Installation & Setup

   1. **Clone and Navigate**
      ```bash
      git clone https://github.com/iharshyadav/SmartCertify-frontend
      ```

   2. **Install Dependencies**
      ```bash
      pnpm install
      ```

   3. **Environment Configuration**
      
      Create a `.env.local` file:
      ```env
      # API Configuration
      NEXT_PUBLIC_API_URL=your_api_here

      # Google OAuth (for social login)
      NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

      # App Configuration
      NEXT_PUBLIC_APP_NAME=SmartCertify
      NEXT_PUBLIC_APP_URL=http://localhost:3000

      # Development
      NODE_ENV=development
      ```

   4. **Start Development Server**
      ```bash
      pnpm run dev
      ```

      🎉 **Success!** Your frontend is now running at `http://localhost:3000`

   ### 🎯 First Steps After Setup

   1. Visit `http://localhost:3000` to see the homepage
   2. Navigate to `/signup` to create a test account
   3. Try the `/signin` page to test authentication
   4. Explore the responsive design on different screen sizes

   ---

   ## 🏗️ Project Architecture

   ```
   frontend/
   ├── app/                          # Next.js App Router
   │   ├── globals.css              # Global styles & Tailwind
   │   ├── layout.tsx               # Root layout with providers
   │   ├── page.tsx                 # Homepage
   │   ├── signin/                  # Authentication pages
   │   │   └── page.tsx            # Sign in page
   │   └── signup/                  # User registration
   │       └── page.tsx            # Sign up page
   ├── components/                   # Reusable UI components
   │   ├── ui/                      # shadcn/ui components
   │   └── auth/                    # Authentication components
   │       └── ProtectedRoute.tsx   # Route protection
   ├── lib/                         # Core logic & utilities
   │   ├── auth-api.ts             # API client for auth
   │   ├── auth-context.tsx        # Authentication context
   │   ├── auth-types.ts           # TypeScript types & schemas
   │   ├── auth-utils.ts           # Utility functions
   │   └── utils.ts                # General utilities
   ├── hooks/                       # Custom React hooks
   ├── middleware.ts               # Next.js middleware for routes
   ├── public/                     # Static assets
   ├── .env.local                  # Environment variables
   ├── next.config.ts              # Next.js configuration
   ├── tailwind.config.js          # Tailwind CSS configuration
   ├── components.json             # shadcn/ui configuration
   └── package.json               # Dependencies & scripts
   ```

   ---

   ## 🔐 Authentication System

   ### 🎯 Complete Auth Flow

   Our authentication system provides a seamless user experience:

   1. **Registration Flow**
      ```
      User visits /signup → Selects user type → Fills form → 
      Validates input → Creates account → Auto sign-in → Redirects to dashboard
      ```

   2. **Login Flow**
      ```
      User visits /signin → Enters credentials → Validates → 
      Generates tokens → Stores securely → Redirects to intended page
      ```

   3. **Route Protection**
      ```
      User accesses protected route → Middleware checks auth → 
      Redirects to signin if needed → Restores intended destination
      ```

   ### 🛠️ Auth Features

   #### Form Validation
   - **Real-time Validation**: Instant feedback as users type
   - **Custom Error Messages**: Clear, actionable error descriptions
   - **Password Strength**: Visual indicators for password security
   - **Email Format**: Smart email validation with suggestions

   #### Security Features
   - **Automatic Token Refresh**: Seamless session management
   - **Secure Storage**: Tokens stored in localStorage with encryption consideration
   - **Route Protection**: Both client and server-side protection
   - **Session Persistence**: Remember user sessions across browser restarts

   #### User Experience
   - **Loading States**: Beautiful spinners during authentication
   - **Success Feedback**: Confirmation messages for successful actions
   - **Error Recovery**: Helpful suggestions when things go wrong
   - **Responsive Design**: Perfect on all devices

   ---

   ## 🛠️ Development Guide

   ### Available Scripts

   ```bash
   # Development
   pnpm dev              # Start development server (Turbopack)
   pnpm build            # Build for production
   pnpm start            # Start production server
   pnpm lint             # Run ESLint
   pnpm type-check       # TypeScript type checking

   # UI Development
   pnpm ui:add           # Add new shadcn/ui component
   pnpm ui:update        # Update existing components

   # Utilities
   pnpm clean            # Clean build artifacts
   pnpm analyze          # Analyze bundle size
   ```

   ### 🎨 Adding New Pages

   1. **Create Page Component**
      ```typescript
      // app/new-page/page.tsx
      export default function NewPage() {
      return (
         <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold">New Page</h1>
            {/* Your content */}
         </div>
      )
      }
      ```

   2. **Add Route Protection** (if needed)
      ```typescript
      import ProtectedRoute from '@/components/auth/ProtectedRoute'

      export default function NewPage() {
      return (
         <ProtectedRoute>
            {/* Protected content */}
         </ProtectedRoute>
      )
      }
      ```

   ---

   ## 🔒 Security Implementation

   ### 🛡️ Client-Side Security

   #### Route Protection
   ```typescript
   // Middleware protection at route level
   export function middleware(request: NextRequest) {
   const token = request.cookies.get('auth-token')
   
   if (isProtectedRoute(request.nextUrl.pathname) && !token) {
      return NextResponse.redirect(new URL('/signin', request.url))
   }
   }
   ```

   #### Component-Level Protection
   ```typescript
   // Protect components based on auth state
   function Dashboard() {
   const { isAuthenticated, isLoading } = useAuthState()
   
   if (isLoading) return <LoadingSpinner />
   if (!isAuthenticated) return <SignInPrompt />
   
   return <DashboardContent />
   }
   ```

   ---

   ## 🚀 Deployment Guide

   ### 🌍 Vercel Deployment (Recommended)

   1. **Connect Repository**
      ```bash
      # Install Vercel CLI
      npm i -g vercel
      
      # Deploy to Vercel
      vercel --prod
      ```

   2. **Environment Variables**
      ```
      NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
      NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
      NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
      ```

   ### 🔧 Production Checklist

   - [ ] Set up proper environment variables
   - [ ] Configure custom domain
   - [ ] Set up SSL certificates
   - [ ] Configure CDN for static assets
   - [ ] Set up monitoring and analytics
   - [ ] Configure error tracking (Sentry)
   - [ ] Set up performance monitoring
   - [ ] Configure backup strategies

   ---

   ## 🔧 Troubleshooting

   ### Common Issues & Solutions

   #### **Build Errors**
   ```bash
   # Clear Next.js cache
   rm -rf .next

   # Clear node_modules and reinstall
   rm -rf node_modules
   pnpm install

   # Type check
   pnpm type-check
   ```

   #### **Authentication Issues**
   ```typescript
   // Debug authentication state
   console.log('Auth State:', {
   isAuthenticated: useAuthState().isAuthenticated,
   token: tokenManager.getToken(),
   user: userManager.getUser()
   })
   ```

   #### **API Connection Issues**
   ```typescript
   // Check API URL configuration
   console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)

   // Test API connectivity
   fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
   .then(res => console.log('API Status:', res.status))
   .catch(err => console.error('API Error:', err))
   ```

   ---

   ## 🤝 Contributing

   ### 🌟 How to Contribute

   We welcome contributions! Here's how to get started:

   1. **Fork the Repository**
      ```bash
      git clone https://github.com/iharshyadav/SmartCertify-frontend
      ```

   2. **Create Feature Branch**
      ```bash
      git checkout -b feature/amazing-new-feature
      ```

   3. **Make Your Changes**
      - Follow our coding standards
      - Add tests for new features
      - Update documentation

   4. **Test Your Changes**
      ```bash
      pnpm test
      pnpm lint
      pnpm type-check
      ```

   5. **Submit Pull Request**
      - Clear description of changes
      - Screenshots for UI changes
      - Test results included

   ---

   <div align="center">

   **Built by Harsh ❤️**

   [![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=flat-square&logo=next.js)](https://nextjs.org/)
   [![Styled with Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
   [![Powered by TypeScript](https://img.shields.io/badge/Powered%20by-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

   </div>
