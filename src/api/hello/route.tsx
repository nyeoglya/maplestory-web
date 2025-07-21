import { NextResponse } from 'next/server';

export async function GET() {
  console.log('서버에서 GET 요청을 받았습니다!');
  return NextResponse.json({ message: 'Hello from Server!' });
}
