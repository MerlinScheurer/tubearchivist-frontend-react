import { Link, useNavigate, useParams } from "react-router-dom";
import loadVideoById from "../api/loader/loadVideoById";
import { useEffect, useState } from "react";
import { ConfigType, VideoType } from "./Home";
import VideoPlayer, { VideoProgressType } from "../components/VideoPlayer";
import iconUnseen from "/img/icon-unseen.svg";
import iconSeen from "/img/icon-seen.svg";
import iconEye from "/img/icon-eye.svg";
import iconThumb from "/img/icon-thumb.svg";
import iconStarFull from "/img/icon-star-full.svg";
import iconStarEmpty from "/img/icon-star-empty.svg";
import iconStarHalf from "/img/icon-star-half.svg";
import Routes from "../configuration/routes/RouteList";
import Linkify from "../components/Linkify";
import loadSimmilarVideosById from "../api/loader/loadSimmilarVideosById";
import VideoList from "../components/VideoList";
import updateWatchedState from "../api/actions/updateWatchedState";
import humanFileSize from "../functions/humanFileSize";
import ScrollToTopOnNavigate from "../components/ScrollToTop";
import loadVideoProgressById from "../api/loader/loadVideoProgressById";
import getIsAdmin from "../functions/getIsAdmin";
import ChannelOverview from "../components/ChannelOverview";
import deleteVideo from "../api/actions/deleteVideo";
import capitalizeFirstLetter from "../functions/capitalizeFirstLetter";
import formatDate from "../functions/formatDates";
import formatNumbers from "../functions/formatNumbers";
import queueReindex from "../api/actions/queueReindex";
import loadSponsorblockByVideoId from "../api/loader/loadSponsorblockByVideoId";
import Notifications from "../components/Notifications";
import formatTime from "../functions/formatTime";

type VideoParams = {
  videoId: string;
};

type PlaylistNavType = {};

export type SkippedSegmentType = {
  from: number;
  to: number;
};

export type SponsorSegmentsSkippedType = Record<string, SkippedSegmentType>;

export type SponsorBlockSegmentType = {
  category: string;
  actionType: string;
  segment: number[];
  UUID: string;
  videoDuration: number;
  locked: number;
  votes: number;
};

export type SponsorBlockType = {
  last_refresh: number;
  has_unlocked: boolean;
  is_enabled: boolean;
  segments: SponsorBlockSegmentType[];
};

export type SimilarVideoResponseType = {
  data: VideoType;
  config: ConfigType;
};

export type VideoResponseType = {
  data: VideoType;
  config: ConfigType;
  playlist_nav: PlaylistNavType;
};

