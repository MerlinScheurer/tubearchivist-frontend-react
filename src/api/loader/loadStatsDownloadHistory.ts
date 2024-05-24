import getCookie from "../../functions/getCookie";

const loadStatsDownloadHistory = async () => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch("/api/stats/downloadhist/", {
    headers,
  });

  const notifications = await response.json();
  console.log("loadStatsDownloadHistory", notifications);

  return notifications;
};

export default loadStatsDownloadHistory;
