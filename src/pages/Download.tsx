import iconRescan from "/img/icon-rescan.svg";
import iconDownload from "/img/icon-download.svg";
import iconAdd from "/img/icon-add.svg";
import iconSubstract from "/img/icon-substract.svg";
import iconGridView from "/img/icon-gridview.svg";
import iconListView from "/img/icon-listview.svg";
import { Fragment, useEffect, useState } from "react";
import { useLoaderData, useOutletContext } from "react-router-dom";
import updateUserConfig, {
  UserConfigType,
} from "../api/actions/updateUserConfig";
import { ConfigType, ViewLayout } from "./Home";
import loadDownloadQueue from "../api/loader/loadDownloadQueue";
import { OutletContextType } from "./Base";
import Pagination, { PaginationType } from "../components/Pagination";
import {
  ViewStyleNames,
  ViewStyles,
} from "../configuration/constants/ViewStyle";
import updateDownloadQueue from "../api/actions/updateDownloadQueue";
import updateTaskByName from "../api/actions/updateTaskByName";
import Notifications from "../components/Notifications";
import ScrollToTopOnNavigate from "../components/ScrollToTop";
import { Helmet } from "react-helmet";
import Button from "../components/Button";
import DownloadListItem from "../components/DownloadListItem";

type ChannelAggType = {
  id: string;
  name: string;
  count: number;
};

type ChannelAggsType = ChannelAggType[];

type Download = {
  auto_start: boolean;
  channel_id: string;
  channel_indexed: boolean;
  channel_name: string;
  duration: string;
  message?: string;
  published: string;
  status: string;
  timestamp: number;
  title: string;
  vid_thumb_url: string;
  vid_type: string;
  youtube_id: string;
  _index: string;
  _score: number;
};

export type DownloadResponseType = {
  data?: Download[];
  config?: ConfigType;
  paginate?: PaginationType;
};

type DownloadLoaderDataType = {
  userConfig: UserConfigType;
};

