import { useEffect, useState } from 'react';

export default function useImagePreviews(files: File[]) {
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!files.length) {
      setPreviews([]);
      return;
    }
    const urls = files.map(f => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [files]);

  return previews;
}
