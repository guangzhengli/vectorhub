import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const {page} = req.query;
  const pageSize = 20;
  const skip = page ? (Number(page) - 1) * pageSize : 0;

  const indexes = await prisma?.index.findMany({
    where: {
      published: true,
    },
    select: {
      id: true,
      name: true,
      description: true,
      author: {
        select: {
          name: true,
          image: true,
        }
      },
      tags: true,
    },
    orderBy: [
      {
        likes: 'desc',
      },
      {
        createdAt: 'desc',
      }
    ],
    skip,
    take: pageSize,
  });

  res.status(200).json(indexes);
}

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const {id, name, description, prompt, tags, questions, published, likes} = req.body;
  const session = await getServerSession(req, res, authOptions);

  try {
    const result = await prisma?.index.create({
      data: {
        id: id,
        name: name,
        description: description,
        prompt: prompt,
        tags: tags,
        questions: questions,
        published: published,
        likes: likes,
        authorId: session?.user?.id
      }
    })
    res.status(200)
  } catch (e) {
    res.status(500).json({message: (e as Error).message});
  }

}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;