import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const styles = {
  container: "grid grid-cols-1 gap-4 p-4",
  grid: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
  card: "border border-gray-200",
  cardHeader: "pb-3",
  cardContent: "pt-0 space-y-2",
  skeleton: "animate-pulse",
  title: "h-6 w-3/4",
  line: "h-3 w-full",
  shortLine: "h-3 w-2/3",
  readMore: "h-3 w-16",
};

function SummaryCardSkeleton() {
  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader}>
        <Skeleton className={`${styles.skeleton} ${styles.title}`} />
      </CardHeader>
      <CardContent className={styles.cardContent}>
        <Skeleton className={`${styles.skeleton} ${styles.line}`} />
        <Skeleton className={`${styles.skeleton} ${styles.line}`} />
        <Skeleton className={`${styles.skeleton} ${styles.shortLine}`} />
        <div className="mt-3">
          <Skeleton className={`${styles.skeleton} ${styles.readMore}`} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function SummariesLoading() {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {Array.from({ length: 8 }).map((_, index) => (
          <SummaryCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}