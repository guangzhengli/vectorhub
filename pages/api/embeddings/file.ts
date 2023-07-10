import type {NextApiRequest, NextApiResponse} from 'next'
import {getDocumentLoader} from "@/utils/langchain/documentLoader";
import {getSplitterDocument} from "@/utils/langchain/splitter";
import {NEXT_PUBLIC_CHAT_FILES_UPLOAD_PATH} from "@/utils/app/const";
import { getKeyConfiguration } from '@/utils/app/configuration';
import {getVectorStore} from "@/utils/vector";
import { PrismaClient } from '@prisma/client';

const folderPath = NEXT_PUBLIC_CHAT_FILES_UPLOAD_PATH;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("beginning embedding handler");
    const keyConfiguration = getKeyConfiguration(req);

    const { indexId, fileType } = req.body;
    const loader = getDocumentLoader(fileType, `${folderPath}/${indexId}.${fileType}`);
    const document = await loader.load();
    const splitDocuments = await getSplitterDocument(keyConfiguration, document);
    const vectorStore = await getVectorStore(keyConfiguration);
    try {
        const db = new PrismaClient();
        await vectorStore.addModels(
          await db.$transaction(
            splitDocuments.map((doc) => db.document.create({ data: { content: doc.pageContent, indexId: indexId }})))
        );
        res.status(200).json({ message: 'save supabase embedding successes' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: (e as Error).message });
    }
}

export default handler;