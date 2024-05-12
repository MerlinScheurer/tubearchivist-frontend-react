import getCookie from "../../components/getCookie";

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
      credentials: "include",
    },
  );

  const videos = await response.json();
  console.log("loadPlaylistVideosById", videos);

  return videos;
};

export default loadPlaylistVideosById;
