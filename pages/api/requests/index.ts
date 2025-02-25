import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req)

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  if (req.method === "GET") {
    try {
      const requests = await prisma.request.findMany({
        where: session.user.role === "ADMIN" ? {} : { userId: session.user.id },
        include: { user: true, documents: true },
      })
      res.status(200).json(requests)
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" })
    }
  } else if (req.method === "POST") {
    if (session.user.role !== "STUDENT") {
      return res.status(403).json({ message: "Forbidden" })
    }

    const { type, reason } = req.body

    try {
      const request = await prisma.request.create({
        data: {
          userId: session.user.id,
          type,
          reason,
          status: "PENDING",
        },
      })
      res.status(201).json(request)
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}

