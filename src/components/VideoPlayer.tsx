import updateVideoProgressById from "../api/actions/updateVideoProgressById";
import updateWatchedState from "../api/actions/updateWatchedState";
import {
  SponsorBlockSegmentType,
  SponsorBlockType,
  SponsorSegmentsSkippedType,
  VideoResponseType,
} from "../pages/Video";
import watchedThreshold from "../functions/watchedThreshold";

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
  return subtitles.map((subtitle: Subtitle, index) => {
    let label = subtitle.name;

    if (subtitle.source === "auto") {
      label += " - auto";
    }

    return (
      <track
        key={index}
        label={label}
        kind="subtitles"
        srcLang={subtitle.lang}
        src={subtitle.media_url}
      />
    );
  });
};

const handleTimeUpdate =
  (
    youtubeId: string,
    duration: number,
    watched: boolean,
    sponsorBlock?: SponsorBlockType,
    setSponsorSegmentSkipped?: (fn: unknown) => void,
  ) =>
  async (videoTag) => {
    const currentTime = Number(videoTag.target.currentTime);

    if (sponsorBlock && sponsorBlock.segments) {
      sponsorBlock.segments.forEach((segment: SponsorBlockSegmentType) => {
        const [from, to] = segment.segment;

        if (currentTime >= from && currentTime <= from + 0.3) {
          videoTag.target.currentTime = to;

          setSponsorSegmentSkipped?.((segments: SponsorSegmentsSkippedType) => {
            return { ...segments, [segment.UUID]: { from, to } };
          });
        }

        if (currentTime > to + 10) {
          setSponsorSegmentSkipped?.((segments: SponsorSegmentsSkippedType) => {
            return { ...segments, [segment.UUID]: { from: 0, to: 0 } };
          });
        }
      });
    }

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
  (
    youtubeId: string,
    watched: boolean,
    setSponsorSegmentSkipped?: (skipped: SponsorSegmentSkippedType) => void,
  ) =>
  async (videoTag) => {
    if (!watched) {
      // Check if video is already marked as watched
      await updateWatchedState({ id: youtubeId, is_watched: true });
    }

    setSponsorSegmentSkipped?.((segments: SponsorSegmentsSkippedType) => {
      const keys = Object.keys(segments);

      keys.forEach((uuid) => {
        segments[uuid] = { from: 0, to: 0 };
      });

      return segments;
    });
  };

export type VideoProgressType = {
  youtube_id: string;
  user_id: number;
  position: number;
};

type VideoPlayerProps = {
  video: VideoResponseType;
  videoProgress?: VideoProgressType;
  sponsorBlock?: SponsorBlockType;
  setSponsorSegmentSkipped?: (skipped: SponsorSegmentSkippedType) => void;
};

const VideoPlayer = ({
  video,
  videoProgress,
  sponsorBlock,
  setSponsorSegmentSkipped,
}: VideoPlayerProps) => {
  const videoId = video.data.youtube_id;
  const videoUrl = video.data.media_url;
  const videoThumbUrl = video.data.vid_thumb_url;
  const watched = video.data.player.watched;
  const duration = video.data.player.duration;
  const videoSubtitles = video.data.subtitles;

  const autoplay = false;

  return (
    <video
      poster={videoThumbUrl}
      onVolumeChange={(videoTag) => {
        localStorage.setItem("playerVolume", videoTag.target.volume);
      }}
      onLoadStart={(videoTag) => {
        videoTag.target.volume = localStorage.getItem("playerVolume") ?? 1;
      }}
      onTimeUpdate={handleTimeUpdate(
        videoId,
        duration,
        watched,
        sponsorBlock,
        setSponsorSegmentSkipped,
      )}
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
          Number(videoProgress?.position) > 0
            ? Number(videoProgress?.position)
            : ""
        }`}
        type="video/mp4"
        id="video-source"
      />
      {videoSubtitles && <Subtitles subtitles={videoSubtitles} />}
    </video>
  );
};

export default VideoPlayer;
