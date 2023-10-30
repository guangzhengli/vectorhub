import {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

export const runtime = 'edge'

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    res.status(401).json({message: "Unauthorized"});
    return;
  }

  try {
    const indexes = await prisma?.index.findMany({
      where: {
        likes: {
          some: {
            userId: session?.user?.id as string,
          }
        }
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
      orderBy: {
        likesCount: 'desc',
      },
    });

    res.status(200).json(indexes);
  } catch (e) {
    res.status(500).json({message: (e as Error).message});
  }
}

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  const {indexId} = req.body;

  if (!session?.user?.id) {
    res.status(401).json({message: "Unauthorized"});
    return;
  }

  try {
    const createdData = await prisma?.like.create({
      data: {
        userId: session?.user?.id as string,
        indexId: indexId as string,
      }
    });

    await prisma?.index.update({
      where: {id: indexId},
      data: {likesCount: {increment: 1}},
    });

    res.status(200).json(createdData);
  } catch (e) {
    res.status(500).json({message: (e as Error).message});
  }
}

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  const {indexId} = req.body;

  if (!session?.user?.id) {
    res.status(401).json({message: "Unauthorized"});
    return;
  }
  try {
    await prisma?.like.delete({
      where: {
        userId_indexId: {
          userId: session?.user?.id as string,
          indexId: indexId as string,
        }
      }
    });

    await prisma?.index.update({
      where: {id: indexId},
      data: {likesCount: {decrement: 1}},
    });

    res.status(200).json({message: "unliked successfully"});
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
    case 'DELETE':
      return handleDelete(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;