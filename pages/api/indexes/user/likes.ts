import {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    res.status(401).json({message: "Unauthorized"});
    return;
  }

  const indexes = await prisma?.index.findMany({
    where: {
      likes: {
        some: {
          userId: session?.user?.id as string,
        }
      }
    },
    select: {
      id: true,
      name: true,
      description: true,
      tags: true,
    },
    orderBy: {
      likesCount: 'desc',
    },
  });

  res.status(200).json(indexes);
}

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  const {indexId} = req.body;

  if (!session?.user?.id) {
    res.status(401).json({message: "Unauthorized"});
    return;
  }

  const createdData = await prisma?.like.create({
    data: {
      userId: session?.user?.id as string,
      indexId: indexId as string,
    }
  });

  res.status(200).json(createdData);
}

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  const {indexId} = req.body;

  if (!session?.user?.id) {
    res.status(401).json({message: "Unauthorized"});
    return;
  }

  await prisma?.like.delete({
    where: {
      userId_indexId: {
        userId: session?.user?.id as string,
        indexId: indexId as string,
      }
    }
  });

  res.status(200).json({message: "unliked successfully"});
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