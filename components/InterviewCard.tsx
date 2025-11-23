import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn, getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  id, // FIX: Destructure 'interviewId' to match the props passed from Home
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  // 1. Fetch Feedback if it exists
  const feedback =
    userId && id
      ? await getFeedbackByInterviewId({
          interviewId: id,
          userId,
        })
      : null;

  // 2. Normalize the type label (e.g. "mixed" -> "Mixed")
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  // 3. Dynamic Badge Color
  const badgeColor =
    {
      Behavioral: "bg-light-400",
      Mixed: "bg-light-600",
      Technical: "bg-light-800",
    }[normalizedType] || "bg-light-600";

  // 4. Format Date
  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96 group">
      <div className="card-interview">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div>
          {/* Type Badge */}
          <div
            className={cn(
              "absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-xl backdrop-blur-md border-l border-b border-white/5",
              badgeColor
            )}
          >
            <p className="badge-text text-white">{normalizedType}</p>
          </div>

          {/* Cover Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary-200/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Image
              src={getRandomInterviewCover()}
              alt="cover-image"
              width={90}
              height={90}
              className="rounded-full object-cover size-[90px] relative z-10 border-2 border-white/10 group-hover:border-primary-200/50 transition-colors"
            />
          </div>

          {/* Interview Role */}
          <h3 className="mt-6 capitalize text-xl font-bold text-white group-hover:text-primary-100 transition-colors">{role} Interview</h3>

          {/* Date & Score */}
          <div className="flex flex-row gap-6 mt-4">
            <div className="flex flex-row gap-2 items-center">
              <Image
                src="/calendar.svg"
                width={20}
                height={20}
                alt="calendar"
                className="opacity-70"
              />
              <p className="text-light-400 text-sm font-medium">{formattedDate}</p>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Image src="/star.svg" width={20} height={20} alt="star" className="opacity-70" />
              <p className="text-light-400 text-sm font-medium">{feedback?.totalScore || "---"}/100</p>
            </div>
          </div>

          {/* Feedback or Placeholder Text */}
          <p className="line-clamp-2 mt-6 text-light-400 text-sm leading-relaxed">
            {feedback?.finalAssessment ||
              "You haven't taken this interview yet. Take it now to improve your skills."}
          </p>
        </div>

        <div className="flex flex-row justify-between items-center mt-6 pt-6 border-t border-white/5">
          <DisplayTechIcons techStack={techstack} />

          <Button className="btn-primary !h-10 !px-6 !text-sm">
            <Link
              href={
                feedback
                  ? `/interview/${id}/feedback`
                  : `/interview/${id}`
              }
            >
              {feedback ? "Check Feedback" : "Start Now"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;