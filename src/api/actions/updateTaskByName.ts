import getCookie from "../../functions/getCookie";

type TaskNamesType =
  | "download_pending"
  | "update_subscribed"
  | "manual_import"
  | "resync_thumbs"
  | "rescan_filesystem";

const updateTaskByName = async (taskName: TaskNamesType) => {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(`/api/task-name/${taskName}/`, {
    method: "POST",
    headers,
    credentials: "same-origin",
  });

  const downloadQueueState = await response.json();
  console.log("updateTaskByName", downloadQueueState);

  return downloadQueueState;
};

export default updateTaskByName;
