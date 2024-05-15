import getCookie from "../../components/getCookie";

const loadChannelList = async (page: number, showSubscribed: boolean) => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const searchParams = new URLSearchParams();

  if (page) {
    searchParams.append("page", page.toString());
  }

  if (showSubscribed) {
    searchParams.append("filter", "subscribed");
  }

  const response = await fetch(`/api/channel/?${searchParams.toString()}`, {
    headers,
    credentials: "same-origin",
  });

  const channels = await response.json();
  console.log("loadChannelList", channels);

  return channels;
};

export default loadChannelList;
