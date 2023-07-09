import {Message} from "@/types/chat";
import {Index} from "@/types/index";

export interface Conversation {
  id: number;
  name: string;
  messages: Message[];
  prompt: string;
  folderId: number;
  index: Index;
}