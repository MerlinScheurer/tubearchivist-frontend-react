import getCookie from "../../functions/getCookie";
import isDevEnvironment from "../../functions/isDevEnvironment";

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
  });

  const downloadState = await response.json();

  if (isDevEnvironment()) {
    console.log("deleteDownloadQueueByFilter", downloadState);
  }

  return downloadState;
};

export default deleteDownloadQueueByFilter;
