import { useEffect, useState } from "react";
import { Link, useLoaderData, useOutletContext } from "react-router-dom";
import Routes from "../configuration/routes/RouteList";

import Pagination, { PaginationType } from "../components/Pagination";
import loadVideoListByPage from "../api/loader/loadVideoListByPage";
import { UserConfigType } from "../api/actions/updateUserConfig";
import VideoList from "../components/VideoList";
import { ChannelType } from "./Channels";
import { OutletContextType } from "./Base";
import Filterbar from "../components/Filterbar";
import { ViewStyleNames } from "../configuration/constants/ViewStyle";

/*

{% if continue_vids %}
        <div className="title-bar">
            <h1>Continue Watching</h1>
        </div>
        <div className="video-list {{ view_style }} {% if view_style == "grid" %}grid-{{ grid_items }}{% endif %}">
            {% for video in continue_vids %}
                <div className="video-item {{ view_style }}">
                    <a href="#player" data-id="{{ video.youtube_id }}" onclick="createPlayer(this)">
                        <div className="video-thumb-wrap {{ view_style }}">
                            <div className="video-thumb">
                                <img src="{{ video.vid_thumb_url }}" alt="video-thumb">
                                {% if video.player.progress %}
                                    <div className="video-progress-bar" id="progress-{{ video.youtube_id }}" style="width: {{video.player.progress}}%;"></div>
                                {% else %}
                                    <div className="video-progress-bar" id="progress-{{ video.youtube_id }}" style="width: 0%;"></div>
                                {% endif %}
                            </div>
                            <div className="video-play">
                                <img src="{% static 'img/icon-play.svg' %}" alt="play-icon">
                            </div>
                        </div>
                    </a>
                    <div className="video-desc {{ view_style }}">
                        <div className="video-desc-player" id="video-info-{{ video.youtube_id }}">
                            {% if video.player.watched %}
                                <img src="{% static 'img/icon-seen.svg' %}" alt="seen-icon" data-id="{{ video.youtube_id }}" data-status="watched" onclick="updateVideoWatchStatus(this)" className="watch-button" title="Mark as unwatched">
                            {% else %}
                                <img src="{% static 'img/icon-unseen.svg' %}" alt="unseen-icon" data-id="{{ video.youtube_id }}" data-status="unwatched" onclick="updateVideoWatchStatus(this)" className="watch-button" title="Mark as watched">
                            {% endif %}
                            <span>{{ video.published }} | {{ video.player.duration_str }}</span>
                        </div>
                        <div>
                            <a href="{% url 'channel_id' video.channel.channel_id %}"><h3>{{ video.channel.channel_name }}</h3></a>
                            <a className="video-more" href="{% url 'video' video.youtube_id %}"><h2>{{ video.title }}</h2></a>
                        </div>
                    </div>
                </div>
            {% endfor %}
        </div>
    {% endif %}


*/

export type PlayerType = {
  watched: boolean;
  duration: number;
  duration_str: string;
  progress: number;
};

export type StatsType = {
  view_count: number;
  like_count: number;
  dislike_count: number;
  average_rating: number;
};

export type VideoType = {
  active: boolean;
  category: string[];
  channel: ChannelType;
  date_downloaded: number;
  description: string;
  media_size: number;
  media_url: string;
  player: PlayerType;
  published: string;
  stats: StatsType;
  streams: [];
  tags: string[];
  title: string;
  vid_last_refresh: string;
  vid_thumb_base64: boolean;
  vid_thumb_url: string;
  vid_type: string;
  youtube_id: string;
};

export type DownloadsType = {
  limit_speed: boolean;
  sleep_interval: number;
  autodelete_days: boolean;
  format: boolean;
  format_sort: boolean;
  add_metadata: boolean;
  add_thumbnail: boolean;
  subtitle: boolean;
  subtitle_source: boolean;
  subtitle_index: boolean;
  comment_max: boolean;
  comment_sort: string;
  cookie_import: boolean;
  throttledratelimit: boolean;
  extractor_lang: boolean;
  integrate_ryd: boolean;
  integrate_sponsorblock: boolean;
};

export type ConfigType = {
  enable_cast: boolean;
  downloads: DownloadsType;
};

export type VideoResponseType = {
  data?: VideoType[];
  config?: ConfigType;
  paginate?: PaginationType;
};

type HomeLoaderDataType = {
  userConfig: UserConfigType;
};

export type SortBy =
  | "published"
  | "downloaded"
  | "views"
  | "likes"
  | "duration"
  | "filesize";
export type SortOrder = "asc" | "desc";
export type ViewLayout = "grid" | "list";

const Home = () => {
  const { userConfig } = useLoaderData() as HomeLoaderDataType;
  const [currentPage, setCurrentPage] = useOutletContext() as OutletContextType;

  const [hideWatched, setHideWatched] = useState(
    userConfig.hide_watched || false,
  );
  const [sortBy, setSortBy] = useState<SortBy>(
    userConfig.sort_by || "published",
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    userConfig.sort_order || "asc",
  );
  const [view, setView] = useState<ViewLayout>(
    userConfig.view_style_home || "grid",
  );
  const [gridItems, setGridItems] = useState(userConfig.grid_items || 3);
  const [showHidden, setShowHidden] = useState(false);
  const [refreshVideoList, setRefreshVideoList] = useState(false);

  const [videoResponse, setVideoReponse] = useState<VideoResponseType>({
    data: [],
    paginate: { current_page: 0 },
  });

  const videoList = videoResponse.data;
  const pagination = videoResponse.paginate;

  const hasVideos = videoResponse?.data?.length !== 0;

  const isGridView = view === "grid";
  const gridView = isGridView ? `boxed-${gridItems}` : "";
  const gridViewGrid = isGridView ? `grid-${gridItems}` : "";

  useEffect(() => {
    (async () => {
      const videos = await loadVideoListByPage(currentPage);

      setVideoReponse(videos);
      setRefreshVideoList(false);
    })();
  }, [refreshVideoList, currentPage]);

  return (
    <>
      <div className={`boxed-content ${gridView}`}>
        {/** continue vids */}
        <div className="title-bar">
          <h1>Recent Videos</h1>
        </div>

        <Filterbar
          hideToggleText="Hide watched:"
          showHidden={showHidden}
          hideWatched={hideWatched}
          isGridView={isGridView}
          view={view}
          gridItems={gridItems}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setShowHidden={setShowHidden}
          setHideWatched={setHideWatched}
          setView={setView}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
          setGridItems={setGridItems}
          viewStyleName={ViewStyleNames.home}
          setRefresh={setRefreshVideoList}
        />

        <div id="player" className="player-wrapper"></div>
      </div>

      <div className={`boxed-content ${gridView}`}>
        <div className={`video-list ${view} ${gridViewGrid}`}>
          {!hasVideos && (
            <>
              <h2>No videos found...</h2>
              <p>
                If you've already added a channel or playlist, try going to the{" "}
                <Link to={Routes.Downloads}>downloads page</Link> to start the
                scan and download tasks.
              </p>
            </>
          )}

          <VideoList
            videoList={videoList}
            viewLayout={view}
            refreshVideoList={setRefreshVideoList}
          />
        </div>
      </div>

      <div className="boxed-content">
        <Pagination pagination={pagination} setPage={setCurrentPage} />
      </div>
    </>
  );
};

export default Home;
