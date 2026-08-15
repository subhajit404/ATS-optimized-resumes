const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

function getAI() {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY
    if (!apiKey) {
        throw new Error("GOOGLE_GENAI_API_KEY is not set in .env file. Please add your Gemini API key.")
    }
    return new GoogleGenAI({ apiKey })
}

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).min(7).max(7).describe("A 7-day preparation plan for the candidate. MUST have exactly 7 entries (day 1 through day 7)"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

function safeJsonParse(text) {
    if (!text) return {}
    try {
        return JSON.parse(text)
    } catch (e) {
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
        if (jsonMatch && jsonMatch[1]) {
            return JSON.parse(jsonMatch[1])
        }
        throw e
    }
}

function getMockInterviewReport({ resume, selfDescription, jobDescription }) {
    const jobSnippet = jobDescription ? jobDescription.split("\n")[0].substring(0, 50) : "Software Engineer"
    return {
        title: jobSnippet || "Target Role Interview Plan",
        matchScore: 85,
        technicalQuestions: [
            {
                question: "Explain the architecture of a full-stack web application and how you manage state and asynchronous operations.",
                intention: "To assess understanding of client-server communication, component state lifecycle, and error handling.",
                answer: "Discuss frontend state management (Context/Redux), REST API design, database schemas, caching, and async/await error handling."
            },
            {
                question: "How do you implement secure user authentication and authorization in a production app?",
                intention: "To evaluate knowledge of JWT tokens, HTTP-only cookies, password hashing (bcrypt), and role-based access control.",
                answer: "Explain using bcrypt with salt rounds for passwords, issuing signed JWT tokens stored in HTTP-only cookies, token blacklisting upon logout, and auth middlewares."
            },
            {
                question: "Describe your strategy for database schema modeling and query optimization in MongoDB/SQL.",
                intention: "To test database indexing, relationships, and performance optimization skills.",
                answer: "Cover indexing on high-frequency query fields, compound indexes, pagination, avoiding N+1 queries, and aggregation pipelines."
            }
        ],
        behavioralQuestions: [
            {
                question: "Tell me about a time you encountered an unexpected bug in production and how you resolved it under pressure.",
                intention: "To gauge debugging methodology, composure under pressure, and post-mortem best practices.",
                answer: "Use the STAR method: describe the critical bug, immediate triage/rollback steps, root cause analysis, fix implementation, and adding tests to prevent recurrence."
            },
            {
                question: "How do you manage conflicting priorities and tight sprint deadlines?",
                intention: "To evaluate stakeholder communication, task prioritization, and agile delivery.",
                answer: "Explain breaking work into MVPs, communicating trade-offs with product managers early, and focusing on high-impact deliverables."
            }
        ],
        skillGaps: [
            {
                skill: "Advanced System Design & Scalability Patterns",
                severity: "medium"
            },
            {
                skill: "Cloud Infrastructure & CI/CD Pipelines (Docker/AWS)",
                severity: "low"
            },
            {
                skill: "Automated End-to-End Testing (Jest / Cypress)",
                severity: "medium"
            }
        ],
        preparationPlan: [
            {
                day: 1,
                focus: "Core Language & Full-Stack Fundamentals",
                tasks: [
                    "Review JavaScript/Node.js event loop, asynchronous concurrency, and prototype chain.",
                    "Deep-dive into RESTful API architectural constraints and status codes.",
                    "Revise ES6+ features: destructuring, spread, optional chaining, and Promises."
                ]
            },
            {
                day: 2,
                focus: "Data Structures & Algorithms",
                tasks: [
                    "Practice problem solving with HashMaps, Two-Pointers, and Sliding Window.",
                    "Solve 5 LeetCode Medium problems on Arrays and Strings.",
                    "Review Big-O notation and space/time complexity analysis."
                ]
            },
            {
                day: 3,
                focus: "Database Design & Optimization",
                tasks: [
                    "Review MongoDB aggregation pipelines and indexing strategies.",
                    "Study query execution plans and compound index design.",
                    "Practice schema modeling for real-world use cases (e-commerce, social media)."
                ]
            },
            {
                day: 4,
                focus: "System Design & Scalability",
                tasks: [
                    "Design a scalable URL shortener or real-time chat application.",
                    "Study load balancing, caching (Redis), and CDN strategies.",
                    "Review microservices vs monolithic architecture trade-offs."
                ]
            },
            {
                day: 5,
                focus: "Security, Auth & API Best Practices",
                tasks: [
                    "Deep-dive into JWT lifecycle, refresh tokens, and HTTP-only cookie security.",
                    "Study OWASP Top 10 vulnerabilities and mitigation strategies.",
                    "Review rate limiting, CORS configuration, and input validation best practices."
                ]
            },
            {
                day: 6,
                focus: "Behavioral Interview & Soft Skills",
                tasks: [
                    "Prepare 5 STAR behavioral stories covering leadership, conflict, failure, and teamwork.",
                    "Practice explaining technical decisions in plain language to non-technical stakeholders.",
                    "Research the company's culture, products, and recent engineering blog posts."
                ]
            },
            {
                day: 7,
                focus: "Mock Interview & Final Review",
                tasks: [
                    "Do a full timed mock technical interview covering DS&A and system design.",
                    "Review all notes and key concepts from Days 1–6.",
                    "Prepare 3 thoughtful questions to ask your interviewers.",
                    "Rest well and set up your interview environment (camera, audio, stable connection)."
                ]
            }
        ]
    }
}

function getMockResumeHtml({ resume, selfDescription, jobDescription }) {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #222; padding: 24px; max-width: 800px; margin: 0 auto; }
    h1 { color: #1e3a8a; margin-bottom: 4px; font-size: 24px; }
    h2 { color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; margin-top: 18px; font-size: 16px; text-transform: uppercase; }
    .contact { color: #64748b; font-size: 13px; margin-bottom: 16px; }
    .section { margin-bottom: 12px; }
    ul { margin: 4px 0 10px 20px; }
    li { margin-bottom: 4px; font-size: 13px; }
    p { font-size: 13px; margin: 4px 0; }
</style>
</head>
<body>
    <h1>Target Candidate Resume</h1>
    <div class="contact">developer@example.com | (555) 123-4567 | Portfolio & LinkedIn Profile</div>
    
    <h2>Professional Summary</h2>
    <div class="section">
        <p>${selfDescription || "Dedicated and versatile Full Stack Software Engineer with expertise in building robust, performant web applications. Proven ability in rapid prototyping, clean architecture, and delivering scalable solutions."}</p>
    </div>

    <h2>Technical Skills</h2>
    <div class="section">
        <ul>
            <li><strong>Frontend:</strong> React, JavaScript (ES6+), HTML5, CSS3/SCSS, Responsive Design</li>
            <li><strong>Backend:</strong> Node.js, Express.js, REST APIs, Authentication (JWT/bcrypt)</li>
            <li><strong>Databases:</strong> MongoDB, Mongoose, PostgreSQL</li>
            <li><strong>Developer Tools:</strong> Git, GitHub, Vite, Postman, npm</li>
        </ul>
    </div>

    <h2>Tailored Job Alignment</h2>
    <div class="section">
        <p>Targeting requirements for: ${jobDescription ? jobDescription.substring(0, 180) + '...' : 'Software Development Position'}</p>
    </div>
</body>
</html>`
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY
    if (!apiKey) {
        console.log("ℹ️ No GOOGLE_GENAI_API_KEY found in .env. Using mock generation fallback.")
        return getMockInterviewReport({ resume, selfDescription, jobDescription })
    }

    const ai = getAI()

    const prompt = `Generate a comprehensive interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        IMPORTANT: The preparationPlan MUST contain exactly 7 days (day 1 through day 7). Each day should have a clear focus and at least 3 specific, actionable tasks tailored to the candidate's profile and the job requirements. Do not generate fewer than 7 days.
`

    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash"

    const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    return safeJsonParse(response.text)
}



async function generatePdfFromHtml(htmlContent) {
    let puppeteer
    try {
        puppeteer = require("puppeteer")
    } catch (e) {
        throw new Error("Puppeteer is not available in this environment for PDF generation.")
    }
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    })
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY
    if (!apiKey) {
        const mockHtml = getMockResumeHtml({ resume, selfDescription, jobDescription })
        return await generatePdfFromHtml(mockHtml)
    }

    const ai = getAI()

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash"

    const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = safeJsonParse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }