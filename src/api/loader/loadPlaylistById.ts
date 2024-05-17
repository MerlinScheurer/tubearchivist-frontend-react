import getCookie from "../../functions/getCookie";

const loadPlaylistById = async (playlistId: string | undefined) => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(`/api/playlist/${playlistId}/`, {
    headers,
    credentials: "include",
  });

  const videos = await response.json();
  console.log("loadPlaylistById", videos);

  return videos;
};

export default loadPlaylistById;
