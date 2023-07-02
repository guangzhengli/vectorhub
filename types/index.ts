import {User} from "@/types/user";

export interface Index {
  id: string;
  name: string;
  description: string;
  prompt?: string;
  tags?: string[];
  questions?: string[];
  likes?: bigint;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId?: string;
  author?: User;
}