import { useEffect, useState } from "react";
import {
  Link,
  useLoaderData,
  useOutletContext,
  useParams,
} from "react-router-dom";

import iconSort from "/img/icon-sort.svg";
import iconAdd from "/img/icon-add.svg";
import iconSubstract from "/img/icon-substract.svg";
import iconGridView from "/img/icon-gridview.svg";
import iconListView from "/img/icon-listview.svg";

import { SortBy, SortOrder, VideoResponseType, ViewLayout } from "./Home";
import { OutletContextType } from "./Base";
import updateUserConfig, {
  UserConfigType,
} from "../api/actions/updateUserConfig";
import VideoOverview from "../components/VideoOverview";
import Routes from "../configuration/routes/RouteList";
import Pagination from "../components/Pagination";
import loadChannelVideosById from "../api/loader/loadChannelVideosById";

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
        <div className="view-controls three">
          <div className="toggle">
            <span>Hide watched videos:</span>
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
}

export default ChannelVideo;
