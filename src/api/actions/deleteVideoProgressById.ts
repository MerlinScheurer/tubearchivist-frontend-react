import getCookie from "../../functions/getCookie";

const deleteVideoProgressById = async (youtubeId: string) => {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(`/api/video/${youtubeId}/progress/`, {
    method: "DELETE",
    headers,
    credentials: "same-origin",
  });

  const watchedState = await response.json();
  console.log("deleteVideoProgressById", watchedState);

  return watchedState;
};

export default deleteVideoProgressById;
