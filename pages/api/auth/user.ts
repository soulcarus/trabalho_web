import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const session = await getSession(req)

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, role: true, matricula: true, curso: true, campus: true },
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json(user)
  } catch (error) {
    console.error("Error fetching user data:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

