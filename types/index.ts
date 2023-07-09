import {User} from "@/types/user";
import {Like} from "@/types/like";

export interface Index {
  id: string;
  name: string;
  description: string;
  prompt?: string;
  tags?: string[];
  questions?: string[];
  likesCount?: bigint;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId?: string;
  author?: User;
  likes?: Like[];
}