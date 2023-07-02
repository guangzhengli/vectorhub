import {Index} from "@/types/index";

export interface User {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  indexes?: Index[];
  likedIndexIds?: string[];
}