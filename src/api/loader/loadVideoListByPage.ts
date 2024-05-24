import getCookie from "../../functions/getCookie";
import isDevEnvironment from "../../functions/isDevEnvironment";

const loadVideoListByPage = async (page: number) => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(`/api/video/?page=${page}`, {
    headers,
  });

  const videos = await response.json();

  if (isDevEnvironment()) {
    console.log("loadVideoListByPage", videos);
  }

  return videos;
};

export default loadVideoListByPage;
