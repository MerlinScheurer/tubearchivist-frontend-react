import updateVideoProgressById from "../action/updateVideoProgressById";
import updateWatchedState from "../action/updateWatchedState";
import { VideoResponseType } from "../pages/Video";
import watchedThreshold from "./watchedThreshold";

type Subtitle = {
  name: string;
  source: string;
  lang: string;
  media_url: string;
};

type SubtitlesProp = {
  subtitles: Subtitle[];
};

const Subtitles = ({ subtitles }: SubtitlesProp) => {
  return subtitles.map((subtitle: Subtitle) => {
    let label = subtitle.name;

    if (subtitle.source === "auto") {
      label += " - auto";
    }

    return `<track label="${label}" kind="subtitles" srclang="${subtitle.lang}" src="${subtitle.media_url}">`;
  });
};

const handleTimeUpdate =
  (youtubeId: string, duration: number, watched: boolean) =>
  async (videoTag) => {
    const currentTime = Number(videoTag.target.currentTime);

    // TODO: Sponsorblock ( onVideoProgress )

    if (currentTime < 10) return;
    if (Number((currentTime % 10).toFixed(1)) <= 0.2) {
      // Check progress every 10 seconds or else progress is checked a few times a second
      await updateVideoProgressById({
        youtubeId,
        currentProgress: currentTime,
      });

      if (!watched) {
        // Check if video is already marked as watched
        if (watchedThreshold(currentTime, duration)) {
          await updateWatchedState({
            id: youtubeId,
            is_watched: true,
          });
        }
      }
    }
  };

const handleVideoEnd =
  (youtubeId: string, watched: boolean) => async (videoTag) => {
    if (!watched) {
      // Check if video is already marked as watched
      await updateWatchedState({ id: youtubeId, is_watched: true });
    }

    //TODO: Sponsorblock
    /*
  for (let i in sponsorBlock.segments) {
    let notificationsElementUUID = document.getElementById(
      'notification-' + sponsorBlock.segments[i].UUID
    );
    if (notificationsElementUUID) {
      notificationsElementUUID.outerHTML = '';
    }
  }
  */
  };

export type VideoProgressType = {
  youtube_id: string;
  user_id: number;
  position: number;
};

type VideoPlayerProps = {
  video: VideoResponseType;
  videoProgress: VideoProgressType;
};

const VideoPlayer = ({ video, videoProgress }: VideoPlayerProps) => {
  const videoId = video.data.youtube_id;
  const videoUrl = video.data.media_url;
  const videoThumbUrl = video.data.vid_thumb_url;
  const watched = video.data.player.watched;
  const duration = video.data.player.duration;

  const autoplay = false;

  const videoSubtitles = video.data.subtitles; // Array of subtitles

  return (
    <video
      poster={videoThumbUrl}
      onVolumeChange={(videoTag) => {
        localStorage.setItem("playerVolume", videoTag.target.volume);
      }}
      onLoadStart={(videoTag) => {
        videoTag.target.volume = localStorage.getItem("playerVolume") ?? 1;
      }}
      onTimeUpdate={handleTimeUpdate(videoId, duration, watched)}
      onPause={async (videoTag) => {
        const currentTime = Number(videoTag.target.currentTime);

        if (currentTime < 10) return;

        await updateVideoProgressById({
          youtubeId: videoId,
          currentProgress: currentTime,
        });
      }}
      onEnded={handleVideoEnd(videoId, watched)}
      autoPlay={autoplay}
      controls
      width="100%"
      playsInline
      id="video-item"
    >
      <source
        src={`${videoUrl}#t=${
          videoProgress.position > 0 ? videoProgress.position : ""
        }`}
        type="video/mp4"
        id="video-source"
      />
      {videoSubtitles && <Subtitles subtitles={videoSubtitles} />}
    </video>
  );
};

export default VideoPlayer;
