import { instance } from "../utils/request.js";

export function login(data) {
  return instance.request("/auth/login", { body: data })
}

export function generateRequest({ type = "get", token } = {}) {
  return instance.request("/auth/requests", { query: { type, token } });
}

export function verifyAssertion(data) {
  return instance.request("/auth/assertions", { body: data });
}

export function getMe() {
  return instance.request("/auth/session");
}

export function logout() {
  return instance.request("/auth/session", { method: "DELETE" });
}
