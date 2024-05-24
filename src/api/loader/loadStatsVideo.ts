import getCookie from "../../functions/getCookie";
import isDevEnvironment from "../../functions/isDevEnvironment";

const loadStatsVideo = async () => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch("/api/stats/video/", {
    headers,
  });

  const notifications = await response.json();

  if (isDevEnvironment()) {
    console.log("loadStatsVideo", notifications);
  }

  return notifications;
};

export default loadStatsVideo;
