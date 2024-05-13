import { Link, Outlet, useOutletContext, useParams } from "react-router-dom";
import Routes from "../configuration/routes/RouteList";
import { useEffect, useState } from "react";
import loadChannelById from "../api/loader/loadChannelById";
import { ChannelType } from "./Channels";
import { ConfigType } from "./Home";
import getIsAdmin from "../components/getIsAdmin";
import { OutletContextType } from "./Base";
import ChannelOverview from "../components/ChannelOverview";

type ChannelParams = {
  channelId: string;
};

export type ChannelResponseType = {
  data: ChannelType;
  config: ConfigType;
};

function ChannelBase() {
  const { channelId } = useParams() as ChannelParams;
  const [currentPage, setCurrentPage] = useOutletContext() as OutletContextType;

  const [channelResponse, setChannelResponse] = useState<ChannelResponseType>();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    (async () => {
      const channelResponse = await loadChannelById(channelId);

      setChannelResponse(channelResponse);
      setRefresh(false);
    })();
  }, [channelId, refresh]);

  const channel = channelResponse?.data;

  const has_streams = false;
  const has_shorts = false;
  const has_playlists = false;
  const has_pending = false;
  const aggs = false;

  const isAdmin = getIsAdmin();

  if (!channel) {
    return [];
  }

  return (
    <>
      <div className="boxed-content">
        <div className="channel-banner">
          <Link to={Routes.ChannelVideo(channel.channel_id)}>
            <img
              src={`/cache/channels/${channel.channel_id}_banner.jpg`}
              alt="channel_banner"
            />
          </Link>
        </div>
        <div className="info-box-item child-page-nav">
          <Link to={Routes.ChannelVideo(channel.channel_id)}>
            <h3>Videos</h3>
          </Link>
          {has_streams && (
            <Link to={Routes.ChannelStream(channel.channel_id)}>
              <h3>Streams</h3>
            </Link>
          )}
          {has_shorts && (
            <Link to={Routes.ChannelShort(channel.channel_id)}>
              <h3>Shorts</h3>
            </Link>
          )}
          {has_playlists && (
            <Link to={Routes.ChannelPlaylist(channel.channel_id)}>
              <h3>Playlists</h3>
            </Link>
          )}
          <Link to={Routes.ChannelAbout(channel.channel_id)}>
            <h3>About</h3>
          </Link>
          {has_pending && isAdmin && (
            <Link to={Routes.DownloadsByChannelId(channel.channel_id)}>
              <h3>Downloads</h3>
            </Link>
          )}
        </div>
        <div id="notifications" data="channel reindex" />

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

      <Outlet context={[currentPage, setCurrentPage]} />
    </>
  );
}

export default ChannelBase;
