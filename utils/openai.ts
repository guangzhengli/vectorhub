import { OpenAIChat } from "langchain/llms/openai";
import {CallbackManager} from "langchain/callbacks";
import {NextApiResponse} from "next";
import {ModelType} from "@/types/chat";
import {KeyConfiguration} from "@/types/keyConfiguration";

const MINIMAX_BASE_URL = 'https://api.minimax.io/v1';
const MINIMAX_DEFAULT_MODEL = 'MiniMax-M2.7';

export const getModel = async (keyConfiguration: KeyConfiguration, res: NextApiResponse) => {
    if (keyConfiguration.apiType === ModelType.AZURE_OPENAI) {
        return new OpenAIChat({
            temperature: 0.9,
            streaming: true,
            azureOpenAIApiKey: keyConfiguration.azureApiKey,
            azureOpenAIApiInstanceName: keyConfiguration.azureInstanceName,
            azureOpenAIApiDeploymentName: keyConfiguration.azureDeploymentName,
            azureOpenAIApiVersion: keyConfiguration.azureApiVersion,
            callbacks: getCallbackManager(res),
        });
    } else if (keyConfiguration.apiType === ModelType.MINIMAX) {
        return new OpenAIChat({
            temperature: 0.9,
            modelName: keyConfiguration.apiModel || MINIMAX_DEFAULT_MODEL,
            streaming: true,
            openAIApiKey: keyConfiguration.minimaxApiKey,
            configuration: {
                basePath: MINIMAX_BASE_URL,
            },
            callbacks: getCallbackManager(res),
        });
    } else {
        return new OpenAIChat({
            temperature: 0.9,
            modelName: keyConfiguration.apiModel,
            streaming: true,
            openAIApiKey: keyConfiguration.apiKey,
            callbacks: getCallbackManager(res),
        });
    }
}

export const getChatModel = async (keyConfiguration: KeyConfiguration, res: NextApiResponse) => {
    if (keyConfiguration.apiType === ModelType.AZURE_OPENAI) {
        return new OpenAIChat({
            temperature: 0.9,
            streaming: true,
            azureOpenAIApiKey: keyConfiguration.azureApiKey,
            azureOpenAIApiInstanceName: keyConfiguration.azureInstanceName,
            azureOpenAIApiDeploymentName: keyConfiguration.azureDeploymentName,
            azureOpenAIApiVersion: keyConfiguration.azureApiVersion,
            callbacks: getCallbackManager(res),
        });
    } else if (keyConfiguration.apiType === ModelType.MINIMAX) {
        return new OpenAIChat({
            temperature: 0.9,
            modelName: keyConfiguration.apiModel || MINIMAX_DEFAULT_MODEL,
            streaming: true,
            openAIApiKey: keyConfiguration.minimaxApiKey,
            configuration: {
                basePath: MINIMAX_BASE_URL,
            },
            callbacks: getCallbackManager(res),
        });
    } else {
        return new OpenAIChat({
            temperature: 0.9,
            modelName: keyConfiguration.apiModel,
            streaming: true,
            openAIApiKey: keyConfiguration.apiKey,
            callbacks: getCallbackManager(res),
        });
    }
}

export const getCallbackManager = (res: NextApiResponse) => {
    return CallbackManager.fromHandlers({
        handleLLMNewToken: async (token: string) =>{
            res.write(token);
        },
        handleLLMEnd: async () => {
            res.end();
        },
    })
}
