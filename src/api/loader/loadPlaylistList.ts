import getCookie from "../../functions/getCookie";

const loadPlaylistList = async (page: number) => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(`/api/playlist/?page=${page}`, {
    headers,
    credentials: "include",
  });

  const playlist = await response.json();
  console.log("loadPlaylistList", playlist);

  return playlist;
};

export default loadPlaylistList;
