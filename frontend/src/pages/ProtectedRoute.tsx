export default function ProtectedRoute({ children }: any) {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken || accessToken === "" || accessToken === null || accessToken === "undefined") {
    sessionStorage.clear();
    window.location.href = "/login";
  } else {
    return children;
  }
}