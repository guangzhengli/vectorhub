import { OpenAIChat } from "langchain/llms/openai";
import {CallbackManager} from "langchain/callbacks";
import {NextApiResponse} from "next";
import {ModelType} from "@/types/chat";
import {KeyConfiguration} from "@/types/keyConfiguration";

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