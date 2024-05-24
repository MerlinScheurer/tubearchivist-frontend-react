import getCookie from "../../functions/getCookie";

const restoreSnapshot = async (snapshotId: string) => {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(`/api/snapshot/${snapshotId}/`, {
    method: "POST",
    headers,
  });

  const backupRestored = await response.json();
  console.log("restoreSnapshot", backupRestored);

  return backupRestored;
};

export default restoreSnapshot;
