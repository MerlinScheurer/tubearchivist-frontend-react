import {
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import ChannelOverview from "../components/ChannelOverview";
import { useEffect, useState } from "react";
import loadChannelById from "../api/loader/loadChannelById";
import { UserConfigType } from "../api/actions/updateUserConfig";
import { ChannelResponseType } from "./ChannelBase";
import getIsAdmin from "../functions/getIsAdmin";
import Linkify from "../components/Linkify";
import deleteChannel from "../api/actions/deleteChannel";
import Routes from "../configuration/routes/RouteList";
import queueReindex, {
  ReindexType,
  ReindexTypeEnum,
} from "../api/actions/queueReindex";
import { OutletContextType } from "./Base";
import formatDate from "../functions/formatDates";
import PaginationDummy from "../components/PaginationDummy";

const handleSponsorBlockIntegrationOverwrite = (integration: string) => {
  if (integration) {
    if (integration == "False") {
      return "Disabled";
    }

    return integration;
  }

  return "False";
};

export type ChannelBaseOutletContextType = [
  number,
  () => void,
  boolean,
  (status: boolean) => void,
];

type ChannelAboutParams = {
  channelId: string;
};

const ChannelAbout = () => {
  const { channelId } = useParams() as ChannelAboutParams;
  const [currentPage, setCurrentPage, startNotification, setStartNotification] =
    useOutletContext() as ChannelBaseOutletContextType;
  const navigate = useNavigate();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [reindex, setReindex] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [channelResponse, setChannelResponse] = useState<ChannelResponseType>();

  const channel = channelResponse?.data;

  const channelOverwrites = channel?.channel_overwrites;

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    //TODO: implement request to about api endpoint ( when implemented )
    // `/api/channel/${channel.channel_id}/about/`
  };

  useEffect(() => {
    (async () => {
      const channelResponse = await loadChannelById(channelId);

      setChannelResponse(channelResponse);
      setRefresh(false);
    })();
  }, [refresh, channelId]);

  const isAdmin = getIsAdmin();

  if (!channel) {
    return "Channel not found!";
  }

  return (
    <>
      <div className="boxed-content">
        <div className="info-box info-box-3">
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
            <div>
              <p>Last refreshed: {formatDate(channel.channel_last_refresh)}</p>
              {channel.channel_active && (
                <p>
                  Youtube:{" "}
                  <a
                    href={`https://www.youtube.com/channel/${channel.channel_id}`}
                    target="_blank"
                  >
                    Active
                  </a>
                </p>
              )}
              {!channel.channel_active && <p>Youtube: Deactivated</p>}
            </div>
          </div>

          <div className="info-box-item">
            <div>
              {channel.channel_views >= 1000000 && (
                <p>Channel views: {channel.channel_views}</p>
              )}
              {channel.channel_views < 1000000 && channel.channel_views > 0 && (
                <p>Channel views: {channel.channel_views}</p>
              )}

              {isAdmin && (
                <>
                  <div className="button-box">
                    {!showDeleteConfirm && (
                      <button
                        onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                        id="delete-item"
                      >
                        Delete Channel
                      </button>
                    )}

                    {showDeleteConfirm && (
                      <div className="delete-confirm" id="delete-button">
                        <span>
                          Delete {channel.channel_name} including all videos?{" "}
                        </span>
                        <button
                          className="danger-button"
                          onClick={async () => {
                            await deleteChannel(channelId);
                            navigate(Routes.Channels);
                          }}
                        >
                          Delete
                        </button>{" "}
                        <button
                          onClick={() =>
                            setShowDeleteConfirm(!showDeleteConfirm)
                          }
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  {reindex && <p>Reindex scheduled</p>}
                  {!reindex && (
                    <div id="reindex-button" className="button-box">
                      <button
                        title={`Reindex Channel ${channel.channel_name}`}
                        onClick={async () => {
                          await queueReindex(
                            channelId,
                            ReindexTypeEnum.channel as ReindexType,
                          );

                          setReindex(true);
                          setStartNotification(true);
                        }}
                      >
                        Reindex
                      </button>{" "}
                      <button
                        title={`Reindex Videos of ${channel.channel_name}`}
                        onClick={async () => {
                          await queueReindex(
                            channelId,
                            ReindexTypeEnum.channel as ReindexType,
                            true,
                          );

                          setReindex(true);
                          setStartNotification(true);
                        }}
                      >
                        Reindex Videos
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {channel.channel_description && (
          <div className="description-box">
            <p
              id={descriptionExpanded ? "text-expand-expanded" : "text-expand"}
              className="description-text"
            >
              <Linkify>{channel.channel_description}</Linkify>
            </p>

            <button
              onClick={() => setDescriptionExpanded(!descriptionExpanded)}
              id="text-expand-button"
            >
              Show more
            </button>
          </div>
        )}

        {channel.channel_tags && (
          <div className="description-box">
            <div className="video-tag-box">
              {channel.channel_tags.map((tag, index) => {
                return (
                  <span key={index} className="video-tag">
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {isAdmin && (
          <div id="overwrite-form" className="info-box">
            <div className="info-box-item">
              <h2>Customize {channel.channel_name}</h2>
              <form className="overwrite-form" onSubmit={handleSubmit}>
                <div className="overwrite-form-item">
                  <p>
                    Download format:{" "}
                    <span className="settings-current">
                      {channelOverwrites?.download_format || "False"}
                    </span>
                  </p>
                  <input
                    type="text"
                    name="download_format"
                    id="id_download_format"
                  />
                  <br />
                </div>
                <div className="overwrite-form-item">
                  <p>
                    Auto delete watched videos after x days:{" "}
                    <span className="settings-current">
                      {channelOverwrites?.autodelete_days || "False"}
                    </span>
                  </p>
                  <input
                    type="number"
                    name="autodelete_days"
                    id="id_autodelete_days"
                  />

                  <br />
                </div>

                <div className="overwrite-form-item">
                  <p>
                    Index playlists:{" "}
                    <span className="settings-current">
                      {channelOverwrites?.index_playlists || "False"}
                    </span>
                  </p>

                  <select
                    name="index_playlists"
                    id="id_index_playlists"
                    defaultValue=""
                  >
                    <option value="">-- change playlist index --</option>
                    <option value="false">Disable playlist index</option>
                    <option value="true">Enable playlist index</option>
                  </select>

                  <br />
                </div>

                <div className="overwrite-form-item">
                  <p>
                    Enable{" "}
                    <a href="https://sponsor.ajay.app/" target="_blank">
                      SponsorBlock
                    </a>
                    :{" "}
                    <span className="settings-current">
                      {handleSponsorBlockIntegrationOverwrite(
                        channelOverwrites?.integrate_sponsorblock,
                      )}
                    </span>
                  </p>
                  <select
                    name="integrate_sponsorblock"
                    id="id_integrate_sponsorblock"
                    defaultValue=""
                  >
                    <option value="">
                      -- change sponsorblock integrations
                    </option>
                    <option value="disable">
                      disable sponsorblock integration
                    </option>
                    <option value="true">
                      enable sponsorblock integration
                    </option>
                    <option value="false">
                      unset sponsorblock integration
                    </option>
                  </select>
                  <br />
                </div>
                <button type="submit">Save Channel Overwrites</button>
              </form>
            </div>
          </div>
        )}
      </div>

      <PaginationDummy />
    </>
  );
};

export default ChannelAbout;
