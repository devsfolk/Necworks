'use client';

import {useState} from 'react';

type VideoEmbedProps = {
  mode: 'youtube' | 'local';
  title: string;
  playLabel: string;
  poster: string;
  youtubeId?: string;
  src?: string;
  loop?: boolean;
};

export function VideoEmbed({mode, title, playLabel, poster, youtubeId, src, loop = false}: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (mode === 'local') {
    if (!src) return null;
    return <video className="video-embed" src={src} title={title} aria-label={title} preload="none" poster={poster} muted={loop} loop={loop} playsInline controls={!loop} />;
  }

  if (!youtubeId || !/^[A-Za-z0-9_-]{11}$/.test(youtubeId)) return null;
  if (isPlaying) {
    return <iframe className="video-embed" src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />;
  }

  return (
    <div className="video-embed video-embed--facade" style={{backgroundImage: `url("${poster}")`}}>
      <button type="button" className="video-embed__play" aria-label={playLabel} onClick={() => setIsPlaying(true)}>
        <span aria-hidden="true">▶</span>
      </button>
    </div>
  );
}
