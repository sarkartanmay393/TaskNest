export const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080/v1"
    : process.env.SERVER_URL;