const Video = () => {
  const { videoId } = useParams() as VideoParams;
  const navigate = useNavigate();

  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [watched, setWatched] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [refreshVideoList, setRefreshVideoList] = useState(false);
  const [reindex, setReindex] = useState(false);
  const [skippedSegments, setSkippedSegments] =
    useState<SponsorSegmentsSkippedType>({});

  const [videoResponse, setVideoResponse] = useState<VideoResponseType>();
  const [simmilarVideos, setSimmilarVideos] =
    useState<SimilarVideoResponseType>();
  const [videoProgress, setVideoProgress] = useState<VideoProgressType>();
  const [sponsorblockResponse, setSponsorblockResponse] =
    useState<SponsorBlockType>();

  useEffect(() => {
    (async () => {
      const videoResponse = await loadVideoById(videoId);
      const simmilarVideos = await loadSimmilarVideosById(videoId);
      const videoProgress = await loadVideoProgressById(videoId);
      const sponsorblockReponse = await loadSponsorblockByVideoId(videoId);

      setVideoResponse(videoResponse);
      setSimmilarVideos(simmilarVideos);
      setWatched(videoResponse.data.player.watched);
      setVideoProgress(videoProgress);
      setSponsorblockResponse(sponsorblockReponse);
      setRefreshVideoList(false);
    })();
  }, [videoId, refreshVideoList]);

  if (videoResponse === undefined) {
    return [];
  }

  const video = videoResponse.data;
  const config = videoResponse.config;
  const playlistNav = videoResponse.playlist_nav;
  const sponsorBlock = sponsorblockResponse;

  const cast = false;

  const isAdmin = getIsAdmin();

  return (
    <>
      <ScrollToTopOnNavigate />
      <div id="player" className="player-wrapper">
        <div className="video-main">
          <div className="video-modal">
            <span className="video-modal-text" />
          </div>
          <VideoPlayer
            video={videoResponse}
            videoProgress={videoProgress}
            sponsorBlock={sponsorBlock}
            setSponsorSegmentSkipped={setSkippedSegments}
          />
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
      <div className="boxed-content">
        <div className="title-bar">
          {/* cast && (
            <google-cast-launcher id="castbutton"></google-cast-launcher>
          ) */}
          <h1 id="video-title">{video.title}</h1>
        </div>
        <div className="info-box info-box-3">
          <ChannelOverview
            channelId={video.channel.channel_id}
            channelname={video.channel.channel_name}
            channelSubs={video.channel.channel_subs}
            channelSubscribed={video.channel.channel_subscribed}
            setRefresh={setRefreshVideoList}
          />

          <div className="info-box-item">
            <div>
              <p>Published: {formatDate(video.published)}</p>
              <p>Last refreshed: {formatDate(video.vid_last_refresh)}</p>
              <p className="video-info-watched">
                Watched:
                {watched && (
                  <img
                    src={iconSeen}
                    alt="seen-icon"
                    data-id={video.youtube_id}
                    data-status="watched"
                    onClick={async () => {
                      setWatched(false);

                      await updateWatchedState({
                        id: videoId,
                        is_watched: false,
                      });
                    }}
                    className="watch-button"
                    title="Mark as unwatched"
                  />
                )}
                {!watched && (
                  <img
                    src={iconUnseen}
                    alt="unseen-icon"
                    data-id={video.youtube_id}
                    data-status="unwatched"
                    onClick={async () => {
                      setWatched(true);

                      await updateWatchedState({
                        id: videoId,
                        is_watched: true,
                      });
                    }}
                    className="watch-button"
                    title="Mark as watched"
                  />
                )}
              </p>
              {video.active && (
                <p>
                  Youtube:{" "}
                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtube_id}`}
                    target="_blank"
                  >
                    Active
                  </a>
                </p>
              )}
              {!video.active && <p>Youtube: Deactivated</p>}
            </div>
          </div>
          <div className="info-box-item">
            <div>
              <p className="thumb-icon">
                <img src={iconEye} alt="views" />:{" "}
                {formatNumbers(video.stats.view_count)}
              </p>
              <p className="thumb-icon like">
                <img src={iconThumb} alt="thumbs-up" />:{" "}
                {formatNumbers(video.stats.like_count)}
              </p>
              {video.stats.dislike_count > 0 && (
                <p className="thumb-icon">
                  <img className="dislike" src={iconThumb} alt="thumbs-down" />:{" "}
                  {video.stats.dislike_count}
                </p>
              )}
              {video?.stats && video?.stats?.average_rating && (
                <div className="rating-stars">
                  {video?.stats?.average_rating?.map?.((star, index) => {
                    if (star === "full") {
                      return <img key={index} src={iconStarFull} alt={star} />;
                    }

                    if (star === "half") {
                      return <img key={index} src={iconStarHalf} alt={star} />;
                    }

                    return <img key={index} src={iconStarEmpty} alt={star} />;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="info-box info-box-2">
          <div className="info-box-item">
            <div className="button-box">
              {reindex && <p>Reindex scheduled</p>}
              {!reindex && (
                <>
                  {isAdmin && (
                    <div id="reindex-button" className="button-box">
                      <button
                        title={`Reindex ${video.title}`}
                        onClick={async () => {
                          await queueReindex(video.youtube_id, "video");
                          setReindex(true);
                        }}
                      >
                        Reindex
                      </button>
                    </div>
                  )}
                </>
              )}
              <a download="" href={video.media_url}>
                <button id="download-item">Download File</button>
              </a>{" "}
              {isAdmin && (
                <>
                  {!showDeleteConfirm && (
                    <button
                      onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                      id="delete-item"
                    >
                      Delete Video
                    </button>
                  )}

                  {showDeleteConfirm && (
                    <div className="delete-confirm" id="delete-button">
                      <span>Are you sure? </span>
                      <button
                        className="danger-button"
                        onClick={async () => {
                          await deleteVideo(videoId);
                          navigate(Routes.Channel(video.channel.channel_id));
                        }}
                      >
                        Delete
                      </button>{" "}
                      <button
                        onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </>
              )}
              <button
                id={`${video.youtube_id}-button`}
                data-id={video.youtube_id}
                data-context="video"
                onclick="showAddToPlaylistMenu(this)"
              >
                Add To Playlist
              </button>
            </div>
          </div>
          <div className="info-box-item">
            {video.media_size && (
              <p>File size: {humanFileSize(video.media_size)}</p>
            )}

            {video.streams &&
              video.streams.map((stream, index) => {
                return (
                  <p key={index}>
                    {capitalizeFirstLetter(stream.type)}: {stream.codec}{" "}
                    {humanFileSize(stream.bitrate)}/s
                    {stream.width && (
                      <>
                        <span className="space-carrot">|</span> {stream.width}x
                        {stream.height}
                      </>
                    )}{" "}
                  </p>
                );
              })}
          </div>
        </div>
        {video.tags && video.tags.length > 0 && (
          <div className="description-box">
            <div className="video-tag-box">
              {video.tags.map((tag, index) => {
                return (
                  <span key={index} className="video-tag">
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {video.description && (
          <div className="description-box">
            <p
              id={descriptionExpanded ? "text-expand-expanded" : "text-expand"}
              className="description-text"
            >
              <Linkify>{video.description}</Linkify>
            </p>

            <button
              onClick={() => setDescriptionExpanded(!descriptionExpanded)}
              id="text-expand-button"
            >
              Show more
            </button>
          </div>
        )}

        {playlistNav && (
          <>
            {playlistNav.map((playlistItem, index: number) => {
              <div key={index} className="playlist-wrap">
                <Link
                  to={Routes.Playlist(playlistItem.playlist_meta.playlist_id)}
                >
                  <h3>
                    Playlist [{playlistItem.playlist_meta.current_idx + 1}
                    ]: {playlistItem.playlist_meta.playlist_name}
                  </h3>
                </Link>
                <div className="playlist-nav">
                  <div className="playlist-nav-item">
                    {playlistItem.playlist_previous && (
                      <>
                        <Link
                          to={Routes.Playlist(
                            playlistItem.playlist_previous.youtube_id,
                          )}
                        >
                          <img
                            src={`/cache/${playlistItem.playlist_previous.vid_thumb}`}
                            alt="previous thumbnail"
                          />
                        </Link>
                        <div className="playlist-desc">
                          <p>Previous:</p>
                          <Link
                            to={Routes.Playlist(
                              playlistItem.playlist_previous.youtube_id,
                            )}
                          >
                            <h3>
                              [{playlistItem.playlist_previous.idx + 1}]{" "}
                              {playlistItem.playlist_previous.title}
                            </h3>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="playlist-nav-item">
                    {playlistItem.playlist_next && (
                      <>
                        <div className="playlist-desc">
                          <p>Next:</p>
                          <Link
                            to={Routes.Playlist(
                              playlistItem.playlist_next.youtube_id,
                            )}
                          >
                            <h3>
                              [{playlistItem.playlist_next.idx + 1}]{" "}
                              {playlistItem.playlist_next.title}
                            </h3>
                          </Link>
                        </div>
                        <Link
                          to={Routes.Playlist(
                            playlistItem.playlist_next.youtube_id,
                          )}
                        >
                          <img
                            src={`/cache/${playlistItem.playlist_next.vid_thumb}`}
                            alt="previous thumbnail"
                          />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>;
            })}
          </>
        )}

        <div className="description-box">
          <h3>Similar Videos</h3>
          <div className="video-list grid grid-3" id="similar-videos">
            <VideoList
              videoList={simmilarVideos?.data}
              viewLayout="grid"
              refreshVideoList={setRefreshVideoList}
            />
          </div>
        </div>

        {video.comment_count == 0 && (
          <div className="comments-section">
            <span>Video has no comments</span>
          </div>
        )}

        {video.comment_count && (
          <div className="comments-section">
            <h3>Comments: {video.comment_count}</h3>
            <div id="comments-list" className="comments-list"></div>
            <script>getComments('{video.youtube_id}')</script>
          </div>
        )}
        <div className="boxed-content-empty" />
      </div>
    </>
  );
};

export default Video;
