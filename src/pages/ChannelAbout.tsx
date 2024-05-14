import { useLoaderData, useParams } from "react-router-dom";
import ChannelOverview from "../components/ChannelOverview";
import { useEffect, useState } from "react";
import loadChannelById from "../api/loader/loadChannelById";
import { UserConfigType } from "../api/actions/updateUserConfig";
import { ChannelResponseType } from "./ChannelBase";
import getIsAdmin from "../components/getIsAdmin";
import Linkify from "../components/Linkify";

const handleSponsorBlockIntegrationOverwrite = (integration: string) => {
  if (integration) {
    if (integration == "False") {
      return "Disabled";
    }

    return integration;
  }

  return "False";
};

type ChannelAboutParams = {
  channelId: string;
};

type ChannelAboutLoaderType = {
  userConfig: UserConfigType;
};

const ChannelAbout = () => {
  const { channelId } = useParams() as ChannelAboutParams;
  const { userConfig } = useLoaderData() as ChannelAboutLoaderType;

  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [channelResponse, setChannelResponse] = useState<ChannelResponseType>();

  const channel = channelResponse?.data;

  const channel_overwrites = channel?.channel_overwrites;
  const channel_overwrite_form = {
    download_format: "",
    autodelete_days: 0,
    index_playlists: 0,
    integrate_sponsorblock: false,
  };

  useEffect(() => {
    (async () => {
      const channelResponse = await loadChannelById(channelId);

      setChannelResponse(channelResponse);
      setRefresh(false);
    })();
  }, [refresh, channelId]);

  const isAdmin = getIsAdmin();
  const reindex = false;

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
              <p>Last refreshed: {channel.channel_last_refresh}</p>
              {channel.channel_active && (
                <p>
                  Youtube:{" "}
                  <a
                    href="https://www.youtube.com/channel/{{ channel.channel_id }}"
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
                    <button onclick="deleteConfirm()" id="delete-item">
                      Delete Channel
                    </button>
                    <div className="delete-confirm" id="delete-button">
                      <span>
                        Delete {channel.channel_name} including all videos?{" "}
                      </span>
                      <button
                        className="danger-button"
                        onclick="deleteChannel(this)"
                        data-id="{{ channel.channel_id }}"
                      >
                        Delete
                      </button>{" "}
                      <button onclick="cancelDelete()">Cancel</button>
                    </div>
                  </div>
                  {reindex && <p>Reindex scheduled</p>}

                  {!reindex && (
                    <div id="reindex-button" className="button-box">
                      <button
                        data-id="{{ channel.channel_id }}"
                        data-type="channel"
                        onclick="reindex(this)"
                        title="Reindex Channel {{ channel.channel_name }}"
                      >
                        Reindex
                      </button>
                      <button
                        data-id="{{ channel.channel_id }}"
                        data-type="channel"
                        data-extract-videos="true"
                        onclick="reindex(this)"
                        title="Reindex Videos of {{ channel.channel_name }}"
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

        {isAdmin && channel_overwrites && (
          <div id="overwrite-form" className="info-box">
            <div className="info-box-item">
              <h2>Customize {channel.channel_name}</h2>
              <form
                className="overwrite-form"
                action="/channel/{ channel.channel_id }/about/"
                method="POST"
              >
                <div className="overwrite-form-item">
                  <p>
                    Download format:{" "}
                    <span className="settings-current">
                      {channel_overwrites.download_format || "False"}
                    </span>
                  </p>
                  <input
                    type="text"
                    name="download_format"
                    id="id_download_format"
                    value={channel_overwrite_form.download_format || ""}
                  />
                  <br />
                </div>
                <div className="overwrite-form-item">
                  <p>
                    Auto delete watched videos after x days:{" "}
                    <span className="settings-current">
                      {channel_overwrites.autodelete_days || "False"}
                    </span>
                  </p>
                  <input
                    type="number"
                    name="autodelete_days"
                    id="id_autodelete_days"
                    value={channel_overwrite_form.autodelete_days || ""}
                  />

                  <br />
                </div>

                <div className="overwrite-form-item">
                  <p>
                    Index playlists:{" "}
                    <span className="settings-current">
                      {channel_overwrites.index_playlists || "False"}
                    </span>
                  </p>

                  <select name="index_playlists" id="id_index_playlists">
                    <option value="" selected>
                      -- change playlist index --
                    </option>
                    <option value="0">Disable playlist index</option>
                    <option value="1">Enable playlist index</option>
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
                        channel_overwrites.integrate_sponsorblock,
                      )}
                    </span>
                  </p>
                  <select
                    name="integrate_sponsorblock"
                    id="id_integrate_sponsorblock"
                  >
                    <option value="" selected>
                      -- change sponsorblock integrations
                    </option>
                    <option value="disable">
                      disable sponsorblock integration
                    </option>
                    <option value="1">enable sponsorblock integration</option>
                    <option value="0">unset sponsorblock integration</option>
                  </select>
                  <br />
                </div>
                <button type="submit">Save Channel Overwrites</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChannelAbout;
