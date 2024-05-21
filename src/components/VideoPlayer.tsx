import updateVideoProgressById from "../api/actions/updateVideoProgressById";
import updateWatchedState from "../api/actions/updateWatchedState";
import {
  SponsorBlockSegmentType,
  SponsorBlockType,
  VideoResponseType,
} from "../pages/Video";
import watchedThreshold from "../functions/watchedThreshold";
import Notifications from "./Notifications";
import { useState } from "react";
import formatTime from "../functions/formatTime";

export type SkippedSegmentType = {
  from: number;
  to: number;
};

export type SponsorSegmentsSkippedType = Record<string, SkippedSegmentType>;

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
    setSponsorSegmentSkipped?: (skipped: SponsorSegmentsSkippedType) => void,
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
  embed?: boolean;
};

const VideoPlayer = ({
  video,
  videoProgress,
  sponsorBlock,
  embed,
}: VideoPlayerProps) => {
  const [skippedSegments, setSkippedSegments] =
    useState<SponsorSegmentsSkippedType>({});

  const videoId = video.data.youtube_id;
  const videoUrl = video.data.media_url;
  const videoThumbUrl = video.data.vid_thumb_url;
  const watched = video.data.player.watched;
  const duration = video.data.player.duration;
  const videoSubtitles = video.data.subtitles;

  const autoplay = false;

  return (
    <>
      <div id="player" className={embed ? "" : "player-wrapper"}>
        <div className={embed ? "" : "video-main"}>
          <video
            poster={videoThumbUrl}
            onVolumeChange={(videoTag) => {
              localStorage.setItem("playerVolume", videoTag.target.volume);
            }}
            onLoadStart={(videoTag) => {
              videoTag.target.volume =
                localStorage.getItem("playerVolume") ?? 1;
            }}
            onTimeUpdate={handleTimeUpdate(
              videoId,
              duration,
              watched,
              sponsorBlock,
              setSkippedSegments,
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
        </div>
      </div>

      <Notifications pageName="all" />
      <div className="sponsorblock" id="sponsorblock">
        {sponsorBlock?.is_enabled && (
          <>
            {sponsorBlock.segments.length == 0 && (
              <h4>
                This video doesn't have any sponsor segments added. To add a
                segment go to{" "}
                <u>
                  <a href={`https://www.youtube.com/watch?v=${videoId}`}>
                    this video on YouTube
                  </a>
                </u>{" "}
                and add a segment using the{" "}
                <u>
                  <a href="https://sponsor.ajay.app/">SponsorBlock</a>
                </u>{" "}
                extension.
              </h4>
            )}
            {sponsorBlock.has_unlocked && (
              <h4>
                This video has unlocked sponsor segments. Go to{" "}
                <u>
                  <a href={`https://www.youtube.com/watch?v=${videoId}`}>
                    this video on YouTube
                  </a>
                </u>{" "}
                and vote on the segments using the{" "}
                <u>
                  <a href="https://sponsor.ajay.app/">SponsorBlock</a>
                </u>{" "}
                extension.
              </h4>
            )}

            {Object.values(skippedSegments).map(({ from, to }) => {
              return (
                <>
                  {from !== 0 && to !== 0 && (
                    <h3>
                      Skipped sponsor segment from {formatTime(from)} to{" "}
                      {formatTime(to)}.
                    </h3>
                  )}
                </>
              );
            })}
          </>
        )}
      </div>
    </>
  );
};

export default VideoPlayer;
