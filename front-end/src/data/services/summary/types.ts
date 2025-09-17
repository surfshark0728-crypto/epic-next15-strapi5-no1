export interface StrapiConfig {
  baseUrl: string;
  apiToken: string;
  path: string;
}

export interface TranscriptSegment {
  text: string;
  start: number;
  end: number;
  duration: number;
}

export interface TranscriptData {
  title: string | undefined;
  videoId: string | undefined;
  thumbnailUrl: string | undefined;
  fullTranscript: string | undefined;
  transcriptWithTimeCodes?: TranscriptSegment[]
}

// Add proper types
export interface SummaryData {
  fullTranscript: string;
  title: string;
  thumbnailUrl: string;
  transcriptWithTimeCodes: TranscriptSegment[]
}

export interface YouTubeTranscriptSegment {
  snippet: {
    text: string;
  };
  start_ms: string;
  end_ms: string;
}

export interface YouTubeThumbnail {
  url: string;
  width?: number;
  height?: number;
}

export interface YouTubeBasicInfo {
  title: string | undefined;
  id: string;
  thumbnail?: YouTubeThumbnail[];
}

export interface YouTubeTranscriptContent {
  transcript: {
    content: {
      body: {
        initial_segments: YouTubeTranscriptSegment[];
      };
    };
  };
}

// YouTube API에서 실제로 사용하는 속성에 대한 최소 인터페이스
export interface YouTubeAPIVideoInfo {
  basic_info: {
    title?: string;
    id: string;
    thumbnail?: Array<{
      url: string;
      width?: number;
      height?: number;
    }>;
  };
  getTranscript(): Promise<YouTubeTranscriptContent>;
}
