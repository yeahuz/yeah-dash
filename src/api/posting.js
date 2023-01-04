import { instance } from "../utils/request.js";

export function getFilters() {
  return instance.request("/postings/filters");
}

export function getMany(query) {
  return instance.request("/postings", { query })
}

export function updateOne(id, update) {
  return instance.request(`/postings/${id}`, { body: update, method: "PATCH" })
}
