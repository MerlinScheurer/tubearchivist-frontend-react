import getCookie from "../../components/getCookie";

export type NotificationPages = "download" | "settings" | "channel" | "all";

const loadNotifications = async (pageName: NotificationPages) => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }
  let params = "";
  if (pageName !== "all") {
    params = `?filter=${pageName}`;
  }

  const response = await fetch(`/api/notification/${params}`, {
    headers,
    credentials: "same-origin",
  });

  const notifications = await response.json();
  console.log("loadNotifications", notifications);

  return notifications;
};

export default loadNotifications;
