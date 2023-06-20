import { instance } from "../utils/request.js";

export function getMany(query) {
  return instance.request("/categories", { query });
}

export function createOne(data) {
  return instance.request("/categories", { body: data });
}

export function deleteOne(id) {
  return instance.request(`/categories/${id}`, { method: "DELETE" });
}
