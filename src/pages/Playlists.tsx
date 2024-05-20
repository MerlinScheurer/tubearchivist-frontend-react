import { useEffect, useState } from "react";
import { useLoaderData, useOutletContext } from "react-router-dom";

import iconAdd from "/img/icon-add.svg";
import iconGridView from "/img/icon-gridview.svg";
import iconListView from "/img/icon-listview.svg";

import { OutletContextType } from "./Base";
import updateUserConfig, {
  UserConfigType,
} from "../api/actions/updateUserConfig";
import loadPlaylistList from "../api/loader/loadPlaylistList";
import { ConfigType, ViewLayout } from "./Home";
import Pagination, { PaginationType } from "../components/Pagination";
import getIsAdmin from "../functions/getIsAdmin";
import PlaylistList from "../components/PlaylistList";
import { PlaylistType } from "./Playlist";
import updatePlaylistSubscription from "../api/actions/updatePlaylistSubscription";
import createCustomPlaylist from "../api/actions/createCustomPlaylist";
import ScrollToTopOnNavigate from "../components/ScrollToTop";

export type PlaylistEntryType = {
  youtube_id: string;
  title: string;
  uploader: string;
  idx: number;
  downloaded: boolean;
};

export type PlaylistResponseType = {
  data?: PlaylistType[];
  config?: ConfigType;
  paginate?: PaginationType;
};

type PlaylistLoaderDataType = {
  userConfig: UserConfigType;
};

const Playlists = () => {
  const { userConfig } = useLoaderData() as PlaylistLoaderDataType;
  const [currentPage, setCurrentPage] = useOutletContext() as OutletContextType;

  const [showSubedOnly, setShowSubedOnly] = useState(
    userConfig.hide_watched || false,
  );
  const [view, setView] = useState<ViewLayout>(
    userConfig.view_style_home || "grid",
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshPlaylistList, setRefreshPlaylistList] = useState(false);
  const [playlistsToAddText, setPlaylistsToAddText] = useState("");
  const [customPlaylistsToAddText, setCustomPlaylistsToAddText] = useState("");

  const [playlistResponse, setPlaylistReponse] = useState<PlaylistResponseType>(
    {
      data: [],
      paginate: { current_page: 0 },
    },
  );

  const playlistList = playlistResponse.data;
  const pagination = playlistResponse.paginate;

  const hasPlaylists = playlistResponse?.data?.length !== 0;

  const isAdmin = getIsAdmin();

  useEffect(() => {
    (async () => {
      const userConfig: UserConfigType = {
        show_subed_only: showSubedOnly,
        view_style_playlist: view,
      };

      await updateUserConfig(userConfig);
    })();
  }, [showSubedOnly, view]);

  useEffect(() => {
    (async () => {
      const playlist = await loadPlaylistList(currentPage);

      setPlaylistReponse(playlist);
      setRefreshPlaylistList(false);
    })();
  }, [refreshPlaylistList, currentPage, showSubedOnly, view]);

  return (
    <>
      <ScrollToTopOnNavigate />
      <div className="boxed-content">
        <div className="title-split">
          <div className="title-bar">
            <h1>Playlists</h1>
          </div>
          {isAdmin && (
            <div className="title-split-form">
              <img
                onClick={() => {
                  setShowAddForm(!showAddForm);
                }}
                src={iconAdd}
                alt="add-icon"
                title="Subscribe to Playlists"
              />
              {showAddForm && (
                <div className="show-form">
                  <div>
                    <label>Subscribe to playlists:</label>
                    <textarea
                      value={playlistsToAddText}
                      onChange={(event) => {
                        setPlaylistsToAddText(event.target.value);
                      }}
                      rows={3}
                      cols={40}
                      placeholder="Input playlist IDs or URLs"
                    />
                    <button
                      type="submit"
                      onClick={async () => {
                        await updatePlaylistSubscription(
                          playlistsToAddText,
                          true,
                        );
                      }}
                    >
                      Subscribe
                    </button>
                  </div>
                  <br />
                  <div>
                    <label>Or create custom playlist:</label>
                    <textarea
                      rows={1}
                      cols={40}
                      placeholder="Input playlist name"
                      value={customPlaylistsToAddText}
                      onChange={(event) => {
                        setCustomPlaylistsToAddText(event.target.value);
                      }}
                    />
                    <button
                      type="submit"
                      onClick={async () => {
                        await createCustomPlaylist(customPlaylistsToAddText);
                      }}
                    >
                      Create
                    </button>
                  </div>
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
                checked={showSubedOnly}
                onClick={() => {
                  setShowSubedOnly(!showSubedOnly);
                }}
                type="checkbox"
              />
              {!showSubedOnly && (
                <label htmlFor="" className="ofbtn">
                  Off
                </label>
              )}
              {showSubedOnly && (
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

        <div className={`playlist-list ${view}`}>
          {!hasPlaylists && <h2>No playlists found...</h2>}

          {hasPlaylists && (
            <PlaylistList
              playlistList={playlistList}
              viewLayout={view}
              setRefresh={setRefreshPlaylistList}
            />
          )}
        </div>
      </div>

      <div className="boxed-content">
        <Pagination pagination={pagination} setPage={setCurrentPage} />
      </div>
    </>
  );
};

export default Playlists;
