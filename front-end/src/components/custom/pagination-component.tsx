"use client";
import { FC } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  pageCount: number;
  className?: string;
}

interface PaginationArrowProps {
  direction: "left" | "right";
  href: string;
  isDisabled: boolean;
}

const PaginationArrow: FC<PaginationArrowProps> = ({
  direction,
  href,
  isDisabled,
}) => {
  const router = useRouter();
  const isLeft = direction === "left";

  const disabledClassName = isDisabled ? "opacity-50 cursor-not-allowed" : "";
  const buttonClassName = isLeft
    ? `bg-gray-100 text-gray-500 hover:bg-gray-200 ${disabledClassName}`
    : `bg-pink-500 text-white hover:bg-pink-600 ${disabledClassName}`;

  return (
    <Button
      onClick={() => router.push(href)}
      className={buttonClassName}
      aria-disabled={isDisabled}
      disabled={isDisabled}
    >
      {isLeft ? "«" : "»"}
    </Button>
  );
};

export function PaginationComponent({
  pageCount,
  className,
}: Readonly<PaginationProps>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // 👉 페이지 번호를 1 ~ 5 (또는 pageCount까지) 보여주도록 설정
  const pages = Array.from({ length: Math.min(5, pageCount) }, (_, i) => i + 1);

  return (
    <Pagination className={cn("flex justify-center gap-2", className)}>
      <PaginationContent>
        {/* 이전 버튼 */}
        <PaginationItem>
          <PaginationArrow
            direction="left"
            href={createPageURL(currentPage - 1)}
            isDisabled={currentPage <= 1}
          />
        </PaginationItem>

        {/* 페이지 번호 버튼 */}
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={createPageURL(page)}
              isActive={page === currentPage}
              className={cn(
                "rounded-full px-4 py-2 transition-colors",
                page === currentPage
                  ? "bg-pink-500 text-white font-bold"
                  : "hover:bg-gray-100"
              )}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* 페이지가 많을 경우 점 3개 (...) 표시 */}
        {pageCount > 5 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* 다음 버튼 */}
        <PaginationItem>
          <PaginationArrow
            direction="right"
            href={createPageURL(currentPage + 1)}
            isDisabled={currentPage >= pageCount}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
