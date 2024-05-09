import { useEffect, useState } from "react";
import {
  Link,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import Routes from "../configuration/routes/RouteList";

import iconSort from "/img/icon-sort.svg";
import iconAdd from "/img/icon-add.svg";
import iconSubstract from "/img/icon-substract.svg";
import iconGridView from "/img/icon-gridview.svg";
import iconListView from "/img/icon-listview.svg";

import Pagination, { PaginationType } from "../components/Pagination";
import loadVideoListByPage from "../loader/loadVideoListByPage";
import updateUserConfig, { UserConfig } from "../action/updateUserConfig";
import VideoOverview from "../components/VideoOverview";
import { ChannelType } from "./Channels";
import { OutletContextType } from "../Base";

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
  userConfig: UserConfig;
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
    paginate: {},
  });

  const videoList = videoResponse.data;
  const pagination = videoResponse.paginate;

  const hasVideos = videoResponse?.data?.length !== 0;

  const isGridView = view === "grid";
  const gridView = isGridView ? `boxed-${gridItems}` : "";
  const gridViewGrid = isGridView ? `grid-${gridItems}` : "";

  useEffect(() => {
    (async () => {
      const userConfig = {
        hide_watched: hideWatched,
        view_style_home: view,
        grid_items: gridItems,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      await updateUserConfig(userConfig);
    })();
  }, [hideWatched, view, gridItems, sortBy, sortOrder]);

  useEffect(() => {
    (async () => {
      const videos = await loadVideoListByPage(currentPage);

      setVideoReponse(videos);
      setRefreshVideoList(false);
    })();
  }, [
    refreshVideoList,
    currentPage,
    hideWatched,
    view,
    gridItems,
    sortBy,
    sortOrder,
  ]);

  return (
    <>
      <div className={`boxed-content ${gridView}`}>
        {/** continue vids */}
        <div className="title-bar">
          <h1>Recent Videos</h1>
        </div>

        <div className="view-controls three">
          <div className="toggle">
            <span>Hide watched:</span>
            <div className="toggleBox">
              <input
                id="hide_watched"
                type="checkbox"
                checked={hideWatched}
                onChange={() => {
                  setHideWatched(!hideWatched);
                }}
              />

              {!hideWatched && (
                <label htmlFor="" className="ofbtn">
                  Off
                </label>
              )}
              {hideWatched && (
                <label htmlFor="" className="onbtn">
                  On
                </label>
              )}
            </div>
          </div>

          {showHidden && (
            <div className="sort">
              <div id="form">
                <span>Sort by:</span>
                <select
                  name="sort_by"
                  id="sort"
                  value={sortBy}
                  onChange={(event) => {
                    setSortBy(event.target.value as SortBy);
                  }}
                >
                  <option value="published">date published</option>
                  <option value="downloaded">date downloaded</option>
                  <option value="views">views</option>
                  <option value="likes">likes</option>
                  <option value="duration">duration</option>
                  <option value="filesize">file size</option>
                </select>
                <select
                  name="sort_order"
                  id="sort-order"
                  value={sortOrder}
                  onChange={(event) => {
                    setSortOrder(event.target.value as SortOrder);
                  }}
                >
                  <option value="asc">asc</option>
                  <option value="desc">desc</option>
                </select>
              </div>
            </div>
          )}

          <div className="view-icons">
            <img
              src={iconSort}
              alt="sort-icon"
              onClick={() => {
                setShowHidden(!showHidden);
              }}
              id="animate-icon"
            />

            {isGridView && (
              <div className="grid-count">
                {gridItems < 7 && (
                  <img
                    src={iconAdd}
                    onClick={() => {
                      setGridItems(gridItems + 1);
                    }}
                    alt="grid plus row"
                  />
                )}
                {gridItems > 3 && (
                  <img
                    src={iconSubstract}
                    onClick={() => {
                      setGridItems(gridItems - 1);
                    }}
                    alt="grid minus row"
                  />
                )}
              </div>
            )}
            <img
              src={iconGridView}
              onClick={() => {
                setView("grid");
              }}
              data-origin="home"
              data-value="grid"
              alt="grid view"
            />
            <img
              src={iconListView}
              onClick={() => {
                setView("list");
              }}
              data-origin="home"
              data-value="list"
              alt="list view"
            />
          </div>
        </div>

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

          <VideoOverview
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
