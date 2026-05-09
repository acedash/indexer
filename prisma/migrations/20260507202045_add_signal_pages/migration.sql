-- AlterTable
ALTER TABLE "urls" ADD COLUMN     "signalPageId" TEXT;

-- CreateTable
CREATE TABLE "signal_pages" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "signal_pages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "signal_pages_slug_key" ON "signal_pages"("slug");

-- AddForeignKey
ALTER TABLE "urls" ADD CONSTRAINT "urls_signalPageId_fkey" FOREIGN KEY ("signalPageId") REFERENCES "signal_pages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
