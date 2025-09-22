import {
  TranscriptData,
  TranscriptSegment,
  YouTubeTranscriptSegment,
  YouTubeAPIVideoInfo,
} from "./types";

/**
 * YouTubeTranscriptSegment[] → TranscriptSegment[] 변환
 * - 각 세그먼트에서 필요한 필드만 뽑아 가공
 * - duration: end - start 로 계산
 */
const processTranscriptSegments = (
  segments: YouTubeTranscriptSegment[]
): TranscriptSegment[] => {
  return segments.map((segment) => ({
    text: segment.snippet.text,
    start: Number(segment.start_ms),
    end: Number(segment.end_ms),
    duration: Number(segment.end_ms) - Number(segment.start_ms),
  }));
};

/**
 * 유튜브 썸네일 URL 정리
 * - ? 이후의 쿼리스트링 제거
 *   (리사이즈 파라미터 등 제거하여 깔끔한 원본 URL만 추출)
 */
const cleanImageUrl = (url: string): string => url.split("?")[0];

/**
 * 유튜브 비디오 ID 유효성 검증
 * - 빈 값이거나 문자열이 아닌 경우 오류 발생
 */
const validateIdentifier = (identifier: string): void => {
  if (!identifier || typeof identifier !== "string") {
    throw new Error("잘못된 YouTube 비디오 식별자");
  }
};

/**
 * 유튜브 기본 정보 추출
 * - 제목, videoId, 썸네일 URL 반환
 * - 썸네일은 첫 번째 것만 사용
 */
const extractBasicInfo = (info: YouTubeAPIVideoInfo) => {
  const { title, id: videoId, thumbnail } = info.basic_info;
  const thumbnailUrl = thumbnail?.[0]?.url;

  return {
    title: title || "Untitled Video",
    videoId,
    thumbnailUrl: thumbnailUrl ? cleanImageUrl(thumbnailUrl) : undefined,
  };
};

/**
 * 유튜브 영상에서 대본(Transcript) 세그먼트 가져오기
 * - `initial_segments`가 없으면 에러 발생
 */
const getTranscriptSegments = async (
  info: YouTubeAPIVideoInfo
): Promise<YouTubeTranscriptSegment[]> => {
  const transcriptData = await info.getTranscript();

  if (!transcriptData?.transcript?.content?.body?.initial_segments) {
    throw new Error("이 영상에 대한 대본이 없습니다.");
  }

  return transcriptData.transcript.content.body.initial_segments;
};

/**
 * 유튜브 대본(Transcript) 전체 생성
 * - 비디오 ID(identifier) → 유튜브 API 호출 → 대본 + 기본정보 반환
 */
export const generateTranscript = async (
  identifier: string
): Promise<TranscriptData & { fullTranscriptKo?: string; transcriptWithTimeCodesKo?: TranscriptSegment[] }> => {
  try {
    const { Innertube } = await import("youtubei.js");

    // 영어 클라이언트
    const youtubeEn = await Innertube.create({
      lang: "en",
      location: "US",
      retrieve_player: false,
    });

    // 한국어 클라이언트
    const youtubeKo = await Innertube.create({
      lang: "ko",
      location: "KR",
      retrieve_player: false,
    });

    // ID 유효성 체크
    validateIdentifier(identifier);

   
    // 영상 정보  가져옴
    const info = await youtubeEn.getInfo(identifier);
    if (!info) throw new Error("동영상 정보를 찾을 수 없습니다.");

    // 기본 정보 추출
    const { title, videoId, thumbnailUrl } = extractBasicInfo(info as YouTubeAPIVideoInfo);

    // 영어 대본
    let fullTranscript: string | undefined;
    let transcriptWithTimeCodes: TranscriptSegment[] | undefined;
    try {
        // 영어 대본
        const segmentsEn = await getTranscriptSegments(info as YouTubeAPIVideoInfo);
        transcriptWithTimeCodes = processTranscriptSegments(segmentsEn);
        fullTranscript = segmentsEn.map((s) => s.snippet.text).join(" ");
    } catch (error) {
      fullTranscript="";
      transcriptWithTimeCodes=[];      
      console.warn("⚠️ 영어어 대본을 가져오지 못했습니다:", error);
    }


    /////////////////////한국어 /////////////////////

    // 한국어 대본
    let fullTranscriptKo: string | undefined;
    let transcriptWithTimeCodesKo: TranscriptSegment[] | undefined;    
    try {  
      const infoKo = await youtubeKo.getInfo(identifier);
      const segmentsKo = await getTranscriptSegments(infoKo as YouTubeAPIVideoInfo);
      transcriptWithTimeCodesKo = processTranscriptSegments(segmentsKo);
      fullTranscriptKo = segmentsKo.map((s) => s.snippet.text).join(" ");
    } catch (error) {
      fullTranscriptKo="";
      transcriptWithTimeCodesKo=[];
      console.warn("⚠️ 한국어 대본을 가져오지 못했습니다:", error);
    }

    // 최종 반환
    return {
      title,
      videoId,
      thumbnailUrl,
      fullTranscript, // 영어
      transcriptWithTimeCodes, // 영어 타임코드 포함
      fullTranscriptKo, // 한국어 (있으면)
      transcriptWithTimeCodesKo, // 한국어 타임코드 포함 (있으면)
    };
  } catch (error) {
    console.error("대본을 가져오는 중 오류:", error);
    throw new Error(
      error instanceof Error ? error.message : "대본을 가져오지 못했습니다."
    );
  }
};
