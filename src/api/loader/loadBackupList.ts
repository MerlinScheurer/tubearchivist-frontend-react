import getCookie from "../../functions/getCookie";

const loadBackupList = async () => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch("/api/backup/", {
    headers,
  });

  const backupList = await response.json();
  console.log("loadBackupList", backupList);

  return backupList;
};

export default loadBackupList;
