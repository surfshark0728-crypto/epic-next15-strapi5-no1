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
): Promise<TranscriptData> => {
  console.log(identifier);
  try {
    // youtubei.js 라이브러리 동적 import
    const { Innertube } = await import("youtubei.js");

    // 유튜브 API 클라이언트 생성
    const youtube = await Innertube.create({
      lang: "en",        // 언어 설정
      location: "US",    // 지역 설정
      retrieve_player: false, // 플레이어 데이터는 불러오지 않음
    });

    console.log("IDENTIFIER", identifier, "VS", "LCYBVpSB0Wo");

    // 비디오 ID 유효성 검증
    validateIdentifier(identifier);

    // 영상 정보 가져오기
    const info = await youtube.getInfo(identifier);

    console.log("INFO:", info);
    if (!info) {
      throw new Error("동영상 정보를 찾을 수 없습니다.");
    }

    // 영상 기본 정보 추출 (제목, videoId, 썸네일)
    const { title, videoId, thumbnailUrl } = extractBasicInfo(
      info as YouTubeAPIVideoInfo
    );

    // 대본(Transcript) 세그먼트 가져오기
    const segments = await getTranscriptSegments(info as YouTubeAPIVideoInfo);

    // 각 세그먼트를 가공하여 시작/끝/지속시간 포함
    const transcriptWithTimeCodes = processTranscriptSegments(segments);

    // 전체 대본을 한 문장으로 합치기
    const fullTranscript = segments
      .map((segment) => segment.snippet.text)
      .join(" ");

    // 최종 TranscriptData 반환
    return {
      title,
      videoId,
      thumbnailUrl,
      fullTranscript,
      transcriptWithTimeCodes,
    };
  } catch (error) {
    // 에러 처리
    console.error("대본을 가져오는 중 오류가 발생했습니다:", error);
    throw new Error(
      error instanceof Error ? error.message : "대본을 가져오지 못했습니다."
    );
  }
};
