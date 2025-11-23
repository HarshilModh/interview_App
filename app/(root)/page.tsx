import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId, getLatestInterviews, getInterviewsTakenByUser } from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();

  // Interviews user created
  const createdInterviews = (user ? await getInterviewsByUserId(user.id) : []) || [];
  // Interviews user has taken (has feedback) even if created by others
  const takenInterviews = (user ? await getInterviewsTakenByUser(user.id) : []) || [];

  // Merge & de-duplicate by id
  const userInterviewsMap = new Map<string, Interview>();
  for (const intv of [...createdInterviews, ...takenInterviews]) {
    if (intv) userInterviewsMap.set(intv.id, intv);
  }
  const userInterviews = Array.from(userInterviewsMap.values());
  const allInterview = await getLatestInterviews({ userId: user?.id || "" });

  const hasPastInterviews = (userInterviews?.length || 0) > 0;
  const hasUpcomingInterviews = (allInterview?.length || 0) > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice real interview questions & get instant feedback
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      {user && (
        <section className="flex flex-col gap-6 mt-8">
          <h2>Your Interviews</h2>
          <div className="interviews-section">
            {hasPastInterviews ? (
              userInterviews?.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  userId={user.id}
                  id={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                />
              ))
            ) : (
              <p>You haven&apos;t taken any interviews yet</p>
            )}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-6 mt-8">
        <h2>Take Interviews</h2>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                id={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;