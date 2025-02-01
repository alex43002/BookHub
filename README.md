# **BookTracker**

A modern web application designed for avid readers to track their reading progress, set goals, and connect with like-minded individuals.

![Hero Page](./hero_page.png?raw=true)

---

## **Features**

- 📚 **Track Your Books**: Keep an organized record of books you've read, are currently reading, or plan to read.  
- 🎯 **Reading Goals**: Set and monitor your progress toward personalized reading goals.  
- 📊 **Analytics Dashboard**: Gain insights into your reading habits with detailed visualizations.  
- 👥 **Social Connectivity**: Engage with other readers and share your book lists.  
- 📱 **Responsive Design**: Fully optimized for mobile and desktop devices.  
- 🌙 **Dark Mode**: A beautiful dark theme for reading enthusiasts.  

---

## **Tech Stack**

- **Framework**: Next.js 13 (App Router)  
- **Authentication**: NextAuth.js  
- **Database**: MongoDB  
- **Styling**: Tailwind CSS  
- **UI Components**: ShadCN/UI  
- **API**: tRPC  
- **Charts**: Recharts  
- **Testing**: Jest + React Testing Library  

---

## **Getting Started**

### **1. Clone the Repository**
```bash
git clone https://github.com/alex43002/BookHub.git
cd booktracker
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Configure Environment Variables**
Create a `.env` file in the root directory and add the following:
```env
DATABASE_URL="mongodb://localhost:27017/booktracker"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Optional: OAuth providers for authentication
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
GOOGLE_ID="your-google-client-id"
GOOGLE_SECRET="your-google-client-secret"
```

### **4. Start the Development Server**
```bash
npm run dev
```

Visit the application at `http://localhost:3000`.

---

## **Project Structure**

```
├── app/                 # Application pages and API routes
│   ├── api/             # API endpoints
│   ├── auth/            # Authentication pages
│   └── ...              # Other routes
├── components/          # Reusable React components
│   ├── books/           # Book-related components
│   ├── ui/              # Shared UI components
│   └── ...              # Other components
├── lib/                 # Utilities and shared code
│   ├── db/              # Database operations
│   ├── trpc/            # tRPC client setup
│   └── utils/           # General utility functions
├── hooks/               # Custom React hooks
├── server/              # Server-side logic
│   └── api/             # tRPC routers
└── types/               # TypeScript type definitions
```

---

## **Testing**

### **Run All Tests**
```bash
npm test
```

### **Run Tests in Watch Mode**
```bash
npm run test:watch
```

---

## **Deployment**

1. Set up a MongoDB Atlas database or use a local MongoDB instance.
2. Configure your environment variables for production.
3. Deploy the app to a hosting platform like [Vercel](https://vercel.com/).

---

## **Contributing**

Contributions are welcome! Follow these steps to contribute:  

1. **Fork the Repository**: Create your own copy of the repository.  
2. **Create a New Branch**: Work on a new feature or bug fix.  
3. **Make Your Changes**: Commit your changes with clear messages.  
4. **Submit a Pull Request**: Open a pull request to merge your changes into the main repository.

---

## **License**

This project is licensed under the [MIT License](LICENSE).  
