import getCookie from "../../functions/getCookie";

export type NotificationPages = "download" | "settings" | "channel" | "all";

const loadNotifications = async (
  pageName: NotificationPages,
  includeReindex = false,
) => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  let params = "";
  if (!includeReindex && pageName !== "all") {
    params = `?filter=${pageName}`;
  }

  const response = await fetch(`/api/notification/${params}`, {
    headers,
  });

  const notifications = await response.json();
  console.log("loadNotifications", notifications);

  return notifications;
};

export default loadNotifications;
