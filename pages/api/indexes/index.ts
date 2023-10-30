import {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

export const runtime = 'edge'

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  const {page} = req.query;
  const pageSize = 20;
  const skip = page ? (Number(page) - 1) * pageSize : 0;

  try {
    const indexes = await prisma?.index.findMany({
      where: {
        published: true,
      },
      include: {
        likes: {
          where: {
            userId: session?.user?.id as string,
          }
        },
        author: {
          select: {
            name: true,
            image: true,
          }
        }
      },
      orderBy: [
        {
          likesCount: 'desc',
        },
        {
          createdAt: 'desc',
        }
      ],
      skip,
      take: pageSize,
    });

    res.status(200).json(indexes);
  } catch (e) {
    res.status(500).json({message: (e as Error).message});
  }
}

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const {id, name, description, prompt, tags, questions, published, likesCount} = req.body;
  const session = await getServerSession(req, res, authOptions);

  try {
    const createdIndex = await prisma?.index.create({
      data: {
        id: id,
        name: name,
        description: description,
        prompt: prompt,
        tags: tags,
        questions: questions,
        published: published,
        likesCount: likesCount,
        authorId: session?.user?.id
      }
    })
    res.status(200).json(createdIndex);
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