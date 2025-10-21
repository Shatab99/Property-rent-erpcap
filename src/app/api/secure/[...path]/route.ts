import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://138.197.19.114:7008/api/v1";
// const BACKEND_URL = "http://localhost:7008/api/v1";

async function handleRequest(req: NextRequest, method: string, path: string[]) {
  const apiKey = req.headers.get("x-internal-key");

  // ✅ Internal key validation
  if (apiKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Build full target URL (include query params)
  const searchParams = req.nextUrl.search; // example: ?limit=12&page=1
  const targetUrl = `${BACKEND_URL}/${path.join("/")}${searchParams}`;

  // ✅ Get request body if needed
  const body =
    method === "POST" || method === "PUT" || method === "PATCH"
      ? await req.text()
      : undefined;

  // ✅ Forward the request to backend
  const res = await fetch(targetUrl, {
    method,
    headers: {
      Authorization: req.headers.get("authorization") || "",
      "Content-Type": req.headers.get("content-type") || "application/json",
    },
    body,
  });

  const data = await res.text();
  return new NextResponse(data, { status: res.status });
}

// ✅ Handle all methods (with queries preserved)
export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, "GET", (await params).path);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, "POST", (await params).path);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, "PUT", (await params).path);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, "DELETE", (await params).path);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, "PATCH", (await params).path);
}
