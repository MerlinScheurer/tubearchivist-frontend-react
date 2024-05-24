import getCookie from "../../functions/getCookie";

const deleteApiToken = async () => {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    headers.append("X-CSRFToken", csrfCookie);
  }

  const response = await fetch("/api/token/", {
    method: "DELETE",
    headers,
  });

  const resetToken = await response.json();
  console.log("deleteApiToken", resetToken);

  return resetToken;
};

export default deleteApiToken;
