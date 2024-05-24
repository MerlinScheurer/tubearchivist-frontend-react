import getCookie from "../../functions/getCookie";
import isDevEnvironment from "../../functions/isDevEnvironment";

const loadStatsDownload = async () => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch("/api/stats/download/", {
    headers,
  });

  const notifications = await response.json();

  if (isDevEnvironment()) {
    console.log("loadStatsDownload", notifications);
  }

  return notifications;
};

export default loadStatsDownload;
