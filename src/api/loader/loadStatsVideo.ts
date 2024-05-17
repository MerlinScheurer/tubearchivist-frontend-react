import getCookie from "../../functions/getCookie";

const loadStatsVideo = async () => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch("/api/stats/video/", {
    headers,
    credentials: "same-origin",
  });

  const notifications = await response.json();
  console.log("loadStatsVideo", notifications);

  return notifications;
};

export default loadStatsVideo;
