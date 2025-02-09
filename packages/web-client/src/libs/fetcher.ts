import { getAuth } from "firebase/auth";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000");

export const customFetcher = async <T>(config: {
  url: string;
  method: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  data?: unknown;
}): Promise<T> => {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...config.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  
  const urlObj = new URL(config.url, baseUrl);
  if (config.params) {
    for (const [key, value] of Object.entries(config.params)) {
      urlObj.searchParams.append(key, value);
    }
  }

  const response = await fetch(urlObj.toString(), {
    method: config.method,
    headers,
    body: config.data ? JSON.stringify(config.data) : undefined,
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
