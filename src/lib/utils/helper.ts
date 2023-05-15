import crypto from "crypto-browserify";
import { KEYS, strigaConfig } from "./constants";
import { toast } from "react-toastify";
import axios from "axios";
import { config } from "process";
import { User } from "lib/context/UserContext";

export const calcSig = (body: any, method: string) => {
  const hmac = crypto.createHmac("sha256", KEYS.apiSecret ?? "");
  const time = Date.now().toString();

  hmac.update(time);
  hmac.update(method);
  hmac.update(strigaConfig.baseUrl);

  const contentHash = crypto.createHash("md5");
  contentHash.update(JSON.stringify(body ?? {}));

  hmac.update(contentHash.digest("hex"));

  const auth = `HMAC ${time}:${hmac.digest("hex")}`;

  return auth;
};

export function generateRandomIp() {
  const randomSegment = () => Math.floor(Math.random() * 256);
  return `${randomSegment()}.${randomSegment()}.${randomSegment()}.${randomSegment()}`;
}

export function setItemInStorage(key: string, val: any) {
  localStorage.setItem(key, JSON.stringify(val));
}
export function getItemInStorage(key: string) {
  let val = localStorage.getItem(key);
  return JSON.parse(val ?? "{}");
}

export const notify = (msg: string, type: string) => {
  if (type === "info") {
    return toast.info(msg, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  } else if (type === "success") {
    return toast.success(msg, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  } else if (type === "warning") {
    return toast.warn(msg, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  } else if (type === "error") {
    return toast.error(msg, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
};

export const isSuccess = (res: any) => {
  return (
    (res?.status >= 200 && res?.status < 300) ||
    (res?.statusCode >= 200 && res?.statusCode < 30) ||
    res?.data?.statusCode === 200
  );
};

type CheckLoginParams = {
  onSuccess: () => void;
  onError: () => void;
};

export async function checkLogin({ onSuccess, onError }: CheckLoginParams) {
  try {
    const tokenData = getItemInStorage(KEYS.tokenStorage);

    if (!tokenData || Object.keys(tokenData).length === 0) {
      onError();
      return;
    }

    const { token, refreshToken, expiration } = tokenData;

    const currentTime = new Date().getTime();
    if (currentTime > expiration) {
      // Token has expired, refresh it
      const response = await axios.post(
        `${strigaConfig.baseUrl}/user/refresh`,
        {},
        {
          headers: {
            "x-authorization": token,
            "x-refresh-token": refreshToken,
          },
        }
      );
      setItemInStorage(KEYS.tokenStorage, {
        token: response?.data.token,
        refreshToken: response?.data.refreshToken,
        expiration: new Date().getTime() + 30 * 60000,
      });
    }
    onSuccess();
  } catch (error) {
    console.log("checkLogin method", { error });
    localStorage.removeItem(KEYS.tokenStorage);
    notify("Please login to continue", "error");
    onError();
    return;
  }
}

export function getDateStr(year: number, month: number, day: number): string {
  const date = new Date(year, month - 1, day);
  const yearStr = date.getFullYear().toString().padStart(4, "0");
  const monthStr = (date.getMonth() + 1).toString().padStart(2, "0");
  const dayStr = date.getDate().toString().padStart(2, "0");
  return `${yearStr}-${monthStr}-${dayStr}`;
}
