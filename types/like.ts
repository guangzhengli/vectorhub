import {User} from "@/types/user";
import {Index} from "@/types/index";

export interface Like {
  id: string;
  indexId: string;
  userId: string;
  user?: User;
  index?: Index;
}