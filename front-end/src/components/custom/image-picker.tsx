"use client"; 
import React, { useState, useRef } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StrapiImage from "./strapi-image";


// ✅ 컴포넌트에 전달되는 props 타입 정의
interface IImagePickerProps {
  id: string;                          // input의 id
  name: string;                        // input의 name
  label: string;                       // 라벨 텍스트
  showCard?: boolean;                  // (옵션) 카드 형태로 보여줄지 여부
  defaultValue?: string;               // (옵션) 기본 이미지 URL
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // (옵션) change 이벤트 핸들러
}

// ✅ 이미지 카드에 필요한 props 타입
interface IImageCardProps {
  dataUrl: string;                                         // 이미지 미리보기 URL
  fileInput: React.RefObject<HTMLInputElement | null>;     // 파일 input 참조(ref)
}

// ✅ 이미지 미리보기 전용 props 타입
interface IImagePreviewProps {
  dataUrl: string;   // 이미지 데이터 URL
}


// ✅ 파일을 dataUrl(base64)로 변환하는 유틸 함수
function generateDataUrl(file: File, callback: (imageUrl: string) => void) {
  const reader = new FileReader();
  reader.onload = () => {
    callback(reader.result as string); // 변환된 dataUrl을 callback으로 전달
  };
  reader.readAsDataURL(file); // 파일을 base64 문자열로 읽기
}


// ✅ 이미지 미리보기를 보여주는 컴포넌트
function ImagePreview({ dataUrl }: Readonly<IImagePreviewProps>) {
  return (
    <StrapiImage
      src={dataUrl}                           // 미리보기 이미지 URL
      alt="preview"                           // 대체 텍스트
      height={200}                            // 이미지 높이
      width={200}                             // 이미지 너비
      className="rounded-lg w-full object-cover" // 스타일: 둥근 모서리 + 꽉 채우기
    />
  );
}


// ✅ 이미지 카드 형태로 보여주는 컴포넌트
function ImageCard({ dataUrl, fileInput }: Readonly<IImageCardProps>) {
  // 이미지가 있으면 미리보기, 없으면 안내 문구
  const imagePreview = dataUrl ? (
    <ImagePreview dataUrl={dataUrl} />
  ) : (
    <p>선택한 이미지가 없습니다.</p>
  );

  return (
    <div className="w-full relative">
      {/* 테두리 박스 안에 이미지 또는 안내 문구 */}
      <div className="flex items-center space-x-4 rounded-md border p-4">
        {imagePreview}
      </div>
      {/* 카드 전체를 클릭하면 파일 선택창 열리도록 버튼 처리 */}
      <button
        onClick={() => fileInput.current?.click()} // 파일 input 클릭 실행
        className="w-full absolute inset-0"        // 카드 전체를 덮는 버튼
        type="button"
        title="이미지 선택"
      ></button>
    </div>
  );
}


// ✅ 메인 ImagePicker 컴포넌트
export default function ImagePicker({
  id,
  name,
  label,
  defaultValue,
}: Readonly<IImagePickerProps>) {
  // 파일 input 참조
  const fileInput = useRef<HTMLInputElement>(null);

  // 선택한 파일을 dataUrl로 변환하여 상태 저장
  const [dataUrl, setDataUrl] = useState<string | null>(
    defaultValue ?? null
  );

  // 파일 선택 이벤트 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];   // 첫 번째 선택 파일
    if (file) generateDataUrl(file, setDataUrl); // dataUrl 변환 후 state 업데이트

 
  };

  return (
    <React.Fragment>
      {/* 실제 파일 input은 숨기고, 커스텀 UI로 대체 */}
      <div className="hidden">
        <Label htmlFor={name}>{label}</Label>
        <Input
          type="file"
          id={id}
          name={name}
          onChange={handleFileChange} // 파일 변경 시 미리보기 업데이트
          ref={fileInput}             // 참조 연결
          accept="image/*"            // 이미지 파일만 허용
        />
      </div>

      {/* 미리보기 카드 */}
      <ImageCard dataUrl={dataUrl ?? ""} fileInput={fileInput} />
    </React.Fragment>
  );
}
