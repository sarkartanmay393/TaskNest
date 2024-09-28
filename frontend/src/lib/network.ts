export const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080/v1"
    : "https://tsm-tsx-backend.vercel.app/v1";
