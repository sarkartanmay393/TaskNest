export default function ProtectedRoute({ children }: any) {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    window.location.href = "/login";
  }

  return children;
}