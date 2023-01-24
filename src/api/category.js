import { instance } from "../utils/request.js";

export function getMany() {
  return instance.request("/categories");
}

export function createOne(data) {
  return instance.request("/categories", { body: data });
}

export function deleteOne(id) {
  return instance.request(`/categories/${id}`, { method: "DELETE" });
}
