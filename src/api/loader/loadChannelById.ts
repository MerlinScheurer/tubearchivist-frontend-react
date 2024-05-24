import getCookie from "../../functions/getCookie";
import isDevEnvironment from "../../functions/isDevEnvironment";

const loadChannelById = async (youtubeChannelId: string) => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(`/api/channel/${youtubeChannelId}/`, {
    headers,
  });

  const channel = await response.json();

  if (isDevEnvironment()) {
    console.log("loadChannelById", channel);
  }

  return channel;
};

export default loadChannelById;
