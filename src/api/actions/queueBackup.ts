import getCookie from "../../functions/getCookie";

const queueBackup = async () => {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch("/api/backup/", {
    method: "POST",
    headers,
    credentials: "same-origin",
  });

  const backupQueued = await response.json();
  console.log("queueBackup", backupQueued);

  return backupQueued;
};

export default queueBackup;
