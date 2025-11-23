# MockMate - AI Interview Coach

![MockMate Logo](https://raw.githubusercontent.com/HarshilModh/prepwise/main/public/mockmate-logo.png)

MockMate is a real-time AI voice interview platform designed to help developers practice and improve their technical interview skills. It uses advanced voice AI and large language models to simulate realistic interview scenarios, provide instant feedback, and track progress over time.

## Features

-   **Real-time Voice Interaction:** Engage in natural, bidirectional voice conversations with an AI interviewer, powered by Vapi.ai and Google Gemini, with sub-500ms latency.
-   **Dynamic Interview Generation:** Create custom interviews tailored to specific roles (e.g., Frontend Developer, Backend Developer) and tech stacks. The AI generates relevant technical questions based on your experience level.
-   **Automated Feedback & Scoring:** Receive granular performance scores (0-100) and actionable insights after each interview. The system analyzes transcripts using Gemini 1.5 Pro to evaluate your responses.
-   **Secure Dashboard:** Track your interview history, review past performance, and monitor your progress through a secure and responsive dashboard built with Next.js, Firebase Auth, and Firestore.
-   **Modern UI:** Enjoy a clean and intuitive user interface designed with Tailwind CSS and Shadcn UI.

## Technologies Used

-   **Frontend:** [Next.js 14](https://nextjs.org/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
-   **Backend:** Next.js Server Actions, [Firebase Auth](https://firebase.google.com/docs/auth), [Firebase Firestore](https://firebase.google.com/docs/firestore)
-   **AI & Voice:** [Vapi.ai](https://vapi.ai/) (Voice AI), [Google Gemini API](https://ai.google.dev/) (LLM)
-   **Validation:** [Zod](https://zod.dev/)

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn
-   A Firebase project with Authentication and Firestore enabled
-   A Vapi.ai account and API key
-   A Google Cloud project with the Gemini API enabled

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/HarshilModh/prepwise.git](https://github.com/HarshilModh/prepwise.git)
    cd prepwise
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root directory and add the following keys. You'll need to obtain these from your respective service providers.

    ```env
    # Firebase
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

    # Firebase Admin SDK (for server-side operations)
    FIREBASE_PROJECT_ID=your_firebase_project_id
    FIREBASE_CLIENT_EMAIL=your_firebase_client_email
    FIREBASE_PRIVATE_KEY="your_firebase_private_key" # Wrap in quotes, handle newlines correctly

    # Vapi.ai
    NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
    NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_vapi_workflow_id # ID of the assistant created via API

    # Google Gemini API
    GOOGLE_GENERATIVE_AI_API_KEY=your_google_gemini_api_key
    ```

4.  **Create the Vapi Assistant:**

    You need to create an assistant in Vapi that is linked to your workflow. You can do this using the Vapi API. Replace the placeholders with your actual values.

    ```bash
    curl -X POST [https://api.vapi.ai/assistant](https://api.vapi.ai/assistant) \
      -H "Authorization: Bearer YOUR_VAPI_PRIVATE_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Interview Generator",
        "model": {
          "provider": "vapi",
          "workflowId": "YOUR_VAPI_WORKFLOW_ID_FROM_DASHBOARD"
        },
        "voice": {
          "provider": "deepgram",
          "voiceId": "asteria"
        },
        "transcriber": {
          "provider": "deepgram",
          "model": "nova-2"
        }
      }'
    ```
    Copy the `id` from the response and use it as `NEXT_PUBLIC_VAPI_WORKFLOW_ID` in your `.env.local` file.

5.  **Set up Firestore Indexes:**

    The application requires composite indexes in Firestore for certain queries. When you first run the application and encounter an innovative query error in your console, click the provided link to automatically create the necessary indexes in the Firebase console.

### Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
