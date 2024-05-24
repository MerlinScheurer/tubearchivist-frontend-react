import getCookie from "../../functions/getCookie";
import isDevEnvironment from "../../functions/isDevEnvironment";

const loadCommentsbyVideoId = async (youtubeId: string) => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(`/api/video/${youtubeId}/comment/`, {
    headers,
  });

  const comments = await response.json();

  if (isDevEnvironment()) {
    console.log("loadCommentsbyVideoId", comments);
  }

  return comments;
};

export default loadCommentsbyVideoId;
