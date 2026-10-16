//D:\D-Luxury-Car-Showroom\Frontend\src\api\axios.ts
import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

/* =========================================================
   API
========================================================= */

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api/v1",

  withCredentials: true,

  headers: {
    "Content-Type":
      "application/json",
  },
});

/* =========================================================
   ACCESS TOKEN
========================================================= */

let accessToken:
  | string
  | null = null;

export function setAccessToken(
  token: string | null,
) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

/* =========================================================
   REQUEST INTERCEPTOR
========================================================= */

api.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig,
  ) => {
    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) =>
    Promise.reject(error),
);

/* =========================================================
   REFRESH CONTROL
========================================================= */

let refreshPromise:
  | Promise<string | null>
  | null = null;

/* =========================================================
   REFRESH ACCESS TOKEN
========================================================= */

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise =
      axios
        .post(
          `${
            import.meta.env
              .VITE_API_URL ||
            "http://localhost:5000/api/v1"
          }/auth/refresh`,
          {},
          {
            withCredentials:
              true,
          },
        )
        .then(
          (response) => {
            const token =
              response.data
                ?.data
                ?.accessToken;

            if (token) {
              setAccessToken(
                token,
              );

              return token;
            }

            return null;
          },
        )
        .catch(() => {
          setAccessToken(null);

          return null;
        })
        .finally(() => {
          refreshPromise = null;
        });
  }

  return refreshPromise;
}

/* =========================================================
   RESPONSE INTERCEPTOR
========================================================= */

api.interceptors.response.use(
  (response) =>
    response,

  async (
    error: AxiosError,
  ) => {
    const originalRequest =
      error.config as
        | (InternalAxiosRequestConfig & {
            _retry?: boolean;
          })
        | undefined;

    if (
      error.response?.status ===
        401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes(
        "/auth/refresh",
      ) &&
      !originalRequest.url?.includes(
        "/auth/login",
      )
    ) {
      originalRequest._retry =
        true;

      const token =
        await refreshAccessToken();

      if (token) {
        originalRequest.headers.Authorization =
          `Bearer ${token}`;

        return api(
          originalRequest,
        );
      }
    }

    return Promise.reject(
      error,
    );
  },
);

export default api;