import iconRescan from "/img/icon-rescan.svg";
import iconDownload from "/img/icon-download.svg";
import iconAdd from "/img/icon-add.svg";
import iconSubstract from "/img/icon-substract.svg";
import iconGridView from "/img/icon-gridview.svg";
import iconListView from "/img/icon-listview.svg";
import { useEffect, useState } from "react";
import { Link, useLoaderData, useOutletContext } from "react-router-dom";
import updateUserConfig, {
  UserConfigType,
} from "../api/actions/updateUserConfig";
import { ConfigType, ViewLayout } from "./Home";
import loadDownloadQueue from "../api/loader/loadDownloadQueue";
import { OutletContextType } from "./Base";
import Pagination, { PaginationType } from "../components/Pagination";
import Routes from "../configuration/routes/RouteList";
import { ViewStyleNames } from "../configuration/constants/ViewStyle";
import updateDownloadQueue from "../api/actions/updateDownloadQueue";
import updateDownloadQueueStatusById from "../api/actions/updateDownloadQueueStatusById";
import deleteDownloadById from "../api/actions/deleteDownloadById";
import updateTaskByName from "../api/actions/updateTaskByName";

type Download = {
  auto_start: boolean;
  channel_id: string;
  channel_indexed: boolean;
  channel_name: string;
  duration: string;
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
  const [refreshDownloadList, setRefreshDownloadList] = useState(false);
  const [showHiddenForm, setShowHiddenForm] = useState(false);
  const [downloadPending, setDownloadPending] = useState(false);
  const [rescanPending, setRescanPending] = useState(false);

  const [downloadQueueText, setDownloadQueueText] = useState("");

  const [downloadResponse, setDownloadResponse] =
    useState<DownloadResponseType>({
      data: [],
      paginate: { current_page: 0 },
    });

  const downloadList = downloadResponse.data;
  const pagination = downloadResponse.paginate;

  const downloadCount = pagination?.total_hits;

  const channel_filter_name =
    downloadResponse?.data?.length && downloadResponse?.data?.length > 0
      ? downloadResponse?.data[0].channel_name
      : "";

  const channel_agg_list = [];

  const isGridView = view === "grid";
  const gridView = isGridView ? `boxed-${gridItems}` : "";
  const gridViewGrid = isGridView ? `grid-${gridItems}` : "";

  useEffect(() => {
    (async () => {
      const userConfig: UserConfigType = {
        show_ignored_only: showIgnored,
        [ViewStyleNames.downloads]: view,
        grid_items: gridItems,
      };

      await updateUserConfig(userConfig);
      setRefreshDownloadList(true);
    })();
  }, [view, gridItems, showIgnored]);

  useEffect(() => {
    (async () => {
      const videos = await loadDownloadQueue(
        currentPage,
        channelFilterFromUrl,
        showIgnored,
      );

      setDownloadResponse(videos);
      setRefreshDownloadList(false);
    })();

    // Do not add showIgnored, otherwise it will not update the userconfig first.
  }, [refreshDownloadList, currentPage, view, gridItems]);

  return (
    <>
      <div className="boxed-content">
        <div className="title-bar">
          <h1>
            Downloads {channelFilterFromUrl && ` for ${channel_filter_name}`}
          </h1>
        </div>
        <div id="notifications"></div>
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
                  <button
                    onClick={async () => {
                      await updateDownloadQueue(downloadQueueText, false);
                    }}
                  >
                    Add to queue
                  </button>
                  <button
                    onClick={async () => {
                      await updateDownloadQueue(downloadQueueText, true);
                    }}
                  >
                    Download now
                  </button>
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
                onClick={() => {
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
                {channel_agg_list.map((channel) => {
                  return (
                    <option
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
            downloadList?.map((download) => {
              return (
                <>
                  <div
                    className={`video-item ${view}`}
                    id={`dl-${download.youtube_id}`}
                  >
                    <div className={`video-thumb-wrap ${view}`}>
                      <div className="video-thumb">
                        <img src={download.vid_thumb_url} alt="video_thumb" />
                        <div className="video-tags">
                          {showIgnored && <span>ignored</span>}
                          {!showIgnored && <span>queued</span>}
                          <span>{download.vid_type}</span>
                          {download.auto_start && <span>auto</span>}
                        </div>
                      </div>
                    </div>
                    <div className={`video-desc ${view}`}>
                      <div>
                        {download.channel_indexed && (
                          <Link to={Routes.Channel(download.channel_id)}>
                            {download.channel_name}
                          </Link>
                        )}
                        {!download.channel_indexed && (
                          <span>{download.channel_name}</span>
                        )}
                        <a
                          href={`https://www.youtube.com/watch?v=${download.youtube_id}`}
                          target="_blank"
                        >
                          <h3>{download.title}</h3>
                        </a>
                      </div>
                      <p>
                        Published: {download.published} | Duration:{" "}
                        {download.duration} | {download.youtube_id}
                      </p>
                      {download.message && (
                        <p className="danger-zone">{download.message}</p>
                      )}
                      <div>
                        {showIgnored && (
                          <>
                            <button
                              onClick={async () => {
                                await deleteDownloadById(download.youtube_id);
                                setRefreshDownloadList(true);
                              }}
                            >
                              Forget
                            </button>{" "}
                            <button
                              onClick={async () => {
                                await updateDownloadQueueStatusById(
                                  download.youtube_id,
                                  "pending",
                                );
                                setRefreshDownloadList(true);
                              }}
                            >
                              Add to queue
                            </button>
                          </>
                        )}
                        {!showIgnored && (
                          <>
                            <button
                              onClick={async () => {
                                await updateDownloadQueueStatusById(
                                  download.youtube_id,
                                  "ignore",
                                );
                                setRefreshDownloadList(true);
                              }}
                            >
                              Ignore
                            </button>{" "}
                            <button
                              onClick={async () => {
                                await updateDownloadQueueStatusById(
                                  download.youtube_id,
                                  "priority",
                                );
                                setRefreshDownloadList(true);
                              }}
                            >
                              Download now
                            </button>
                          </>
                        )}
                        {download.message && (
                          <button
                            className="danger-button"
                            onclick="forgetIgnore(this)"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
        </div>
      </div>

      <div className="boxed-content">
        <Pagination pagination={pagination} setPage={setCurrentPage} />
      </div>
    </>
  );
};

export default Download;