const Download = () => {
  const { userConfig } = useLoaderData() as DownloadLoaderDataType;
  const [currentPage, setCurrentPage] = useOutletContext() as OutletContextType;

  const searchParams = new URLSearchParams(location.search);
  const channelFilterFromUrl = searchParams.get("channel");

  const [view, setView] = useState<ViewLayout>(
    userConfig.view_style_downloads || "grid",
  );
  const [gridItems, setGridItems] = useState(userConfig.grid_items || 3);
  const [showIgnored, setShowIgnored] = useState(
    userConfig.show_ignored_only || false,
  );
  const [refresh, setRefresh] = useState(false);
  const [showHiddenForm, setShowHiddenForm] = useState(false);
  const [downloadPending, setDownloadPending] = useState(false);
  const [rescanPending, setRescanPending] = useState(false);

  const [downloadQueueText, setDownloadQueueText] = useState("");

  const [downloadResponse, setDownloadResponse] =
    useState<DownloadResponseType>();

  const downloadList = downloadResponse?.data;
  const pagination = downloadResponse?.paginate;

  const downloadCount = pagination?.total_hits;

  const channel_filter_name =
    downloadResponse?.data?.length && downloadResponse?.data?.length > 0
      ? downloadResponse?.data[0].channel_name
      : "";

  const channel_agg_list: ChannelAggsType = [];

  const isGridView = view === ViewStyles.grid;
  const gridView = isGridView ? `boxed-${gridItems}` : "";
  const gridViewGrid = isGridView ? `grid-${gridItems}` : "";

  useEffect(() => {
    (async () => {
      if (
        userConfig.show_ignored_only !== showIgnored ||
        userConfig.view_style_downloads !== view ||
        userConfig.grid_items !== gridItems
      ) {
        const userConfig: UserConfigType = {
          show_ignored_only: showIgnored,
          [ViewStyleNames.downloads]: view,
          grid_items: gridItems,
        };

        await updateUserConfig(userConfig);
        setRefresh(true);
      }
    })();
  }, [
    view,
    gridItems,
    showIgnored,
    userConfig.show_ignored_only,
    userConfig.view_style_downloads,
    userConfig.grid_items,
  ]);

  useEffect(() => {
    (async () => {
      if (
        refresh ||
        pagination?.current_page === undefined ||
        currentPage !== pagination?.current_page
      ) {
        const videos = await loadDownloadQueue(
          currentPage,
          channelFilterFromUrl,
          showIgnored,
        );

        setDownloadResponse(videos);
        setRefresh(false);
      }
    })();

    // Do not add showIgnored otherwise it will not update the userconfig first.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, currentPage, downloadPending]);

  return (
    <>
      <Helmet>
        <title>TA | Downloads</title>
      </Helmet>
      <ScrollToTopOnNavigate />
      <div className="boxed-content">
        <div className="title-bar">
          <h1>
            Downloads {channelFilterFromUrl && ` for ${channel_filter_name}`}
          </h1>
        </div>
        <Notifications
          pageName="download"
          update={rescanPending || downloadPending}
          setShouldRefresh={(isDone) => {
            if (!isDone) {
              setRescanPending(false);
              setDownloadPending(false);
              setRefresh(true);
            }
          }}
        />
        <div id="downloadControl"></div>
        <div className="info-box info-box-3">
          <div className="icon-text">
            <img
              id="rescan-icon"
              className={rescanPending ? "rotate-img" : ""}
              onClick={async () => {
                setRescanPending(!rescanPending);
                await updateTaskByName("update_subscribed");
              }}
              src={iconRescan}
              alt="rescan-icon"
            />
            <p>Rescan subscriptions</p>
          </div>
          <div className="icon-text">
            <img
              id="download-icon"
              className={downloadPending ? "bounce-img" : ""}
              onClick={async () => {
                setDownloadPending(!downloadPending);
                await updateTaskByName("download_pending");
              }}
              src={iconDownload}
              alt="download-icon"
            />
            <p>Start download</p>
          </div>
          <div className="icon-text">
            <img
              className={showHiddenForm ? "pulse-img" : ""}
              onClick={() => {
                setShowHiddenForm(!showHiddenForm);
              }}
              src={iconAdd}
              alt="add-icon"
            />
            <p>Add to download queue</p>

            {showHiddenForm && (
              <div className="show-form">
                <div>
                  <textarea
                    value={downloadQueueText}
                    onChange={(e) => setDownloadQueueText(e.target.value)}
                    cols={40}
                    rows={4}
                    placeholder="Enter at least one video, channel or playlist id/URL here..."
                  />
                  <Button
                    label="Add to queue"
                    onClick={async () => {
                      await updateDownloadQueue(downloadQueueText, false);
                      setRefresh(true);
                      setShowHiddenForm(false);
                    }}
                  />{" "}
                  <Button
                    label="Download now"
                    onClick={async () => {
                      await updateDownloadQueue(downloadQueueText, true);
                      setRefresh(true);
                      setShowHiddenForm(false);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="view-controls three">
          <div className="toggle">
            <span>Show only ignored videos:</span>
            <div className="toggleBox">
              <input
                id="showIgnored"
                onChange={() => {
                  setShowIgnored(!showIgnored);
                }}
                type="checkbox"
                checked={showIgnored}
              />
              {!showIgnored && (
                <label htmlFor="" className="ofbtn">
                  Off
                </label>
              )}
              {showIgnored && (
                <label htmlFor="" className="onbtn">
                  On
                </label>
              )}
            </div>
          </div>
          <div className="view-icons">
            {channel_agg_list.length > 1 && (
              <select
                name="channel_filter"
                id="channel_filter"
                onchange="channelFilterDownload(this.value)"
              >
                <option value="all" selected={!channelFilterFromUrl}>
                  all
                </option>
                {channel_agg_list.map((channel, index) => {
                  return (
                    <option
                      key={index}
                      selected={channelFilterFromUrl == channel.id}
                      value={channel.id}
                    >
                      {channel.name} ({channel.count})
                    </option>
                  );
                })}
              </select>
            )}

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
              alt="grid view"
            />
            <img
              src={iconListView}
              onClick={() => {
                setView("list");
              }}
              alt="list view"
            />
          </div>
        </div>
        <h3>
          Total videos in queue: {downloadCount}
          {downloadCount == 10000 && "+"}{" "}
          {channelFilterFromUrl && (
            <>
              {" - from channel "}
              <i>{channel_filter_name}</i>
            </>
          )}
        </h3>
      </div>

      <div className={`boxed-content ${gridView}`}>
        <div className={`video-list ${view} ${gridViewGrid}`}>
          {downloadList &&
            downloadList?.map((download, index) => {
              return (
                <Fragment key={index}>
                  <DownloadListItem
                    download={download}
                    view={view}
                    showIgnored={showIgnored}
                    setRefresh={setRefresh}
                  />
                </Fragment>
              );
            })}
        </div>
      </div>

      <div className="boxed-content">
        {pagination && (
          <Pagination pagination={pagination} setPage={setCurrentPage} />
        )}
      </div>
    </>
  );
};

export default Download;
