import { Link } from "react-router-dom";
import Notifications from "./Notifications";
import getIsAdmin from "./getIsAdmin";
import Routes from "../configuration/routes/RouteList";

const SettingsNavigation = () => {
  const isAdmin = getIsAdmin();
  return (
    <>
      <div className="info-box-item child-page-nav">
        <Link to={Routes.SettingsDashboard}>
          <h3>Dashboard</h3>
        </Link>
        <Link to={Routes.SettingsUser}>
          <h3>User</h3>
        </Link>

        {isAdmin && (
          <>
            <Link to={Routes.SettingsApplication}>
              <h3>Application</h3>
            </Link>
            <Link to={Routes.SettingsScheduling}>
              <h3>Scheduling</h3>
            </Link>
            <Link to={Routes.SettingsActions}>
              <h3>Actions</h3>
            </Link>
          </>
        )}
      </div>
      <Notifications pageName={"settings"} />
    </>
  );
};

export default SettingsNavigation;
