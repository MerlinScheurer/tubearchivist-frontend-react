import getCookie from "../../components/getCookie";

export type ReindexType = "channel" | "video" | "playlist";

export const ReindexTypeEnum = {
  channel: "channel",
  video: "video",
  playlist: "playlist",
};

const queueReindex = async (
  id: string,
  type: ReindexType,
  reindexVideos = false,
) => {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  let params = "";
  if (reindexVideos) {
    params = "?extract_videos=true";
  }

  const body = JSON.stringify({
    [type]: id,
  });

  const response = await fetch(`/api/refresh/${params}`, {
    method: "POST",
    headers,
    credentials: "same-origin",
    body,
  });

  const channelDeleted = await response.json();
  console.log("queueReindex", channelDeleted);

  return channelDeleted;
};

export default queueReindex;
