import getCookie from "../../components/getCookie";

const loadStatsChannel = async () => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch("/api/stats/channel/", {
    headers,
    credentials: "same-origin",
  });

  const notifications = await response.json();
  console.log("loadStatsChannel", notifications);

  return notifications;
};

export default loadStatsChannel;
