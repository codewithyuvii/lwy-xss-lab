import { NextResponse } from "next/server";

let testimonials = [
    {
        id: 1,
        name: "Elon M.",
        message: "This site changed my life! I doubled my Dogecoin in 12 hours. Definitely not a scam guys!!! 🚀🚀🚀",
        timestamp: new Date().toISOString()
    },
    {
        id: 2,
        name: "CryptoBro99",
        message: "Legit platform. Payouts are instant.",
        timestamp: new Date().toISOString()
    }
];

export async function GET() {
    return NextResponse.json({ feedbacks: [...testimonials].reverse() });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.name || !body.message) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const newFeedback = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            name: body.name,
            message: body.message,
            timestamp: new Date().toISOString()
        };

        testimonials.push(newFeedback);

        return NextResponse.json({ success: true, feedback: newFeedback });
    } catch (err) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
}
