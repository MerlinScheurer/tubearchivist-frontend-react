import getCookie from "../../functions/getCookie";

const queueSnapshot = async () => {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch("/api/snapshot/", {
    method: "POST",
    headers,
  });

  const snapshotQueued = await response.json();
  console.log("queueSnapshot", snapshotQueued);

  return snapshotQueued;
};

export default queueSnapshot;
