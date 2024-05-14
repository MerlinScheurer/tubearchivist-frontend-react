import { useLoaderData, useOutletContext } from "react-router-dom";
import loadChannelList from "../api/loader/loadChannelList";
import iconGridView from "/img/icon-gridview.svg";
import iconListView from "/img/icon-listview.svg";
import iconAdd from "/img/icon-add.svg";
import { useEffect, useState } from "react";
import Pagination, { PaginationType } from "../components/Pagination";
import { ConfigType, ViewLayout } from "./Home";
import updateUserConfig, {
  UserConfigType,
} from "../api/actions/updateUserConfig";
import { OutletContextType } from "./Base";
import getIsAdmin from "../components/getIsAdmin";
import ChannelList from "../components/ChannelList";

export type ChannelType = {
  channel_active: boolean;
  channel_banner_url: string;
  channel_description: string;
  channel_id: string;
  channel_last_refresh: string;
  channel_name: string;
  channel_subs: number;
  channel_subscribed: boolean;
  channel_tags: string[];
  channel_thumb_url: string;
  channel_tvart_url: string;
  channel_views: number;
};

type ChannelsListResponse = {
  data: ChannelType[];
  paginate: PaginationType;
  config?: ConfigType;
};

type ChannelsLoaderDataType = {
  userConfig: UserConfigType;
};

const Channels = () => {
  const { userConfig } = useLoaderData() as ChannelsLoaderDataType;
  const [currentPage, setCurrentPage] = useOutletContext() as OutletContextType;

  const [channelListResponse, setChannelListResponse] =
    useState<ChannelsListResponse>();
  const [showSubscribedOnly, setShowSubscribedOnly] = useState(
    userConfig.show_subed_only || false,
  );
  const [view, setView] = useState<ViewLayout>(
    userConfig.view_style_channel || "grid",
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshChannelList, setRefreshChannelList] = useState(false);

  useEffect(() => {
    (async () => {
      const userConfig: UserConfigType = {
        show_subed_only: showSubscribedOnly,
        view_style_channel: view,
      };

      await updateUserConfig(userConfig);
    })();
  }, [showSubscribedOnly, view]);

  useEffect(() => {
    (async () => {
      //TODO: take showSubscribedOnly into account when loading channels
      const channelListResponse = await loadChannelList(currentPage);

      setChannelListResponse(channelListResponse);
      setRefreshChannelList(false);
    })();
  }, [currentPage, showSubscribedOnly, refreshChannelList]);

  const channels = channelListResponse?.data;
  const pagination = channelListResponse?.paginate;
  const channelCount = channels?.length;

  const isAdmin = getIsAdmin();

  return (
    <div className="boxed-content">
      <div className="title-split">
        <div className="title-bar">
          <h1>Channels</h1>
        </div>
        {isAdmin && (
          <div className="title-split-form">
            <img
              id="animate-icon"
              onClick={() => {
                setShowAddForm(!showAddForm);
              }}
              src={iconAdd}
              alt="add-icon"
              title="Subscribe to Channels"
            />
            {showAddForm && (
              <div className="show-form">
                <div>
                  <label>Subscribe to channels:</label>
                  <textarea
                    rows={3}
                    placeholder="Input channel ID, URL or Video of a channel"
                  />
                </div>

                <button type="submit">Subscribe</button>
              </div>
            )}
          </div>
        )}
      </div>
      <div id="notifications"></div>
      <div className="view-controls">
        <div className="toggle">
          <span>Show subscribed only:</span>
          <div className="toggleBox">
            <input
              id="show_subed_only"
              onClick={() => {
                setShowSubscribedOnly(!showSubscribedOnly);
              }}
              type="checkbox"
              checked={showSubscribedOnly}
            />
            {!showSubscribedOnly && (
              <label htmlFor="" className="ofbtn">
                Off
              </label>
            )}
            {showSubscribedOnly && (
              <label htmlFor="" className="onbtn">
                On
              </label>
            )}
          </div>
        </div>
        <div className="view-icons">
          <img
            src={iconGridView}
            onClick={() => {
              setView("grid");
            }}
            data-origin="channel"
            data-value="grid"
            alt="grid view"
          />
          <img
            src={iconListView}
            onClick={() => {
              setView("list");
            }}
            data-origin="channel"
            data-value="list"
            alt="list view"
          />
        </div>
      </div>
      <h2>Total channels: {channelCount}</h2>
      <div className={`channel-list ${view}`}>
        {!channels && <h2>No channels found...</h2>}

        <ChannelList
          channelList={channels}
          viewLayout={view}
          refreshChannelList={setRefreshChannelList}
        />
      </div>

      {pagination && (
        <div className="boxed-content">
          <Pagination pagination={pagination} setPage={setCurrentPage} />
        </div>
      )}
    </div>
  );
};

export default Channels;
