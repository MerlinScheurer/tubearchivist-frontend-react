import getCookie from "../../functions/getCookie";

export type DownloadQueueStatus = "ignore" | "pending" | "priority";

const updateDownloadQueueStatusById = async (
  youtubeId: string,
  status: DownloadQueueStatus,
) => {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(`/api/download/${youtubeId}/`, {
    method: "POST",
    headers,
    credentials: "same-origin",
    body: JSON.stringify({
      status,
    }),
  });

  const downloadQueueState = await response.json();
  console.log("updateDownloadQueueStatusById", downloadQueueState);

  return downloadQueueState;
};

export default updateDownloadQueueStatusById;
