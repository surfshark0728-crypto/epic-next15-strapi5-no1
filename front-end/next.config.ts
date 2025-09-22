import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**/*",
      },
      {
        protocol: "https",
        hostname: "decisive-leader-aa0f4e8f44.media.strapiapp.com",
        pathname: "/**", // 업로드 파일 전체 허용        
      }
    ]
  }
  ,
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // 이미지 업로드 시 기본 1MB에서 5MB로 증가
    },
  },
};


export default nextConfig;
