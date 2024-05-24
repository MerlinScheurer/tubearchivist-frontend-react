import getCookie from "../../functions/getCookie";
import isDevEnvironment from "../../functions/isDevEnvironment";

const restoreBackup = async (fileName: string) => {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch(`/api/backup/${fileName}/`, {
    method: "POST",
    headers,
  });

  const backupRestored = await response.json();

  if (isDevEnvironment()) {
    console.log("restoreBackup", backupRestored);
  }

  return backupRestored;
};

export default restoreBackup;
