import { useEffect, useState } from "react";
import {
  Link,
  useLoaderData,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { SortBy, SortOrder, VideoResponseType, ViewLayout } from "./Home";
import { OutletContextType } from "./Base";
import updateUserConfig, {
  UserConfigType,
} from "../api/actions/updateUserConfig";
import VideoList from "../components/VideoList";
import Routes from "../configuration/routes/RouteList";
import Pagination from "../components/Pagination";
import loadChannelVideosById from "../api/loader/loadChannelVideosById";
import Filterbar from "../components/Filterbar";
import { ViewStyleNames } from "../configuration/constants/ViewStyle";

type ChannelVideoDataType = {
  userConfig: UserConfigType;
};

function ChannelVideo() {
  const { channelId } = useParams();
  const { userConfig } = useLoaderData() as ChannelVideoDataType;
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
      const userConfig = {
        hide_watched: hideWatched,
        view_style_channel: view,
        grid_items: gridItems,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      await updateUserConfig(userConfig);
    })();
  }, [hideWatched, view, gridItems, sortBy, sortOrder]);

  useEffect(() => {
    (async () => {
      const videos = await loadChannelVideosById(channelId, currentPage);

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
    channelId,
  ]);

  return (
    <>
      <div className={`boxed-content ${gridView}`}>
        <Filterbar
          hideToggleText={"Hide watched videos:"}
          view={view}
          isGridView={isGridView}
          hideWatched={hideWatched}
          gridItems={gridItems}
          showHidden={showHidden}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
          setHideWatched={setHideWatched}
          setShowHidden={setShowHidden}
          setView={setView}
          setGridItems={setGridItems}
          viewStyleName={ViewStyleNames.channel}
        />
      </div>

      <div id="player" className="player-wrapper"></div>

      <div className={`boxed-content ${gridView}`}>
        <div className={`video-list ${view} ${gridViewGrid}`}>
          {!hasVideos && (
            <>
              <h2>No videos found...</h2>
              <p>
                Try going to the{" "}
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
}

export default ChannelVideo;
