import type {NextApiRequest, NextApiResponse} from 'next'
import {getModel} from "@/utils/openai";
import {loadQAStuffChain} from "langchain/chains";
import { getKeyConfiguration } from '@/utils/app/configuration';
import {getVectorStore} from "@/utils/vector";

export const config = {
    api: {
        bodyParser: false,
    }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("beginning handler");
    const keyConfiguration = getKeyConfiguration(req);

    const message: string = req.query.message as string;
    const indexId: string = req.query.indexId as string;

    console.log("handler chatfile query: ", message, indexId);
    const vectorStore = await getVectorStore(keyConfiguration);

    const documents = await vectorStore.similaritySearchWithScore(message, 2,
        { indexId: { equals: indexId }}
    );
    const llm = await getModel(keyConfiguration, res);
    const stuffChain = loadQAStuffChain(llm);

    try {
        stuffChain.call({
            input_documents: documents,
            question: message,
        }).catch(console.error);
        // res.status(200).json({ responseMessage: chainValues.text.toString() });
    } catch (e) {
        console.log("error in handler: ", e);
        res.status(500).json({ errorMessage: (e as Error).toString() });
    }

}

export default handler;