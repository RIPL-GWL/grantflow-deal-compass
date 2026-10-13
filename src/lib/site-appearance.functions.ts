import { createServerFn } from "@tanstack/react-start";
import shareImageSrcAsset from "@/assets/rishishwar-share.webp.asset.json";
const shareImageSrc = shareImageSrcAsset.url;
const shareImage = { url: shareImageSrc };

export const getSiteShareImage = createServerFn({ method: "GET" }).handler(() => ({ image: shareImage.url }));
