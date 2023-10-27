import { instance } from "../utils/request.js";

export function getServices() {
  return instance.request("/shipping-services");
}
