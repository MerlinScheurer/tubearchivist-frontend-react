import getCookie from "../../functions/getCookie";
import isDevEnvironment from "../../functions/isDevEnvironment";

const loadDownloadQueue = async (
  page: number,
  channelId: string | null,
  showIgnored: boolean,
) => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const searchParams = new URLSearchParams();

  if (page) {
    searchParams.append("page", page.toString());
  }

  if (channelId) {
    searchParams.append("channel", channelId);
  }

  searchParams.append("filter", showIgnored ? "ignore" : "pending");

  const response = await fetch(`/api/download/?${searchParams.toString()}`, {
    headers,
  });

  const playlist = await response.json();

  if (isDevEnvironment()) {
    console.log("loadDownloadQueue", playlist);
  }

  return playlist;
};

export default loadDownloadQueue;
