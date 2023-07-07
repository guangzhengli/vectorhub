import {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const user = await prisma?.user.findUnique({
        where: {
            id: session?.user?.id as string,
        },
        select: {
            likedIndexIds: true,
        },
    });

    const indexes = await prisma?.index.findMany({
        where: {
            id: {
                in: user?.likedIndexIds,
            }
        },
        select: {
            id: true,
            name: true,
            description: true,
            tags: true,
        },
        orderBy: {
            likes: 'desc',
        },
    });

    res.status(200).json(indexes);
}

const handlePut = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);
    const { likedIndexIds } = req.query;

    if (!session?.user?.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    if (!likedIndexIds || likedIndexIds.length === 0) {
        res.status(400).json({ message: "No index IDs provided" });
        return;
    }

    const updatedData = await prisma?.user.update({
        where: { id: session?.user?.id as string },
        data: {
            likedIndexIds: {
                set: likedIndexIds as string[],
            }
        }
    });

    res.status(200).json(updatedData);
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET':
            return handleGet(req, res);
        case 'POST':
            return handlePut(req, res);
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;