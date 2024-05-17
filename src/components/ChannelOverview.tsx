import { Link } from "react-router-dom";
import Routes from "../configuration/routes/RouteList";
import updateChannelSubscription from "../api/actions/updateChannelSubscription";
import formatNumbers from "./formatNumbers";

type ChannelOverviewProps = {
  channelId: string;
  channelname: string;
  channelSubs: number;
  channelSubscribed: boolean;
  showSubscribeButton?: boolean;
  isUserAdmin?: boolean;
  setRefresh: (status: boolean) => void;
};

const ChannelOverview = ({
  channelId,
  channelSubs,
  channelSubscribed,
  channelname,
  showSubscribeButton = false,
  isUserAdmin,
  setRefresh,
}: ChannelOverviewProps) => {
  return (
    <>
      <div className="info-box-item">
        <div className="round-img">
          <Link to={Routes.Channel(channelId)}>
            <img
              src={`/cache/channels/${channelId}_thumb.jpg`}
              alt="channel-thumb"
            />
          </Link>
        </div>
        <div>
          <h3>
            <Link to={Routes.ChannelVideo(channelId)}>{channelname}</Link>
          </h3>

          {channelSubs >= 1000000 && (
            <p>Subscribers: {formatNumbers(channelSubs)}</p>
          )}

          {channelSubs < 1000000 && (
            <p>Subscribers: {formatNumbers(channelSubs)}</p>
          )}

          {showSubscribeButton && (
            <>
              {channelSubscribed && isUserAdmin && (
                <button
                  className="unsubscribe"
                  type="button"
                  onClick={async () => {
                    await updateChannelSubscription(channelId, false);
                    setRefresh(true);
                  }}
                  title={`Unsubscribe from ${channelname}`}
                >
                  Unsubscribe
                </button>
              )}

              {!channelSubscribed && (
                <button
                  type="button"
                  onClick={async () => {
                    await updateChannelSubscription(channelId, true);
                    setRefresh(true);
                  }}
                  title={`Subscribe to ${channelname}`}
                >
                  Subscribe
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ChannelOverview;
