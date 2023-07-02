import {getEmbeddings} from "@/utils/embeddings";
import {KeyConfiguration} from "@/types/keyConfiguration";
import {Document, Prisma, PrismaClient} from "@prisma/client";
import {PrismaVectorStore} from "langchain/vectorstores/prisma";

export const getVectorStore = async (keyConfiguration: KeyConfiguration) => {
  const db = new PrismaClient();
  return PrismaVectorStore.withModel<Document>(db).create(
    getEmbeddings(keyConfiguration),
    {
      prisma: Prisma,
      tableName: "Document",
      vectorColumnName: "vector",
      columns: {
        id: PrismaVectorStore.IdColumn,
        content: PrismaVectorStore.ContentColumn,
      }
    }
  );
}