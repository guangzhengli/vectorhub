export interface Database {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  indexes?: Index[];
  likedIndexIds?: string[];
}

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
  author?: Database;
}