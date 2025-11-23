import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

export const mappings = {
  // ... keep your existing mappings ...
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  // ... (rest of your mappings)
};

// ... (keep your interviewer constant as is) ...
export const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage: "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "deepgram",
    voiceId: "asteria",
  },
  model: {
    provider: "google",
    model: "gemini-2.0-flash",
    messages: [
      {
        role: "system",
        content: `You are a professional job interviewer.

        INSTRUCTIONS:
        1. You have a list of questions to ask:
        {{questions}}

        2. Ask ONE question at a time.
        3. Wait for the user to respond.
        4. After they respond, briefly acknowledge their answer (e.g., "Good point" or "Understood") and then move to the next question.
        5. Do not lecture the user or give long explanations.
        6. Once all questions are done, say "That concludes the interview. Thank you!" and end the call.`,
      },
    ],
  },
};

// --- FIX IS HERE ---
export const feedbackSchema = z.object({
  totalScore: z.number(),
  // CHANGED: z.tuple -> z.array to satisfy Gemini API requirements
  categoryScores: z.array(
    z.object({
      name: z.string(),
      score: z.number(),
      comment: z.string(),
    })
  ),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];

export const dummyInterviews: Interview[] = [
    {
        id: "1",
        userId: "user1",
        role: "Frontend Developer",
        type: "Technical",
        techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
        level: "Junior",
        questions: ["What is React?"],
        finalized: false,
        createdAt: "2024-03-15T10:00:00Z",
    },
    {
        id: "2",
        userId: "user1",
        role: "Full Stack Developer",
        type: "Mixed",
        techstack: ["Node.js", "Express", "MongoDB", "React"],
        level: "Senior",
        questions: ["What is Node.js?"],
        finalized: false,
        createdAt: "2024-03-14T15:30:00Z",
    },
];