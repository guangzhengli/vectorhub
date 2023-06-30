export enum ModelType {
  OPENAI = 'OPENAI',
  AZURE_OPENAI = 'AZURE_OPENAI',
}

export interface Message {
  role: Role;
  content: string;
}

export type Role = 'assistant' | 'user';

export interface ChatFolder {
  id: number;
  name: string;
}

export interface Conversation {
  id: number;
  name: string;
  messages: Message[];
  prompt: string;
  folderId: number;
  index: LlamaIndex;
}

export interface ChatBody {
  messages: Message[];
  prompt: string;
}

export interface KeyValuePair {
  key: string;
  value: any;
}

export interface LlamaIndex {
  indexName: string;
  indexType: string;
}

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

export interface Index {
  id: string;
  name: string;
  description: string;
  prompt?: string;
  tags?: string[];
  questions?: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId?: string;
  author?: User;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  indexes?: Index[];
}
