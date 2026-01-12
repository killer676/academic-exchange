# 📚 Academic Exchange - University Textbook Marketplace

A modern web platform for Omani university students to buy and sell used textbooks. Built with Next.js, Tailwind CSS, and Firebase.

![Academic Exchange](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-10-orange?style=flat-square&logo=firebase)

## ✨ Features

- 🎓 **Verified Students Only** - Email verification required (.edu.om domains)
- 📱 **WhatsApp Integration** - Direct contact with sellers
- 🔍 **Smart Filtering** - Search by university, major, condition, and price
- 📸 **Photo Uploads** - See actual book conditions
- 🎨 **Modern UI** - Beautiful, responsive design with glassmorphism effects
- 🔐 **Secure** - Firebase Security Rules for data protection

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase account (free tier works)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd my-new-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication > Sign-in method > Google
   - Create a Firestore database
   - Create a Storage bucket

4. **Configure environment variables**
   ```bash
   # Copy the example file
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` with your Firebase credentials from Project Settings > General > Your apps

5. **Deploy Firebase Security Rules**
   
   Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init
   ```
   
   Deploy rules:
   ```bash
   firebase deploy --only firestore:rules
   firebase deploy --only storage:rules
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

```
my-new-app/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── page.tsx      # Landing page
│   │   ├── layout.tsx    # Root layout
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   ├── Navbar.tsx    # Navigation bar
│   │   └── Footer.tsx    # Footer
│   ├── lib/              # Utility functions
│   │   ├── firebase.ts   # Firebase config
│   │   └── constants.ts  # App constants
│   └── types/            # TypeScript types
│       └── index.ts      # Type definitions
├── public/               # Static assets
├── firestore.rules       # Firestore security rules
├── storage.rules         # Storage security rules
├── .env.example          # Environment variables template
├── tailwind.config.ts    # Tailwind configuration
└── next.config.js        # Next.js configuration
```

## 🔒 Security

This application implements several security measures:

- **Firebase Security Rules** for Firestore and Storage
- **Email domain validation** (.edu.om only)
- **Security headers** (HSTS, X-Frame-Options, CSP, etc.)
- **Input validation** and sanitization
- **Authenticated-only access** to marketplace

For a complete security analysis, see [`security_analysis.md`](./security_analysis.md)

⚠️ **IMPORTANT**: Never commit `.env.local` to version control!

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Firebase](https://firebase.google.com/)
  - Authentication (Google Sign-in)
  - Firestore Database
  - Storage (Image uploads)
- **Deployment**: [Vercel](https://vercel.com/) (recommended)

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables from `.env.local`
4. Deploy!

### Environment Variables for Production

Make sure to add these in your hosting platform:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

## 🎓 Supported Universities

- Sultan Qaboos University (SQU)
- German University of Technology in Oman (GUtech)
- University of Buraimi
- Dhofar University
- Nizwa University
- Sohar University
- Middle East College
- And more...

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🐛 Known Issues & Roadmap

- [ ] Add in-app messaging system
- [ ] Implement user ratings/reviews
- [ ] Add book request feature
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Admin dashboard

## 💬 Support

For issues and questions, please open an issue on GitHub or contact support.

---

Made with ❤️ for Omani Students
