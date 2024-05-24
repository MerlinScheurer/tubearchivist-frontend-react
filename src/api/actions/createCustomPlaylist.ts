import getCookie from "../../functions/getCookie";

const createCustomPlaylist = async (playlistId: string) => {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch("/api/playlist/", {
    method: "POST",
    headers,

    body: JSON.stringify({ data: { create: playlistId } }),
  });

  const customPlaylist = await response.json();
  console.log("createCustomPlaylist", customPlaylist);

  return customPlaylist;
};

export default createCustomPlaylist;
