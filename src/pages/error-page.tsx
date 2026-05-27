import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError() as any;
  console.error(error);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "50px",
      }}
    >
      <h1>Oops! Something went wrong.</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <a
        href="/dashboard"
        style={{ color: "#0070f3", textDecoration: "underline" }}
      >
        Back to Dashboard
      </a>
    </div>
  );
}
