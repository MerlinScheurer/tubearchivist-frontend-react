import getCookie from "../../functions/getCookie";

const updateChannelSubscription = async (
  channelId: string,
  status: boolean,
) => {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch("/api/channel/", {
    method: "POST",
    headers,

    body: JSON.stringify({
      data: [{ channel_id: channelId, channel_subscribed: status }],
    }),
  });

  const channelSubscription = await response.json();
  console.log("updateChannelSubscription", channelSubscription);

  return channelSubscription;
};

export default updateChannelSubscription;
