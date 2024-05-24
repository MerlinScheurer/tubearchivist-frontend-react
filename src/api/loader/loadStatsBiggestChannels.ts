import getCookie from "../../functions/getCookie";

type BiggestChannelsOrderType = "doc_count" | "duration" | "media_size";

const loadStatsBiggestChannels = async (order: BiggestChannelsOrderType) => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const searchParams = new URLSearchParams();
  searchParams.append("order", order);

  const response = await fetch(
    `/api/stats/biggestchannels/?${searchParams.toString()}`,
    {
      headers,
    },
  );

  const notifications = await response.json();
  console.log("loadStatsBiggestChannels", notifications);

  return notifications;
};

export default loadStatsBiggestChannels;
