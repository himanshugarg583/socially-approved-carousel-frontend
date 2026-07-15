import { useCallback, useEffect, useState } from "react";
import { fetchVideos, likeVideo, shareVideo } from "@/lib/api";

export function useVideos() {
  const [videos, setVideos] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const data = await fetchVideos();
      setVideos(data);
      setStatus("ready");
    } catch (loadError) {
      setError(loadError.message);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleLike = useCallback(async (id) => {
    let previous;
    setVideos((current) =>
      current.map((video) => {
        if (video.id !== id) return video;
        previous = video;
        const liked = !video.liked;
        return { ...video, liked, likeCount: video.likeCount + (liked ? 1 : -1) };
      })
    );

    try {
      const result = await likeVideo(id);
      setVideos((current) =>
        current.map((video) =>
          video.id === id ? { ...video, liked: result.liked, likeCount: result.likeCount } : video
        )
      );
    } catch (likeError) {
      if (previous) {
        setVideos((current) => current.map((video) => (video.id === id ? previous : video)));
      }
    }
  }, []);

  const share = useCallback(async (id, platform) => {
    try {
      const result = await shareVideo(id, platform);
      setVideos((current) =>
        current.map((video) => (video.id === id ? { ...video, shareCount: result.shareCount } : video))
      );
      return true;
    } catch (shareError) {
      return false;
    }
  }, []);

  return { videos, status, error, reload: load, toggleLike, share };
}
