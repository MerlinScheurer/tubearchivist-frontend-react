import { Link } from "react-router-dom";
import Routes from "../configuration/routes/RouteList";
import { VideoType, ViewLayout } from "../pages/Home";
import iconPlay from "/img/icon-play.svg";
import iconSeen from "/img/icon-seen.svg";
import iconUnseen from "/img/icon-unseen.svg";
import defaultVideoThumb from "/img/default-video-thumb.jpg";
import updateWatchedState from "../api/actions/updateWatchedState";
import formatDate from "./formatDates";

type VideoListProps = {
  videoList: VideoType[] | undefined;
  viewLayout: ViewLayout;
  refreshVideoList: (refresh: boolean) => void;
};

const VideoList = ({
  videoList,
  viewLayout,
  refreshVideoList,
}: VideoListProps) => {
  if (!videoList || videoList.length === 0) {
    return <p>No videos found.</p>;
  }

  return (
    <>
      {videoList.map((video, index) => {
        return (
          <div key={index} className={`video-item ${viewLayout}`}>
            <Link to={video.youtube_id}>
              <div className={`video-thumb-wrap ${viewLayout}`}>
                <div className="video-thumb">
                  <picture>
                    <img src={video.vid_thumb_url} alt="video-thumb" />
                    <source srcSet={defaultVideoThumb} />
                  </picture>

                  {video.player.progress && (
                    <div
                      className="video-progress-bar"
                      id={`progress-${video.youtube_id}`}
                      style={{
                        width: `${video.player.progress}%`,
                      }}
                    ></div>
                  )}
                  {!video.player.progress && (
                    <div
                      className="video-progress-bar"
                      id={`progress-${video.youtube_id}`}
                      style={{ width: "0%" }}
                    ></div>
                  )}
                </div>
                <div className="video-play">
                  <img src={iconPlay} alt="play-icon" />
                </div>
              </div>
            </Link>
            <div className={`video-desc ${viewLayout}`}>
              <div
                className="video-desc-player"
                id={`video-info-${video.youtube_id}`}
              >
                {video.player.watched && (
                  <img
                    src={iconSeen}
                    alt="seen-icon"
                    data-id={video.youtube_id}
                    data-status="watched"
                    onClick={async () => {
                      await updateWatchedState({
                        id: video.youtube_id,
                        is_watched: false,
                      });

                      refreshVideoList(true);
                    }}
                    className="watch-button"
                    title="Mark as unwatched"
                  />
                )}
                {!video.player.watched && (
                  <img
                    src={iconUnseen}
                    alt="unseen-icon"
                    data-id={video.youtube_id}
                    data-status="unwatched"
                    onClick={async () => {
                      await updateWatchedState({
                        id: video.youtube_id,
                        is_watched: true,
                      });

                      refreshVideoList(true);
                    }}
                    className="watch-button"
                    title="Mark as watched"
                  />
                )}
                <span>
                  {formatDate(video.published)} | {video.player.duration_str}
                </span>
              </div>
              <div>
                <Link to={Routes.Channel(video.channel.channel_id)}>
                  <h3>{video.channel.channel_name}</h3>
                </Link>
                <Link
                  className="video-more"
                  to={Routes.Video(video.youtube_id)}
                >
                  <h2>{video.title}</h2>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default VideoList;
