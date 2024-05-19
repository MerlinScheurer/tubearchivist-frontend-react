import getCookie from "../../functions/getCookie";

const loadSponsorblockByVideoId = async (youtubeId: string) => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(`/api/video/${youtubeId}/sponsor/`, {
    headers,
    credentials: "include",
  });

  const videos = await response.json();
  console.log("loadSponsorblockByVideoId", videos);

  return videos;
};

export default loadSponsorblockByVideoId;
