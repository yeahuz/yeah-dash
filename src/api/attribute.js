import { instance } from "../utils/request.js";

export function getMany() {
  return instance.request("/attributes");
}

export function createOne(data) {
  return instance.request("/attributes", { body: data });
}

export function deleteOne(id) {
  return instance.request(`/attributes/${id}`, { method: "DELETE" });
}

export function getTranslations(id) {
  return instance.request(`/attributes/${id}/translations`);
}
