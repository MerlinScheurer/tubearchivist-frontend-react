import { useLoaderData, useNavigate } from "react-router-dom";
import updateUserConfig, {
  UserConfigType,
} from "../api/actions/updateUserConfig";
import { AuthenticationType } from "./Base";
import { useEffect, useState } from "react";
import loadUserConfig from "../api/loader/loadUserConfig";
import { ColourVariants } from "../configuration/colours/getColours";

type SettingsUserLoaderData = {
  userConfig: UserConfigType;
  auth: AuthenticationType;
};

const SettingsUser = () => {
  const { userConfig, auth } = useLoaderData() as SettingsUserLoaderData;
  const { stylesheet, page_size } = userConfig;
  const navigate = useNavigate();

  const [selectedStylesheet, setSelectedStylesheet] = useState(
    userConfig.stylesheet || "dark.css",
  );
  const [selectedPageSize, setSelectedPageSize] = useState(
    userConfig.page_size || 3,
  );
  const [refresh, setRefresh] = useState(false);

  const [userConfigResponse, setUserConfigResponse] =
    useState<UserConfigType>();

  const stylesheetOverwritable =
    userConfigResponse?.stylesheet || stylesheet || "default";
  const pageSizeOverwritable =
    userConfigResponse?.page_size || page_size || "default";

  const isSuperuser = auth?.user?.is_superuser;

  useEffect(() => {
    (async () => {
      if (refresh) {
        const userConfigResponse = await loadUserConfig();

        setUserConfigResponse(userConfigResponse);
        setRefresh(false);
        navigate(0);
      }
    })();
  }, [navigate, refresh]);

  return (
    <>
      <div className="boxed-content">
        <div className="title-bar">
          <h1>User Configurations</h1>
        </div>
        <div>
          <div className="settings-group">
            <h2>Stylesheet</h2>
            <div className="settings-item">
              <p>
                Current stylesheet:{" "}
                <span className="settings-current">
                  {stylesheetOverwritable}
                </span>
              </p>
              <i>Select your preferred stylesheet.</i>
              <br />
              <select
                name="stylesheet"
                id="id_stylesheet"
                value={selectedStylesheet}
                onChange={(event) => {
                  setSelectedStylesheet(event.target.value as ColourVariants);
                }}
              >
                <option value="">-- change stylesheet --</option>
                <option value="dark.css">Dark</option>
                <option value="light.css">Light</option>
                <option value="matrix.css">Matrix</option>
                <option value="midnight.css">Midnight</option>
              </select>
            </div>
          </div>
          <div className="settings-group">
            <h2>Archive View</h2>
            <div className="settings-item">
              <p>
                Current page size:{" "}
                <span className="settings-current">{pageSizeOverwritable}</span>
              </p>
              <i>Result of videos showing in archive page</i>
              <br />

              <input
                type="number"
                name="page_size"
                id="id_page_size"
                value={selectedPageSize}
                onChange={(event) => {
                  setSelectedPageSize(Number(event.target.value));
                }}
              ></input>
            </div>
          </div>
          <button
            name="user-settings"
            onClick={async () => {
              await updateUserConfig({
                page_size: selectedPageSize,
                stylesheet: selectedStylesheet,
              });

              setRefresh(true);
            }}
          >
            Update User Configurations
          </button>
        </div>

        {isSuperuser && (
          <>
            <div className="title-bar">
              <h1>Users</h1>
            </div>
            <div className="settings-group">
              <h2>User Management</h2>
              <p>
                Access the admin interface for basic user management
                functionality like adding and deleting users, changing passwords
                and more.
              </p>
              <a href="/admin/">
                <button>Admin Interface</button>
              </a>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SettingsUser;
