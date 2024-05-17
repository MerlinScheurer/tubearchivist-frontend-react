import getCookie from "../../functions/getCookie";

const loadStatsBiggestChannels = async () => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch("/api/stats/biggestchannels/", {
    headers,
    credentials: "same-origin",
  });

  const notifications = await response.json();
  console.log("loadStatsBiggestChannels", notifications);

  return notifications;
};

export default loadStatsBiggestChannels;
