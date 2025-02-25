import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { matricula, password } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { matricula } })

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" })

    res.status(200).json({ token, user: { id: user.id, name: user.name, role: user.role } })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

