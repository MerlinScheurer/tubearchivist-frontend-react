import getCookie from "../../functions/getCookie";
import isDevEnvironment from "../../functions/isDevEnvironment";

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
  });

  const videoDeleted = await response.json();

  if (isDevEnvironment()) {
    console.log("deleteVideo", videoDeleted);
  }

  return videoDeleted;
};

export default deleteVideo;
