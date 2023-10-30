// @ts-expect-error
import wasm from '../../node_modules/@dqbd/tiktoken/lite/tiktoken_bg.wasm?module';
import {getKeyConfiguration} from "@/utils/app/configuration";
import {NextApiRequest, NextApiResponse} from "next";
import {AIChatMessage, BaseChatMessage, HumanChatMessage} from "langchain/schema";
import {getChatModel} from "@/utils/openai";
import {ChatPromptTemplate, HumanMessagePromptTemplate} from "langchain/prompts";
import {BufferMemory, ChatMessageHistory} from "langchain/memory";
import {LLMChain} from "langchain/chains";
import {ChatBody} from "@/types/chat";

export const runtime = 'edge'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { messages, prompt } = req.body as ChatBody;
  const keyConfiguration = getKeyConfiguration(req);

  let input: string;
  if (messages.length === 1) {
    input = messages[0].content;
  } else {
    input = messages[messages.length - 1].content;
  }

  const historyMessages: BaseChatMessage[] = messages?.slice(0, messages.length - 1)
  .map((message) => {
    if (message.role === 'user') {
      return new HumanChatMessage(message.content);
    } else if (message.role === 'assistant') {
      return new AIChatMessage(message.content);
    }
    throw new TypeError('Invalid message role');
  });

  try {
    const llm = await getChatModel(keyConfiguration, res);

    const promptTemplate = ChatPromptTemplate.fromPromptMessages([
      // SystemMessagePromptTemplate.fromTemplate(prompt ? prompt : DEFAULT_SYSTEM_PROMPT),
      // new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ]);

    const memory = new BufferMemory({
      returnMessages: true,
      chatHistory: new ChatMessageHistory(historyMessages),
    });

    const chain = new LLMChain({
      prompt: promptTemplate,
      llm,
      memory,
    });

    await chain.call({ input });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: (err as Error).toString() });
  }
};


export default handler;
