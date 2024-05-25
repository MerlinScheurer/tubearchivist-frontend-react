import { useEffect, useState } from "react";
import {
  Link,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { UserConfigType } from "../api/actions/updateUserConfig";
import loadPlaylistById from "../api/loader/loadPlaylistById";
import { OutletContextType } from "./Base";
import { ConfigType, VideoType, ViewLayout } from "./Home";
import getIsAdmin from "../functions/getIsAdmin";
import Filterbar from "../components/Filterbar";
import { PlaylistEntryType } from "./Playlists";
import loadChannelById from "../api/loader/loadChannelById";
import VideoList from "../components/VideoList";
import Pagination, { PaginationType } from "../components/Pagination";
import loadPlaylistVideosById from "../api/loader/loadPlaylistVideosById";
import ChannelOverview from "../components/ChannelOverview";
import Linkify from "../components/Linkify";
import {
  ViewStyleNames,
  ViewStyles,
} from "../configuration/constants/ViewStyle";
import updatePlaylistSubscription from "../api/actions/updatePlaylistSubscription";
import deletePlaylist from "../api/actions/deletePlaylist";
import Routes from "../configuration/routes/RouteList";
import { ChannelResponseType } from "./ChannelBase";
import formatDate from "../functions/formatDates";
import queueReindex from "../api/actions/queueReindex";
import updateWatchedState from "../api/actions/updateWatchedState";
import ScrollToTopOnNavigate from "../components/ScrollToTop";
import EmbeddableVideoPlayer from "../components/EmbeddableVideoPlayer";
import { Helmet } from "react-helmet";

export type PlaylistType = {
  playlist_active: boolean;
  playlist_channel: string;
  playlist_channel_id: string;
  playlist_description: string;
  playlist_entries: PlaylistEntryType[];
  playlist_id: string;
  playlist_last_refresh: string;
  playlist_name: string;
  playlist_subscribed: boolean;
  playlist_thumbnail: string;
  playlist_type: string;
  _index: string;
  _score: number;
};

type PlaylistLoaderDataType = {
  userConfig: UserConfigType;
};

export type PlaylistResponseType = {
  data?: PlaylistType;
  config?: ConfigType;
};

export type VideoResponseType = {
  data?: VideoType[];
  config?: ConfigType;
  paginate?: PaginationType;
};

const Playlist = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const videoId = searchParams.get("videoId");

  const { userConfig } = useLoaderData() as PlaylistLoaderDataType;
  const [currentPage, setCurrentPage] = useOutletContext() as OutletContextType;

  const [hideWatched, setHideWatched] = useState(
    userConfig.hide_watched || false,
  );
  const [view, setView] = useState<ViewLayout>(
    userConfig.view_style_home || "grid",
  );
  const [gridItems, setGridItems] = useState(userConfig.grid_items || 3);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [refreshPlaylist, setRefreshPlaylist] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reindex, setReindex] = useState(false);

  const [playlistResponse, setPlaylistResponse] =
    useState<PlaylistResponseType>();
  const [channelResponse, setChannelResponse] = useState<ChannelResponseType>();
  const [videoResponse, setVideoResponse] = useState<VideoResponseType>();

  const playlist = playlistResponse?.data;
  const channel = channelResponse?.data;
  const videos = videoResponse?.data;
  const pagination = videoResponse?.paginate;

  const palylistEntries = playlistResponse?.data?.playlist_entries;
  const videoArchivedCount = Number(
    palylistEntries?.filter((video) => video.downloaded).length,
  );
  const videoInPlaylistCount = pagination?.total_hits;
  const showEmbeddedVideo = videoId !== null;

  const isGridView = view === ViewStyles.grid;
  const gridView = isGridView ? `boxed-${gridItems}` : "";
  const gridViewGrid = isGridView ? `grid-${gridItems}` : "";

  useEffect(() => {
    (async () => {
      const playlist = await loadPlaylistById(playlistId);
      const video = await loadPlaylistVideosById(playlistId, currentPage);

      const isCustomPlaylist = playlist?.data?.playlist_type === "custom";
      if (!isCustomPlaylist) {
        const channel = await loadChannelById(
          playlist.data.playlist_channel_id,
        );

        setChannelResponse(channel);
      }

      setPlaylistResponse(playlist);
      setVideoResponse(video);
      setRefreshPlaylist(false);
    })();
  }, [playlistId, refreshPlaylist, currentPage]);

  if (!playlistId || !playlist) {
    return `Playlist ${playlistId} not found!`;
  }

  const isAdmin = getIsAdmin();
  const isCustomPlaylist = playlist.playlist_type === "custom";

  return (
    <>
      <Helmet>
        <title>TA | Playlist: {playlist.playlist_name}</title>
      </Helmet>
      <ScrollToTopOnNavigate />
      <div className="boxed-content">
        <div className="title-bar">
          <h1>{playlist.playlist_name}</h1>
        </div>
        <div className="info-box info-box-3">
          {!isCustomPlaylist && channel && (
            <ChannelOverview
              channelId={channel?.channel_id}
              channelname={channel?.channel_name}
              channelSubs={channel?.channel_subs}
              channelSubscribed={channel?.channel_subscribed}
              setRefresh={setRefreshPlaylist}
            />
          )}

          <div className="info-box-item">
            <div>
              <p>
                Last refreshed: {formatDate(playlist.playlist_last_refresh)}
              </p>
              {!isCustomPlaylist && (
                <>
                  <p>
                    Playlist:
                    {playlist.playlist_subscribed && (
                      <>
                        {isAdmin && (
                          <button
                            className="unsubscribe"
                            type="button"
                            onClick={async () => {
                              await updatePlaylistSubscription(
                                playlistId,
                                false,
                              );

                              setRefreshPlaylist(true);
                            }}
                            title={`Unsubscribe from ${playlist.playlist_name}`}
                          >
                            Unsubscribe
                          </button>
                        )}
                      </>
                    )}{" "}
                    {!playlist.playlist_subscribed && (
                      <button
                        type="button"
                        onClick={async () => {
                          await updatePlaylistSubscription(playlistId, true);

                          setRefreshPlaylist(true);
                        }}
                        title={`Subscribe to ${playlist.playlist_name}`}
                      >
                        Subscribe
                      </button>
                    )}
                  </p>
                  {playlist.playlist_active && (
                    <p>
                      Youtube:{" "}
                      <a
                        href={`https://www.youtube.com/playlist?list=${playlist.playlist_id}`}
                        target="_blank"
                      >
                        Active
                      </a>
                    </p>
                  )}
                  {!playlist.playlist_active && <p>Youtube: Deactivated</p>}
                </>
              )}

              {!showDeleteConfirm && (
                <button
                  onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                  id="delete-item"
                >
                  Delete Playlist
                </button>
              )}

              {showDeleteConfirm && (
                <div className="delete-confirm" id="delete-button">
                  <span>Delete {playlist.playlist_name}?</span>

                  <button
                    onClick={async () => {
                      await deletePlaylist(playlistId, false);
                      navigate(Routes.Playlists);
                    }}
                  >
                    Delete metadata
                  </button>

                  <button
                    className="danger-button"
                    onClick={async () => {
                      await deletePlaylist(playlistId, true);
                      navigate(Routes.Playlists);
                    }}
                  >
                    Delete all
                  </button>

                  <br />
                  <button
                    onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="info-box-item">
            <div>
              {videoArchivedCount > 0 && (
                <>
                  <p>
                    Total Videos archived: {videoArchivedCount}/
                    {videoInPlaylistCount}
                  </p>
                  <div id="watched-button" className="button-box">
                    <button
                      title={`Mark all videos from ${playlist.playlist_name} as watched`}
                      type="button"
                      onClick={async () => {
                        await updateWatchedState({
                          id: playlistId,
                          is_watched: true,
                        });

                        setRefreshPlaylist(true);
                      }}
                    >
                      Mark as watched
                    </button>{" "}
                    <button
                      title={`Mark all videos from ${playlist.playlist_name} as unwatched`}
                      type="button"
                      onClick={async () => {
                        await updateWatchedState({
                          id: playlistId,
                          is_watched: false,
                        });

                        setRefreshPlaylist(true);
                      }}
                    >
                      Mark as unwatched
                    </button>
                  </div>
                </>
              )}

              {reindex && <p>Reindex scheduled</p>}
              {!reindex && (
                <div id="reindex-button" className="button-box">
                  {!isCustomPlaylist && (
                    <button
                      title={`Reindex Playlist ${playlist.playlist_name}`}
                      onClick={async () => {
                        setReindex(true);

                        await queueReindex(playlist.playlist_id, "playlist");
                      }}
                    >
                      Reindex
                    </button>
                  )}{" "}
                  <button
                    title={`Reindex Videos of ${playlist.playlist_name}`}
                    onClick={async () => {
                      setReindex(true);

                      await queueReindex(
                        playlist.playlist_id,
                        "playlist",
                        true,
                      );
                    }}
                  >
                    Reindex Videos
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {playlist.playlist_description && (
          <div className="description-box">
            <p
              id={descriptionExpanded ? "text-expand-expanded" : "text-expand"}
              className="description-text"
            >
              <Linkify>{playlist.playlist_description}</Linkify>
            </p>

            <button
              onClick={() => setDescriptionExpanded(!descriptionExpanded)}
              id="text-expand-button"
            >
              Show more
            </button>
          </div>
        )}
      </div>

      <div className={`boxed-content ${gridView}`}>
        <Filterbar
          hideToggleText="Hide watched videos:"
          hideWatched={hideWatched}
          isGridView={isGridView}
          view={view}
          gridItems={gridItems}
          setHideWatched={setHideWatched}
          setView={setView}
          setGridItems={setGridItems}
          viewStyleName={ViewStyleNames.playlist}
          setRefresh={setRefreshPlaylist}
        />
      </div>

      {showEmbeddedVideo && <EmbeddableVideoPlayer videoId={videoId} />}

      <div className={`boxed-content ${gridView}`}>
        <div className={`video-list ${view} ${gridViewGrid}`}>
          {videoInPlaylistCount === 0 && (
            <>
              <h2>No videos found...</h2>
              {isCustomPlaylist && (
                <p>
                  Try going to the <a href="{% url 'home' %}">home page</a> to
                  add videos to this playlist.
                </p>
              )}

              {!isCustomPlaylist && (
                <p>
                  Try going to the{" "}
                  <Link to={Routes.Downloads}>downloads page</Link> to start the
                  scan and download tasks.
                </p>
              )}
            </>
          )}
          {videoInPlaylistCount !== 0 && (
            <VideoList
              videoList={videos}
              viewLayout={view}
              playlistId={playlistId}
              showReorderButton={isCustomPlaylist}
              refreshVideoList={setRefreshPlaylist}
            />
          )}
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

export default Playlist;
