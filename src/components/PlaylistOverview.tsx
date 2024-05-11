import { Link } from "react-router-dom";
import Routes from "../configuration/routes/RouteList";
import { ViewLayout } from "../pages/Home";
import { PlaylistType } from "../pages/Playlists";

type PlaylistOverviewProps = {
  playlistList: PlaylistType[] | undefined;
  viewLayout: ViewLayout;
};

const PlaylistOverview = ({
  playlistList,
  viewLayout,
}: PlaylistOverviewProps) => {
  if (!playlistList) {
    return "No playlists found.";
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

              <p>Last refreshed: {playlist.playlist_last_refresh}</p>

              {playlist.playlist_type != "custom" && (
                <>
                  {playlist.playlist_subscribed && (
                    <button
                      className="unsubscribe"
                      type="button"
                      data-type="playlist"
                      data-subscribe=""
                      data-id={playlist.playlist_id}
                      onclick="subscribeStatus(this)"
                      title={`Unsubscribe from ${playlist.playlist_name}`}
                    >
                      Unsubscribe
                    </button>
                  )}

                  {playlist.playlist_subscribed && (
                    <button
                      type="button"
                      data-type="playlist"
                      data-subscribe="true"
                      data-id={playlist.playlist_id}
                      onclick="subscribeStatus(this)"
                      title={`Subscribe to ${playlist.playlist_name}`}
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

export default PlaylistOverview;
