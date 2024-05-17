import getCookie from "../../functions/getCookie";

const deleteDownloadById = async (youtubeId: string) => {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(`/api/download/${youtubeId}/`, {
    method: "DELETE",
    headers,
    credentials: "same-origin",
  });

  const downloadState = await response.json();
  console.log("deleteDownloadById", downloadState);

  return downloadState;
};

export default deleteDownloadById;
