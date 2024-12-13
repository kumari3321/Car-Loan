import { remove } from "../Utils";

export const ExpireTokens: any = () => {
    // export function ExpireTokens() {
    remove("accessToken");
    remove("model");
    remove("publishableKey");
    remove("isBusMember");
  };
  