-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "namespace" TEXT DEFAULT 'default',
    "indexId" TEXT NOT NULL,
    "vector" vector,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_indexId_fkey" FOREIGN KEY ("indexId") REFERENCES "Index"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
