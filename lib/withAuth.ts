import jwt from "jsonwebtoken";

export function withAuth(
  handler: (req: Request, user: any) => Promise<Response>
) {
  return async (req: Request) => {
    const auth = req.headers.get("authorization");

    if (!auth || !auth.startsWith("Bearer ")) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const token = auth.replace("Bearer ", "");

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      );

      return handler(req, decoded);
    } catch (err) {
      return Response.json({ message: "invalid token" }, { status: 401 });
    }
  };
}
