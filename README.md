## Getting Started

Fork the repository (For first time)

```bash
git clone https://github.com/ArnabBCA/ChatGPT.git
```

Install dependencies:

```bash
npm install
```

Create a new `.env.local` file in the root folder Add add the following:

```bash
GEMINI_API_KEY=(YOUR KEY)

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=(YOUR KEY)
CLERK_SECRET_KEY=(YOUR KEY)

MONGODB_URI=(YOUR KEY)

UPLOADCARE_SECRET_KEY=(YOUR KEY)
NEXT_PUBLIC_UPLOADCARE_PUB_KEY=(YOUR KEY)

MEM0_API_KEY=(YOUR KEY)

NEXT_PUBLIC_MAX_TOKEN_CONTEXT_WINDOW=10000 #ANY VALUE DEFAULT is 10000

NEXT_PUBLIC_ENABLE_MAX_TOKEN_CONTEXT_WINDOW=false #DEFAULT is false
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🌟 Features

✅ **Integrated Vercel AI SDK:**<br>
✅ **Gemini AI**<br>
✅ **Added memory using mem0.ai**<br>
✅ **Max Token Contex Window Handling**<br>
✅ **MongoDB for message Storage**<br>
✅ **Supports file and image uploads to the AI**<br>
✅ **Message History and Message persistence**<br>
✅ **Clerk Authentication**<br>
✅ **Uploadcare for file uploading and storage**<br>
✅ **Edit Messages and Regeneration**<br>
✅ **ChatGPT like UI and Animations**<br>
✅ **Delete Chat**<br>
