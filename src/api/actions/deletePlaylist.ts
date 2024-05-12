import getCookie from "../../components/getCookie";

const deletePlaylist = async (playlistId: string, allVideos = false) => {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  let params = "";
  if (allVideos) {
    params = "?delete-videos=true";
  }

  const response = await fetch(`/api/playlist/${playlistId}/${params}`, {
    method: "DELETE",
    headers,
    credentials: "same-origin",
  });

  const playlistDeleted = await response.json();
  console.log("deletePlaylist", playlistDeleted);

  return playlistDeleted;
};

export default deletePlaylist;
