import {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const indexes = await prisma?.index.findMany({
        where: {
            authorId: session?.user?.id as string,
        },
        select: {
            id: true,
            name: true,
            description: true,
            tags: true,
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });

    res.status(200).json(indexes);
}

export default handler;