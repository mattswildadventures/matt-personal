import { useCallback, useEffect, useRef, useState } from "react";

// YouTube IFrame API types
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          height?: string;
          width?: string;
          videoId?: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number; target: YTPlayer }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: {
        UNSTARTED: -1;
        ENDED: 0;
        PLAYING: 1;
        PAUSED: 2;
        BUFFERING: 3;
        CUED: 5;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  loadVideoById: (videoId: string) => void;
  cueVideoById: (videoId: string) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  getPlayerState: () => number;
  destroy: () => void;
}

export type PlayerState = {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isReady: boolean;
  isBuffering: boolean;
  volume: number;
  error: boolean;
};

export default function useYouTubePlayer(containerId: string) {
  const playerRef = useRef<YTPlayer | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingVideoRef = useRef<string | null>(null);
  const [state, setState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isReady: false,
    isBuffering: false,
    volume: 50,
    error: false,
  });

  // Suppress cross-origin errors from YouTube iframe
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // YouTube iframe errors are cross-origin and have no useful message
      if (event.message === "Script error." || event.message?.includes("cross-origin")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return true;
      }
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  // Load the YouTube IFrame API script
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already loaded
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    // Already loading (script tag exists)
    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]'
    );
    if (existingScript) {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prevCallback?.();
        initPlayer();
      };
      return;
    }

    // Load fresh
    window.onYouTubeIframeAPIReady = () => {
      initPlayer();
    };

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      playerRef.current?.destroy();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const initPlayer = useCallback(() => {
    const container = document.getElementById(containerId);
    if (!container || playerRef.current) return;

    playerRef.current = new window.YT.Player(containerId, {
      height: "0",
      width: "0",
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
      },
      events: {
        onReady: (event) => {
          event.target.setVolume(50);
          setState((prev) => ({ ...prev, isReady: true }));

          // If a video was queued before the player was ready, load it now
          if (pendingVideoRef.current) {
            event.target.cueVideoById(pendingVideoRef.current);
            pendingVideoRef.current = null;
          }
        },
        onStateChange: (event) => {
          try {
            const playing = event.data === 1;
            const buffering = event.data === 3;
            const ended = event.data === 0;

            setState((prev) => ({
              ...prev,
              isPlaying: playing,
              isBuffering: buffering,
              duration: event.target.getDuration() || prev.duration,
            }));

            // Start/stop progress tracking
            if (playing) {
              startProgressTracking();
            } else {
              stopProgressTracking();
            }

            // Emit ended event for track looping
            if (ended) {
              window.dispatchEvent(new CustomEvent("yt-track-ended"));
            }
          } catch (e) {
            // Silently handle YouTube iframe communication errors
          }
        },
        onError: () => {
          setState((prev) => ({ ...prev, error: true, isPlaying: false }));
        },
      },
    });
  }, [containerId]); // eslint-disable-line react-hooks/exhaustive-deps

  const startProgressTracking = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      try {
        if (playerRef.current) {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          setState((prev) => ({ ...prev, currentTime, duration }));
        }
      } catch (e) {
        // Player may not be ready yet
      }
    }, 250);
  }, []);

  const stopProgressTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    try { playerRef.current?.playVideo(); } catch (e) { /* iframe not ready */ }
  }, []);

  const pause = useCallback(() => {
    try { playerRef.current?.pauseVideo(); } catch (e) { /* iframe not ready */ }
  }, []);

  const loadVideo = useCallback((videoId: string) => {
    setState((prev) => ({ ...prev, error: false, currentTime: 0, duration: 0 }));
    try {
      if (playerRef.current && state.isReady) {
        playerRef.current.loadVideoById(videoId);
      } else {
        pendingVideoRef.current = videoId;
      }
    } catch (e) {
      pendingVideoRef.current = videoId;
    }
  }, [state.isReady]);

  const seekTo = useCallback((seconds: number) => {
    try { playerRef.current?.seekTo(seconds, true); } catch (e) { /* ignore */ }
  }, []);

  const setVolume = useCallback((volume: number) => {
    try { playerRef.current?.setVolume(volume); } catch (e) { /* ignore */ }
    setState((prev) => ({ ...prev, volume }));
  }, []);

  return {
    state,
    play,
    pause,
    loadVideo,
    seekTo,
    setVolume,
  };
}
