import { useEffect, useState } from "react";
import {
  Link,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import Routes from "../configuration/routes/RouteList";
import Pagination, { PaginationType } from "../components/Pagination";
import loadVideoListByPage from "../api/loader/loadVideoListByPage";
import { UserConfigType } from "../api/actions/updateUserConfig";
import VideoList from "../components/VideoList";
import { ChannelType } from "./Channels";
import { OutletContextType } from "./Base";
import Filterbar from "../components/Filterbar";
import {
  ViewStyleNames,
  ViewStyles,
} from "../configuration/constants/ViewStyle";
import ScrollToTopOnNavigate from "../components/ScrollToTop";
import EmbeddableVideoPlayer from "../components/EmbeddableVideoPlayer";
import { Helmet } from "react-helmet";

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

export type StreamType = {
  type: string;
  index: number;
  codec: string;
  width?: number;
  height?: number;
  bitrate: number;
};

export type Subtitles = {
  ext: string;
  url: string;
  name: string;
  lang: string;
  source: string;
  media_url: string;
};

export type VideoType = {
  active: boolean;
  category: string[];
  channel: ChannelType;
  date_downloaded: number;
  description: string;
  comment_count?: number;
  media_size: number;
  media_url: string;
  player: PlayerType;
  published: string;
  stats: StatsType;
  streams: StreamType[];
  subtitles: Subtitles[];
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

type ContinueVidsType = VideoType[];

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
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("videoId");

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
  const showEmbeddedVideo = videoId !== null;

  const continue_vids: ContinueVidsType = [];

  const isGridView = view === ViewStyles.grid;
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
      <Helmet>
        <title>TubeArchivist</title>
      </Helmet>
      <ScrollToTopOnNavigate />
      <div className={`boxed-content ${gridView}`}>
        {continue_vids.length > 0 && (
          <>
            <div className="title-bar">
              <h1>Continue Watching</h1>
            </div>
            <div className={`video-list ${view} ${gridViewGrid}`}>
              <VideoList
                videoList={continue_vids}
                viewLayout={view}
                refreshVideoList={setRefreshVideoList}
              />
            </div>
          </>
        )}

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
      </div>

      {showEmbeddedVideo && <EmbeddableVideoPlayer videoId={videoId} />}

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

          {hasVideos && (
            <VideoList
              videoList={videoList}
              viewLayout={view}
              refreshVideoList={setRefreshVideoList}
            />
          )}
        </div>
      </div>

      {pagination && (
        <div className="boxed-content">
          <Pagination pagination={pagination} setPage={setCurrentPage} />
        </div>
      )}
    </>
  );
};

export default Home;
