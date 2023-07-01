import {LlamaIndex} from "@/types/llamaIndex";
import {Message} from "@/types/index";

export interface Conversation {
  id: number;
  name: string;
  messages: Message[];
  prompt: string;
  folderId: number;
  index: LlamaIndex;
}