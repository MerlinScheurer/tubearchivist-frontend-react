import getCookie from "../../functions/getCookie";
import isDevEnvironment from "../../functions/isDevEnvironment";

const loadSimmilarVideosById = async (youtubeId: string) => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(`/api/video/${youtubeId}/similar/`, {
    headers,
  });

  const videos = await response.json();

  if (isDevEnvironment()) {
    console.log("loadSimmilarVideosById", videos);
  }

  return videos;
};

export default loadSimmilarVideosById;
