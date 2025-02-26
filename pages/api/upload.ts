import type { NextApiRequest, NextApiResponse } from "next"
import multer from "multer"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"
import type { Express } from "express"

const upload = multer({ dest: "uploads/" })

const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" })
  }

  console.log("Received request headers:", req.headers)

  const session = await getSession(req)
  if (!session) {
    console.log("Session is null, unauthorized access attempt")
    return res.status(401).json({ message: "Não autorizado" })
  }

  try {
    await runMiddleware(req, res, upload.array("documents"))

    const { tipoAuxilio, motivo } = req.body
    const files = (req as any).files as Express.Multer.File[]

    console.log("Creating request for user:", session.user.matricula)

    const request = await prisma.request.create({
      data: {
        userId: session.user.id,
        type: tipoAuxilio,
        reason: motivo,
        documents: {
          create: files.map((file) => ({
            filename: file.originalname,
            path: file.path,
          })),
        },
      },
      include: {
        documents: true,
      },
    })

    console.log("Request created successfully:", request.id)

    res.status(200).json({ message: "Solicitação criada com sucesso", request })
  } catch (error) {
    console.error("Erro ao processar upload:", error)
    res.status(500).json({ message: "Erro ao processar solicitação" })
  }
}

