import getCookie from "../../functions/getCookie";

const deleteVideo = async (videoId: string) => {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(`/api/video/${videoId}/`, {
    method: "DELETE",
    headers,
    credentials: "same-origin",
  });

  const videoDeleted = await response.json();
  console.log("deleteVideo", videoDeleted);

  return videoDeleted;
};

export default deleteVideo;
