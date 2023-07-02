import {NextApiRequest, NextApiResponse} from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;

    const user = await prisma?.user.findUnique({
        where: {
            id: id as string,
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

export default handler;