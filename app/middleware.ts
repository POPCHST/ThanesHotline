import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  res.headers.set(
    "Access-Control-Allow-Origin",
    process.env.NEXT_PUBLIC_FRONTEND_URL || "*"
  );
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: res.headers,
    });
  }

  return res;
}

export const config = {
  matcher: "/api/:path*",
};

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//   const origin = req.headers.get("origin");

//   const allowedOrigin = "https://smsotp-hotline.vercel.app";

//   // 🔴 ตอบ OPTIONS (Preflight) โดยตรง
//   if (req.method === "OPTIONS") {
//     return new NextResponse(null, {
//       status: 204,
//       headers: {
//         "Access-Control-Allow-Origin": allowedOrigin,
//         "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
//         "Access-Control-Allow-Headers": "Content-Type, Authorization",
//       },
//     });
//   }

//   const res = NextResponse.next();

//   // 🔴 ใส่ CORS header ให้ response ปกติ
//   res.headers.set("Access-Control-Allow-Origin", allowedOrigin);
//   res.headers.set(
//     "Access-Control-Allow-Methods",
//     "GET,POST,PUT,DELETE,OPTIONS"
//   );
//   res.headers.set(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization"
//   );

//   return res;
// }

// export const config = {
//   matcher: "/api/:path*",
// };
