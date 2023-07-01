export enum ModelType {
  OPENAI = 'OPENAI',
  AZURE_OPENAI = 'AZURE_OPENAI',
}

export interface Message {
  role: Role;
  content: string;
}

export type Role = 'assistant' | 'user';