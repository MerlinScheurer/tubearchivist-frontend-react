import getCookie from "../../functions/getCookie";
import isDevEnvironment from "../../functions/isDevEnvironment";

const loadStatsChannel = async () => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch("/api/stats/channel/", {
    headers,
  });

  const notifications = await response.json();

  if (isDevEnvironment()) {
    console.log("loadStatsChannel", notifications);
  }

  return notifications;
};

export default loadStatsChannel;
