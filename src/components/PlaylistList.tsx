import { Link } from "react-router-dom";
import Routes from "../configuration/routes/RouteList";
import { ViewLayout } from "../pages/Home";
import { PlaylistType } from "../pages/Playlist";
import updatePlaylistSubscription from "../api/actions/updatePlaylistSubscription";
import formatDate from "./formatDates";

type PlaylistListProps = {
  playlistList: PlaylistType[] | undefined;
  viewLayout: ViewLayout;
  setRefresh: (status: boolean) => void;
};

const PlaylistList = ({
  playlistList,
  viewLayout,
  setRefresh,
}: PlaylistListProps) => {
  if (!playlistList || playlistList.length === 0) {
    return <p>No playlists found.</p>;
  }

  return (
    <>
      {playlistList.map((playlist: PlaylistType, index: number) => {
        return (
          <div key={index} className={`playlist-item ${viewLayout}`}>
            <div className="playlist-thumbnail">
              <Link to={Routes.Playlist(playlist.playlist_id)}>
                <img
                  src={`/cache/playlists/${playlist.playlist_id}.jpg`}
                  alt={`${playlist.playlist_id}-thumbnail`}
                />
              </Link>
            </div>
            <div className={`playlist-desc ${viewLayout}`}>
              {playlist.playlist_type != "custom" && (
                <Link to={Routes.Channel(playlist.playlist_channel_id)}>
                  <h3>{playlist.playlist_channel}</h3>
                </Link>
              )}

              <Link to={Routes.Playlist(playlist.playlist_id)}>
                <h2>{playlist.playlist_name}</h2>
              </Link>

              <p>
                Last refreshed: {formatDate(playlist.playlist_last_refresh)}
              </p>

              {playlist.playlist_type != "custom" && (
                <>
                  {playlist.playlist_subscribed && (
                    <button
                      className="unsubscribe"
                      type="button"
                      title={`Unsubscribe from ${playlist.playlist_name}`}
                      onClick={async () => {
                        await updatePlaylistSubscription(
                          playlist.playlist_id,
                          false,
                        );

                        setRefresh(true);
                      }}
                    >
                      Unsubscribe
                    </button>
                  )}

                  {!playlist.playlist_subscribed && (
                    <button
                      type="button"
                      title={`Subscribe to ${playlist.playlist_name}`}
                      onClick={async () => {
                        await updatePlaylistSubscription(
                          playlist.playlist_id,
                          true,
                        );

                        setRefresh(true);
                      }}
                    >
                      Subscribe
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default PlaylistList;
