export const get: any = function (key: string) {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    } else return null;
  };
  
  export const set: any = function (key: string, value: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    } else return null;
  };
  
  export const remove: any = function (key: string) {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    } else return null;
  };
  