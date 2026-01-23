/**
 * Utility function to get the full URL for an image path.
 * 
 * Handles two scenarios:
 * 1. Full URLs (S3, CDN, external) - returns as-is
 * 2. Relative paths - prepends API URL (for backward compatibility during migration)
 * 
 * @param imagePath - The image path from the API (can be relative or full URL)
 * @returns The complete URL to the image
 * 
 * @example
 * // Full S3/CDN URL (preferred after migration):
 * // Input: "https://bucket.s3.amazonaws.com/uploads/profiles/image.png"
 * // Output: "https://bucket.s3.amazonaws.com/uploads/profiles/image.png"
 * 
 * // Relative path (backward compatibility):
 * // Input: "/uploads/profiles/image.png"
 * // Output: "http://api.example.com/uploads/profiles/image.png"
 */
export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) {
    return "";
  }

  // If already a full URL (S3, CDN, or external), return as-is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Fallback to API URL for relative paths (backward compatibility during migration)
  const apiUrl = process.env.NEXT_PUBLIC_API || "";
  return `${apiUrl}${imagePath}`;
};
