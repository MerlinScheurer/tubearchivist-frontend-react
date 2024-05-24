import getCookie from "../../functions/getCookie";
import isDevEnvironment from "../../functions/isDevEnvironment";

const loadSnapshots = async () => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch("/api/snapshot/", {
    headers,
  });

  const backupList = await response.json();

  if (isDevEnvironment()) {
    console.log("loadSnapshots", backupList);
  }

  return backupList;
};

export default loadSnapshots;
