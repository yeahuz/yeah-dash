import { instance } from "../utils/request.js";

export function getFilters() {
  return instance.request("/listings/filters");
}

export function getMany(query) {
  return instance.request("/listings", { query })
}

export function updateOne(id, update) {
  return instance.request(`/listings/${id}`, { body: update, method: "PATCH" })
}

