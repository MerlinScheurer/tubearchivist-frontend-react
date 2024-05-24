import getCookie from "../../functions/getCookie";
import isDevEnvironment from "../../functions/isDevEnvironment";

const loadSponsorblockByVideoId = async (youtubeId: string) => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(`/api/video/${youtubeId}/sponsor/`, {
    headers,
  });

  const videos = await response.json();

  if (isDevEnvironment()) {
    console.log("loadSponsorblockByVideoId", videos);
  }

  return videos;
};

export default loadSponsorblockByVideoId;
