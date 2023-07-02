import {NextApiRequest, NextApiResponse} from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;

    const indexes = await prisma?.index.findMany({
        where: {
            authorId: id as string,
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