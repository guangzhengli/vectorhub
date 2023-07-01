import {NextApiRequest, NextApiResponse} from "next";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { page } = req.query;
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
        orderBy: {
            likes: 'desc',
        },
        skip,
        take: pageSize,
    });

    res.status(200).json(indexes);
}