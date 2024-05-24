import getCookie from "../../functions/getCookie";

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
  console.log("loadStatsDownload", notifications);

  return notifications;
};

export default loadStatsDownload;
