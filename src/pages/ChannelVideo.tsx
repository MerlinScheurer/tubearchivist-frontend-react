import { useEffect, useState } from "react";
import {
  Link,
  useLoaderData,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { SortBy, SortOrder, VideoResponseType, ViewLayout } from "./Home";
import { OutletContextType } from "./Base";
import { UserConfigType } from "../api/actions/updateUserConfig";
import VideoList from "../components/VideoList";
import Routes from "../configuration/routes/RouteList";
import Pagination from "../components/Pagination";
import loadChannelVideosById from "../api/loader/loadChannelVideosById";
import Filterbar from "../components/Filterbar";
import { ViewStyleNames } from "../configuration/constants/ViewStyle";
import ChannelOverview from "../components/ChannelOverview";
import getIsAdmin from "../components/getIsAdmin";
import loadChannelById from "../api/loader/loadChannelById";
import { ChannelResponseType } from "./ChannelBase";

type ChannelParams = {
  channelId: string;
};

type ChannelVideoDataType = {
  userConfig: UserConfigType;
};

function ChannelVideo() {
  const { channelId } = useParams() as ChannelParams;
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
  const [refresh, setRefresh] = useState(false);

  const [channelResponse, setChannelResponse] = useState<ChannelResponseType>();
  const [videoResponse, setVideoReponse] = useState<VideoResponseType>({
    data: [],
    paginate: { current_page: 0 },
  });

  const channel = channelResponse?.data;
  const videoList = videoResponse?.data;
  const pagination = videoResponse?.paginate;

  const hasVideos = videoResponse?.data?.length !== 0;

  const isGridView = view === "grid";
  const gridView = isGridView ? `boxed-${gridItems}` : "";
  const gridViewGrid = isGridView ? `grid-${gridItems}` : "";

  useEffect(() => {
    (async () => {
      const channelResponse = await loadChannelById(channelId);
      const videos = await loadChannelVideosById(channelId, currentPage);

      setChannelResponse(channelResponse);
      setVideoReponse(videos);
      setRefresh(false);
    })();
  }, [refresh, currentPage, channelId]);

  const aggs = false;
  const isAdmin = getIsAdmin();

  if (!channel) {
    return "Channel not found!";
  }

  return (
    <>
      <div className="boxed-content">
        <div className="info-box info-box-2">
          <ChannelOverview
            channelId={channel.channel_id}
            channelname={channel.channel_name}
            channelSubs={channel.channel_subs}
            channelSubscribed={channel.channel_subscribed}
            showSubscribeButton={true}
            isUserAdmin={isAdmin}
            setRefresh={setRefresh}
          />
          <div className="info-box-item">
            {aggs && (
              <>
                <p>
                  {aggs.total_items.value} videos{" "}
                  <span className="space-carrot">|</span>{" "}
                  {aggs.total_duration.value_str} playback{" "}
                  <span className="space-carrot">|</span> Total size{" "}
                  {aggs.total_size.value}
                </p>
                <div className="button-box">
                  <button
                    title={`Mark all videos from ${channel.channel_name} as watched`}
                    type="button"
                    id="watched-button"
                    data-id="{{ channel_info.channel_id }}"
                    onclick="isWatchedButton(this)"
                  >
                    Mark as watched
                  </button>
                  <button
                    title={`Mark all videos from ${channel.channel_name} as unwatched`}
                    type="button"
                    id="unwatched-button"
                    data-id="{{ channel_info.channel_id }}"
                    onclick="isUnwatchedButton(this)"
                  >
                    Mark as unwatched
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
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
          setRefresh={setRefresh}
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
            refreshVideoList={setRefresh}
          />
        </div>
      </div>

      {pagination && (
        <div className="boxed-content">
          <Pagination pagination={pagination} setPage={setCurrentPage} />
        </div>
      )}
    </>
  );
}

export default ChannelVideo;
