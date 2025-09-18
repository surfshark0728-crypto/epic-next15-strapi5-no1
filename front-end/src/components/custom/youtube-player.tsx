"use client";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Play } from "lucide-react";


interface IYouTubePlayerProps {
  videoId: string;
}

const styles = {
  container: "relative w-full h-[315px] rounded-lg overflow-hidden",
  skeletonWrapper: "absolute inset-0 w-full h-full",
  skeleton: "w-full h-full animate-pulse",
  iconContainer: "absolute inset-0 flex items-center justify-center",
  playIcon: "w-16 h-16 text-gray-400 animate-bounce",
  iframe: "rounded-lg",
};


export default function YouTubePlayer({ videoId }: IYouTubePlayerProps  ) {

  const [isLoaded, setIsLoaded] = useState(false);


 return (
    <div className="relative w-full h-[315px] rounded-lg overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 w-full h-full">
          <Skeleton className="w-full h-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Play className="w-16 h-16 text-gray-400 animate-bounce" fill="currentColor" />
          </div>
        </div>
      )}
      <iframe
        width="100%"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-lg"
        onLoad={() => setIsLoaded(true)}
        style={{ display: isLoaded ? "block" : "none" }}
      />
    </div>
  );




}
