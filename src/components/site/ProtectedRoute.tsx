import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactElement;
}) {
  const { search, pathname } = useLocation();
  const isAuthed = Boolean(localStorage.getItem("userEmail"));
  if (!isAuthed) {
    const redirectTo = encodeURIComponent(pathname + (search || ""));
    return <Navigate to={`/login?next=${redirectTo}`} replace />;
  }
  return children;
}
