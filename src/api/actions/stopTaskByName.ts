import getCookie from "../../functions/getCookie";

const stopTaskByName = async (taskId: string) => {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(`/api/task-id/${taskId}/`, {
    method: "POST",
    headers,

    body: JSON.stringify({ command: "stop" }),
  });

  const downloadQueueState = await response.json();
  console.log("stopTaskByName", downloadQueueState);

  return downloadQueueState;
};

export default stopTaskByName;
