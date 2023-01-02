import { instance } from "../utils/request.js";

export function getFilters() {
  return instance.request("/postings/filters");
}
