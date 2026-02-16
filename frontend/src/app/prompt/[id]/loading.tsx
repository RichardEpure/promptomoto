import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <main className="m-auto flex size-full max-w-5xl flex-col gap-5 px-8 py-5">
            {/* Title */}
            <Skeleton className="h-8 w-1/3" />

            <div className="flex max-h-125 grow gap-5">
                {/* Image Placeholder */}
                <Skeleton className="h-full w-2/3" />

                {/* Right Column (Tags) */}
                <div className="flex h-full w-1/3 flex-col gap-4">
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm">Tags:</span>
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Description Section */}
            <div className="flex flex-col gap-2">
                <Skeleton className="h-7 w-32" /> {/* 'Description' header */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>

            {/* Prompt Section */}
            <div className="flex flex-col gap-2">
                <Skeleton className="h-7 w-24" /> {/* 'Prompt' header */}
                <Skeleton className="h-32 w-full rounded-md" />
                <Skeleton className="size-10" /> {/* Button */}
            </div>
        </main>
    );
}
