import {ModelType} from "@/types/index";

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