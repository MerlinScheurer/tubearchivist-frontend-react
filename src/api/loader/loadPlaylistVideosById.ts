import getCookie from "../../functions/getCookie";
import isDevEnvironment from "../../functions/isDevEnvironment";

const loadPlaylistVideosById = async (
  playlistId: string | undefined,
  page: number,
) => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(
    `/api/playlist/${playlistId}/video/?page=${page}`,
    {
      headers,
    },
  );

  const videos = await response.json();

  if (isDevEnvironment()) {
    console.log("loadPlaylistVideosById", videos);
  }

  return videos;
};

export default loadPlaylistVideosById;
