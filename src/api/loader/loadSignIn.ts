import getCookie from "../../functions/getCookie";

const loadSignIn = async (
  username: string,
  password: string,
  saveLogin: boolean,
) => {
  const responseHead = await fetch("/api/csrf/", {
    method: "HEAD",
  });

  console.log(responseHead);

  const body = new FormData();
  body.set("username", username);
  body.set("password", password);
  body.set("remember_me", saveLogin ? "on" : "off");

  const header = new Headers();

  const csrfCookie = getCookie("csrftoken");
  if (csrfCookie) {
    header.append("X-CSRFToken", csrfCookie);
    body.set("csrfmiddlewaretoken", csrfCookie);
  }

  //TODO: move to /api/login/ and keep token for baerer auth
  const response = await fetch("/login/", {
    method: "POST",
    body,
  });

  return response;
};

export default loadSignIn;
