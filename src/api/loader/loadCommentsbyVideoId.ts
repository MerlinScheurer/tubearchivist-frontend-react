import getCookie from "../../functions/getCookie";

const loadCommentsbyVideoId = async (youtubeId: string) => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(`/api/video/${youtubeId}/comment/`, {
    headers,
    credentials: "same-origin",
  });

  const comments = await response.json();
  console.log("loadCommentsbyVideoId", comments);

  return comments;
};

export default loadCommentsbyVideoId;
