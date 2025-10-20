import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://138.197.19.114:7008/api/v1";

async function handleRequest(req: NextRequest, method: string, path: string[]) {

  const apiKey = req.headers.get("x-internal-key");
  if (apiKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const targetUrl = `${BACKEND_URL}/${path.join("/")}`;

  const body =
    method === "POST" || method === "PUT" || method === "PATCH"
      ? await req.text()
      : undefined;

  // ✅ Forward request
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

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleRequest(req, "GET", path);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleRequest(req, "POST", path);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleRequest(req, "PUT", path);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleRequest(req, "DELETE", path);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleRequest(req, "PATCH", path);
}
