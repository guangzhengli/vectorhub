import {NextApiRequest, NextApiResponse} from "next";
import {getKeyConfiguration} from "@/utils/app/configuration";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import {getSplitterDocument} from "@/utils/langchain/splitter";
import {getVectorStore} from "@/utils/vector";
import {PrismaClient} from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("beginning webpage embedding handler");
  const keyConfiguration = getKeyConfiguration(req);

  const {indexId, webPageUrl} = req.body;

  const loader = new CheerioWebBaseLoader(
    webPageUrl
  );

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