import getCookie from "../components/getCookie";

const loadVideoById = async (youtubeId: string) => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(`/api/video/${youtubeId}/`, {
    headers,
    credentials: "include",
  });

  const videos = await response.json();
  console.log("loadVideoById", videos);

  return videos;
};

export default loadVideoById;
