import { Link, Outlet, useOutletContext, useParams } from "react-router-dom";
import Routes from "../configuration/routes/RouteList";
import { useEffect, useState } from "react";
import loadChannelById from "../api/loader/loadChannelById";
import { ChannelType } from "./Channels";
import { ConfigType } from "./Home";
import getIsAdmin from "../components/getIsAdmin";
import { OutletContextType } from "./Base";

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

  useEffect(() => {
    (async () => {
      const channelResponse = await loadChannelById(channelId);

      setChannelResponse(channelResponse);
    })();
  }, [channelId]);

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
            <a href="{% url 'downloads' %}?channel={{ channel_info.channel_id }}">
              {/** TODO: link to Downloads with channel filter */}
              <h3>Downloads</h3>
            </a>
          )}
        </div>
        <div id="notifications" data="channel reindex" />

        <div className="info-box info-box-2">
          <div className="info-box-item">
            <div className="round-img">
              <Link to={Routes.Channel(channel.channel_id)}>
                <img
                  src={`/cache/channels/${channel.channel_id}_thumb.jpg`}
                  alt="channel-thumb"
                />
              </Link>
            </div>
            <div>
              <h3>
                <Link to={Routes.ChannelVideo(channel.channel_id)}>
                  {channel.channel_name}
                </Link>
              </h3>

              {channel.channel_subs >= 1000000 && (
                <p>Subscribers: {channel.channel_subs}</p>
              )}

              {channel.channel_subs < 1000000 && (
                <p>Subscribers: {channel.channel_subs}</p>
              )}

              {channel.channel_subscribed && isAdmin && (
                <button
                  className="unsubscribe"
                  type="button"
                  data-type="channel"
                  data-subscribe=""
                  data-id={channel.channel_id}
                  onclick="subscribeStatus(this)"
                  title="Unsubscribe from {{ channel_info.channel_name }}"
                >
                  Unsubscribe
                </button>
              )}

              {!channel.channel_subscribed && (
                <button
                  type="button"
                  data-type="channel"
                  data-subscribe="true"
                  data-id={channel.channel_id}
                  onclick="subscribeStatus(this)"
                  title="Subscribe to {{ channel_info.channel_name }}"
                >
                  Subscribe
                </button>
              )}
            </div>
          </div>
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