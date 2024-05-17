import getCookie from "../../functions/getCookie";

const updatePlaylistSubscription = async (
  playlistId: string,
  status: boolean,
) => {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch("/api/playlist/", {
    method: "POST",
    headers,
    credentials: "same-origin",
    body: JSON.stringify({
      data: [{ playlist_id: playlistId, playlist_subscribed: status }],
    }),
  });

  const playlistSubscription = await response.json();
  console.log("updatePlaylistSubscription", playlistSubscription);

  return playlistSubscription;
};

export default updatePlaylistSubscription;
