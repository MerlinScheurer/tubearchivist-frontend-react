import getCookie from "../../functions/getCookie";
import isDevEnvironment from "../../functions/isDevEnvironment";

const loadVideoProgressById = async (youtubeId: string) => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(`/api/video/${youtubeId}/progress/`, {
    headers,
  });

  const videoProgress = await response.json();

  if (isDevEnvironment()) {
    console.log("loadVideoProgressById", videoProgress);
  }

  return videoProgress;
};

export default loadVideoProgressById;
