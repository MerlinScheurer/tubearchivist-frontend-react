import getCookie from "../components/getCookie";

const loadVideoList = async () => {
  const params = new URL(document.location).searchParams;

  console.log(params);

  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(`/api/video/?${params.toString()}`, {
    headers,
    credentials: "include",
  });

  const videos = await response.json();
  console.log("loadVideoList", videos);

  return videos;
};

export default loadVideoList;
