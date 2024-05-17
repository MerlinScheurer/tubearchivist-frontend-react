import getCookie from "../../functions/getCookie";

const loadStatsWatchProgress = async () => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch("/api/stats/watch/", {
    headers,
    credentials: "same-origin",
  });

  const notifications = await response.json();
  console.log("loadStatsWatchProgress", notifications);

  return notifications;
};

export default loadStatsWatchProgress;
