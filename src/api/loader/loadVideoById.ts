import getCookie from "../../functions/getCookie";
import isDevEnvironment from "../../functions/isDevEnvironment";

const loadVideoById = async (youtubeId: string) => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(`/api/video/${youtubeId}/`, {
    headers,
  });

  const videos = await response.json();

  if (isDevEnvironment()) {
    console.log("loadVideoById", videos);
  }

  return videos;
};

export default loadVideoById;
