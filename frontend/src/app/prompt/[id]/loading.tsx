import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
    return (
        <>
            <div className="mb-8 flex items-center justify-between">
                <Skeleton className="h-9 w-64" />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-muted/30 flex h-75 w-full items-center justify-center">
                    <Skeleton className="h-16 w-16 rounded-full opacity-20" />
                </Card>
                <Card className="h-full">
                    <CardHeader>
                        <Skeleton className="mb-2 h-6 w-24" />
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Skeleton className="mb-4 h-4 w-12" />
                            <div className="flex flex-wrap gap-2">
                                <Skeleton className="h-5 w-16 rounded-full" />
                                <Skeleton className="h-5 w-20 rounded-full" />
                                <Skeleton className="h-5 w-14 rounded-full" />
                            </div>
                        </div>
                        <Separator />
                        <div>
                            <Skeleton className="mb-2 h-4 w-20" />
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-3/4" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Card className="mt-8">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-100 w-full rounded-md" />
                </CardContent>
            </Card>
        </>
    );
}
