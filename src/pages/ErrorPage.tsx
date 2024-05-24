import { useRouteError } from "react-router-dom";

// This is not always the correct response
type ErrorType = {
  statusText: string;
  message: string;
};

const ErrorPage = () => {
  const error = useRouteError() as ErrorType;
  console.error("ErrorPage", error);

  return (
    <div id="error-page" style={{ margin: "10%" }}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error?.statusText}</i>
        <i>{error?.message}</i>
      </p>
    </div>
  );
};

export default ErrorPage;
