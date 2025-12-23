import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    sassOptions: {
        includePaths: ["./node_modules"],
    },
};

export default nextConfig;
