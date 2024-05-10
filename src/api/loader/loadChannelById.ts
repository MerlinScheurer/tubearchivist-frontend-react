import getCookie from "../../components/getCookie";

const loadChannelById = async (youtubeChannelId: string) => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(`/api/channel/${youtubeChannelId}/`, {
    headers,
    credentials: "include",
  });

  const channel = await response.json();
  console.log("loadChannelById", channel);

  return channel;
};

export default loadChannelById;
