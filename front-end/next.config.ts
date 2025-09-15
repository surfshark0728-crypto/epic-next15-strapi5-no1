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
