import getCookie from "../../functions/getCookie";

const loadAuth = async () => {
  const headers = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch("/api/ping/", {
    headers,
  });

  return response;
};

export default loadAuth;
