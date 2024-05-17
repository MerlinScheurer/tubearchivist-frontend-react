import { Link } from "react-router-dom";
import { ChannelType } from "../pages/Channels";
import { ViewLayout } from "../pages/Home";
import Routes from "../configuration/routes/RouteList";
import updateChannelSubscription from "../api/actions/updateChannelSubscription";
import formatDate from "../functions/formatDates";

type ChannelListProps = {
  channelList: ChannelType[] | undefined;
  viewLayout: ViewLayout;
  refreshChannelList: (refresh: boolean) => void;
};

const ChannelList = ({
  channelList,
  viewLayout,
  refreshChannelList,
}: ChannelListProps) => {
  if (!channelList || channelList.length === 0) {
    return <p>No channels found.</p>;
  }

  return (
    <>
      {channelList.map((channel, index) => {
        return (
          <div key={index} className={`channel-item ${viewLayout}`}>
            <div className={`channel-banner ${viewLayout}`}>
              <Link to={Routes.Channel(channel.channel_id)}>
                <img
                  src={`/cache/channels/${channel.channel_id}_banner.jpg`}
                  alt={`${channel.channel_id}-banner`}
                />
              </Link>
            </div>
            <div className={`info-box info-box-2 ${viewLayout}`}>
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
                    <Link to={Routes.Channel(channel.channel_id)}>
                      {channel.channel_name}
                    </Link>
                  </h3>
                  {channel.channel_subs >= 1000000 && (
                    <p>Subscribers: {channel.channel_subs}</p>
                  )}
                  {channel.channel_subs < 1000000 && (
                    <p>Subscribers: {channel.channel_subs}</p>
                  )}
                </div>
              </div>
              <div className="info-box-item">
                <div>
                  <p>
                    Last refreshed: {formatDate(channel.channel_last_refresh)}
                  </p>
                  {channel.channel_subscribed && (
                    <button
                      className="unsubscribe"
                      type="button"
                      data-type="channel"
                      data-id={channel.channel_id}
                      onClick={async () => {
                        await updateChannelSubscription(
                          channel.channel_id,
                          false,
                        );
                        refreshChannelList(true);
                      }}
                      title={`Unsubscribe from ${channel.channel_name}`}
                    >
                      Unsubscribe
                    </button>
                  )}
                  {!channel.channel_subscribed && (
                    <button
                      type="button"
                      data-type="channel"
                      data-id={channel.channel_id}
                      onClick={async () => {
                        await updateChannelSubscription(
                          channel.channel_id,
                          true,
                        );
                        refreshChannelList(true);
                      }}
                      title={`Subscribe to ${channel.channel_name}`}
                    >
                      Subscribe
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ChannelList;
