import getCookie from "../../functions/getCookie";

const loadVideoListByPage = async (page: number) => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(`/api/video/?page=${page}`, {
    headers,
    credentials: "include",
  });

  const videos = await response.json();
  console.log("loadVideoListByPage", videos);

  return videos;
};

export default loadVideoListByPage;
