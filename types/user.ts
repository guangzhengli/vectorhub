import {Index} from "@/types/index";
import {Like} from "@/types/like";

export interface User {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  indexes?: Index[];
  likes?: Like[];
}