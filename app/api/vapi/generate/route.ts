import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export async function GET() {
    return Response.json({success: true, data: "Thank you!"}, {status: 200})
}

// POST - responses for getting the questions generated from the gemini and saving that in new interview
export async function POST(request: Request) {
    const { type, role, level, techstack, amount, userid} = await request.json();
    try {
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            return Response.json(
                {
                    success: false,
                    error:
                        "Missing GOOGLE_GENERATIVE_AI_API_KEY. Add it to .env.local and restart the dev server.",
                },
                { status: 500 }
            );
        }

        if (!userid || typeof userid !== "string") {
            return Response.json(
                { success: false, error: "Missing required field: userid" },
                { status: 400 }
            );
        }

        const {text: questions} = await generateText({
            model : google("gemini-2.5-flash"),
            // Avoid multi-attempt retries that just slow down quota/rate-limit failures.
            maxRetries: 0,
            prompt: `Prepare questions for a job interview.
                        The job role is ${role}.
                        The job experience level is ${level}.
                        The tech stack used in the job is: ${techstack}.
                        The focus between behavioural and technical questions should lean towards: ${type}.
                        The amount of questions required is: ${amount}.
                        Please return only the questions, without any additional text.
                        The questions are going to be read by a voice assistant so do not use "/" or "*" or any 
                        other special characters which might break the voice assistant.
                        Return the questions formatted like this:
                        ["Question 1", "Question 2", "Question 3"]
                        Thank you! <3`,
        });

        let parsedQuestions: unknown;
        try {
            parsedQuestions = JSON.parse(questions);
        } catch {
            return Response.json(
                {
                    success: false,
                    error:
                        "Model returned invalid JSON. Try again or adjust the prompt to return strict JSON only.",
                },
                { status: 502 }
            );
        }

        const interview = {
            role, type, level, 
            techstack:techstack.split(","), 
            questions: parsedQuestions,
            userId: userid,
            finalized: true, 
            coverImage : getRandomInterviewCover(),
            createdAt: new Date().toISOString()
        }
        await db.collection("interviews").add(interview)
        return Response.json({
            success: true,
        }, {
            status: 200
        })
    }catch(error){
        const e = error as any;
        const statusCode: number | undefined =
            typeof e?.statusCode === "number"
                ? e.statusCode
                : typeof e?.lastError?.statusCode === "number"
                    ? e.lastError.statusCode
                    : undefined;

        if (statusCode === 429) {
            return Response.json(
                {
                    success: false,
                    error:
                        "Gemini API quota/rate limit exceeded. Check your plan/billing or wait and retry.",
                },
                { status: 429 }
            );
        }

        console.log(error);
        return Response.json(
            { success: false, error: "Failed to generate questions" },
            { status: 500 }
        )
    }   
}

