import {ModelType} from "@/types/chat";

export interface KeyConfiguration {
  apiType?: ModelType;
  apiKey?: string;
  apiModel?: string;
  azureApiKey?: string;
  azureInstanceName?: string;
  azureApiVersion?: string;
  azureDeploymentName?: string;
  azureEmbeddingDeploymentName?: string;
}