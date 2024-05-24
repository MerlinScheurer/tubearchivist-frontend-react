import getCookie from "../../functions/getCookie";

const loadStatsPlaylist = async () => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch("/api/stats/playlist/", {
    headers,
  });

  const notifications = await response.json();
  console.log("loadStatsPlaylist", notifications);

  return notifications;
};

export default loadStatsPlaylist;
