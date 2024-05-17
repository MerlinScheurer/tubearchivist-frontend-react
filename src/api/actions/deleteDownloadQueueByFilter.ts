import getCookie from "../../functions/getCookie";

type FilterType = "ignore" | "pending";

const deleteDownloadQueueByFilter = async (filter: FilterType) => {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const searchParams = new URLSearchParams();

  if (filter) {
    searchParams.append("filter", filter);
  }

  const response = await fetch(`/api/download/?${searchParams.toString()}`, {
    method: "DELETE",
    headers,
    credentials: "same-origin",
  });

  const downloadState = await response.json();
  console.log("deleteDownloadQueueByFilter", downloadState);

  return downloadState;
};

export default deleteDownloadQueueByFilter;
