import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "./ui/pagination";

export default function Paginator({
    className,
    total,
    pageSize,
    offset,
    onPageChange,
}: {
    className?: string;
    total: number;
    pageSize: number;
    offset: number;
    onPageChange: (newOffset: number) => void;
}) {
    const currentPage = Math.floor(offset / pageSize) + 1;
    const totalPages = Math.ceil(total / pageSize);
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    const previousPages = [];
    for (let i = currentPage - 1; i > 0 && i > currentPage - 3; i -= 1) {
        previousPages.unshift(
            <PaginationItem key={i}>
                <PaginationLink onClick={() => onPageChange((i - 1) * pageSize)}>
                    {i}
                </PaginationLink>
            </PaginationItem>,
        );
    }

    const nextPages = [];
    for (let i = currentPage + 1; i <= totalPages && i < currentPage + 3; i += 1) {
        nextPages.push(
            <PaginationItem key={i}>
                <PaginationLink onClick={() => onPageChange((i - 1) * pageSize)}>
                    {i}
                </PaginationLink>
            </PaginationItem>,
        );
    }

    if (totalPages <= 1) return null;

    return (
        <Pagination className={`${className} mt-6`}>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (!isFirstPage) onPageChange(Math.max(0, currentPage - 2) * pageSize);
                        }}
                        aria-disabled={isFirstPage}
                        className={isFirstPage ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
                {previousPages}
                <PaginationItem>
                    <span className="text-muted-foreground px-4 text-sm">{currentPage}</span>
                </PaginationItem>
                {nextPages}
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (!isLastPage) onPageChange(currentPage * pageSize);
                        }}
                        aria-disabled={isLastPage}
                        className={isLastPage ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
