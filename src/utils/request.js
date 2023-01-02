class Request {
  constructor({ baseURL }) {
    this.baseURL = baseURL;
  }

  async request(url, { body, query, method, timeout = 60_000, ...customConfig } = {}) {
    if (query) {
      const params = new URLSearchParams();
      for (const key in query) {
        if (query[key]) params.append(key, query[key]);
      }

      url += "?" + params.toString();
    }

    const isFormData = body instanceof FormData;
    const controller = new AbortController();
    const timerId = setTimeout(controller.abort, timeout);

    const config = {
      signal: controller.signal,
      method: method || (body ? "POST" : "GET"),
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
      ...customConfig,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Accept-Language": "en",
        Accept: "application/json",
        ...(!isFormData && body && { "Content-Type": "application/json" }),
        ...customConfig.headers,
      },
    };

    return window.fetch(this.baseURL + url, config).then(async (response) => {
      clearTimeout(timerId);
      const accept = config.headers["Accept"];
      let data = response;

      switch (accept) {
        case "application/json": {
          data = await response.json().catch(() => {});
          break;
        }
        case "text/html": {
          data = await response.text();
          break;
        }
        default:
      }

      if (!response.ok) {
        return Promise.reject(data);
      }

      return data;
    });
  }
}

export const instance = new Request({ baseURL: import.meta.env.VITE_APP_API_URI })
