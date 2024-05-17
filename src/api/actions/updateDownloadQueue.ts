import getCookie from "../../functions/getCookie";

const updateDownloadQueue = async (download: string, autostart: boolean) => {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  let params = "";
  if (autostart) {
    params = "?autostart=true";
  }

  const response = await fetch(`/api/download/${params}`, {
    method: "POST",
    headers,
    credentials: "same-origin",
    body: JSON.stringify({
      data: [{ youtube_id: download, status: "pending" }],
    }),
  });

  const downloadState = await response.json();
  console.log("updateDownloadQueue", downloadState);

  return downloadState;
};

export default updateDownloadQueue;
