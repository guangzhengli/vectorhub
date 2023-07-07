import { Skeleton } from "../ui/skeleton"

export const IndexSkeleton = () => {
    return (
        <>
            <div className="flex items-center space-x-4">
                <Skeleton className="h-24 w-full" />
            <div className="space-y-2">
                <Skeleton className="h-24 w-full" />
            </div>
            </div>
        </>
    )
}