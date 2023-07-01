export enum ModelType {
  OPENAI = 'OPENAI',
  AZURE_OPENAI = 'AZURE_OPENAI',
}

export interface Message {
  role: Role;
  content: string;
}

export interface ChatFolder {
  id: number;
  name: string;
}

export interface ChatBody {
  messages: Message[];
  prompt: string;
}

export interface KeyValuePair {
  key: string;
  value: any;
}

export type Role = 'assistant' | 'user';