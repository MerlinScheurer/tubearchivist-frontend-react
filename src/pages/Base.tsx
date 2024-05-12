import {
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import Routes from "../configuration/routes/RouteList";
import Footer from "../components/Footer";
import iconSearch from "/img/icon-search.svg";
import iconGear from "/img/icon-gear.svg";
import iconExit from "/img/icon-exit.svg";
import importColours from "../configuration/colours/getColours";
import { UserConfigType } from "../api/actions/updateUserConfig";
import { useEffect, useState } from "react";
import getIsAdmin from "../components/getIsAdmin";

type BaseLoaderData = {
  userConfig: UserConfigType;
};

export type OutletContextType = [number, () => void];

const Base = () => {
  const { userConfig } = useLoaderData() as BaseLoaderData;
  const location = useLocation();

  const searchParams2 = new URLSearchParams(location.search);

  const currentPageFromUrl = Number(searchParams2.get("page"));

  const [currentPage, setCurrentPage] = useState(currentPageFromUrl);
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    console.log("location");
    if (currentPageFromUrl !== currentPage) {
      setCurrentPage(0);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (currentPageFromUrl !== currentPage) {
      console.log("url");
      setCurrentPage(currentPageFromUrl);
    }
  }, [currentPageFromUrl]);

  useEffect(() => {
    if (currentPageFromUrl !== currentPage) {
      console.log("currentpage");
      setSearchParams((params) => {
        params.set("page", currentPage.toString());

        return params;
      });
    }
  }, [currentPage]);

  importColours(userConfig.stylesheet);

  const version = "v0.4.8-unstable";
  // const ta_update: TaUpdate = { version: "testing v2", is_breaking: false };

  const isAdmin = getIsAdmin();

  return (
    <>
      <div className="main-content">
        <div className="boxed-content">
          <Link to={Routes.Home}>
            <div className="top-banner"></div>
          </Link>
          <div className="top-nav">
            <div className="nav-items">
              <Link to={Routes.Home}>
                <div className="nav-item">home</div>
              </Link>

              <Link to={Routes.Channels}>
                <div className="nav-item">channels</div>
              </Link>

              <Link to={Routes.Playlists}>
                <div className="nav-item">playlists</div>
              </Link>

              {isAdmin && (
                <Link to={Routes.Downloads}>
                  <div className="nav-item">downloads</div>
                </Link>
              )}
            </div>
            <div className="nav-icons">
              <Link to={Routes.Search}>
                <img src={iconSearch} alt="search-icon" title="Search" />
              </Link>
              <Link to={Routes.Settings}>
                <img src={iconGear} alt="gear-icon" title="Settings" />
              </Link>
              <Link to={Routes.Logout}>
                <img
                  className="alert-hover"
                  src={iconExit}
                  alt="exit-icon"
                  title="Logout"
                />
              </Link>
            </div>
          </div>
        </div>
        {/** Outlet: https://reactrouter.com/en/main/components/outlet */}
        <Outlet context={[currentPage, setCurrentPage]} />
      </div>
      <Footer version={version} />
    </>
  );
};

export default Base;
