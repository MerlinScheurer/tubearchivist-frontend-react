import getCookie from "../../functions/getCookie";

const loadChannelVideosById = async (
  youtubeChannelId: string | undefined,
  page: number,
) => {
  if (!youtubeChannelId) {
    console.log("loadChannelVideosById - youtubeChannelId missing");
    return;
  }

  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(
    `/api/channel/${youtubeChannelId}/video/?page=${page}`,
    {
      headers,
      credentials: "include",
    },
  );

  const videos = await response.json();
  console.log("loadChannelVideosById", videos);

  return videos;
};

export default loadChannelVideosById;
