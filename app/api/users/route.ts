import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const filePath = path.join(process.cwd(), "data", "username.json");

export async function GET() {
  const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return NextResponse.json(users, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: "Username and password required" }, { status: 400 });
    }

    const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (users.some((user: any) => user.username === username)) {
      return NextResponse.json({ message: "Username already exists" }, { status: 400 });
    }

    const newUser = { id: users.length + 1, username, password };

    users.push(newUser);
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating file" }, { status: 500 });
  }
}
