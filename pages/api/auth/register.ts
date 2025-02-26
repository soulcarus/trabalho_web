import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { matricula, email, password, name, campus, curso } = req.body

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            matricula,
          },
          { email },
        ],
      },
    })

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        matricula,
        email,
        password: hashedPassword,
        name,
        campus,
        curso,
        role: "STUDENT",
      },
    })

    res
      .status(201)
      .json({ message: "User created successfully", user: { id: user.id, name: user.name, role: user.role } })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Something went wrong" })
  }
}

