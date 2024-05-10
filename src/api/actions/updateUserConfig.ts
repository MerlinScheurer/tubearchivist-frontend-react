import getCookie from "../../components/getCookie";
import { ColourVariants } from "../../configuration/colours/getColours";
import { SortBy, SortOrder, ViewLayout } from "../../pages/Home";

export type UserConfigType = {
  stylesheet?: ColourVariants;
  page_size?: number;
  sort_by?: SortBy;
  sort_order?: SortOrder;
  view_style_home?: ViewLayout;
  view_style_channel?: ViewLayout;
  view_style_downloads?: ViewLayout;
  view_style_playlist?: ViewLayout;
  grid_items?: number;
  hide_watched?: boolean;
  show_ignored_only?: boolean;
  show_subed_only?: boolean;
  sponsorblock_id?: number;
};

const updateUserConfig = async (config: UserConfigType) => {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch("/api/config/user/", {
    method: "POST",
    headers,
    credentials: "same-origin",
    body: JSON.stringify(config),
  });

  const userConfig = await response.json();
  console.log("updateUserConfig", userConfig);

  return userConfig;
};

export default updateUserConfig;
