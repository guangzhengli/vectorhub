import {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    res.status(401).json({message: "Unauthorized"});
    return;
  }

  try {
    const indexes = await prisma?.index.findMany({
      where: {
        authorId: session?.user?.id as string,
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
        updatedAt: 'desc',
      },
    });

    res.status(200).json(indexes);
  } catch (e) {
    res.status(500).json({message: (e as Error).message});
  }
}

export default handler;