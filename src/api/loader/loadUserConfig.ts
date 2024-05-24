import { UserConfigType } from "../actions/updateUserConfig";
import getCookie from "../../functions/getCookie";

const loadUserConfig = async (): Promise<UserConfigType> => {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch("/api/config/user/", {
    headers,
  });

  const userConfig = await response.json();
  console.log("userConfig", userConfig);

  return userConfig;
};

export default loadUserConfig;
